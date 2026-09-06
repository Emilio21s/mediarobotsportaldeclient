import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";

export type Prioridad = "alta" | "media" | "baja";
export type Columna = "backlog" | "progreso" | "revision" | "completado";

export interface Comentario {
  autor: string;
  rol: "agency" | "client";
  texto: string;
  fecha: string;
}

export interface Tarea {
  id: string;
  clinicaId: string;
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  fechaEntrega: string; // YYYY-MM-DD
  columna: Columna;
  servicioSlug?: string;
  entregableId?: string;
  createdBy: "agency" | "client";
  createdAt: string;
  comentarios: Comentario[];
}

const toDbEstado = (c: Columna) => (c === "progreso" ? "en-progreso" : c);
const fromDbEstado = (e: string): Columna => (e === "en-progreso" ? "progreso" : (e as Columna));

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapTarea(row: any): Tarea {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    titulo: row.titulo,
    descripcion: row.descripcion ?? undefined,
    prioridad: row.prioridad,
    fechaEntrega: row.fecha_entrega ?? "",
    columna: fromDbEstado(row.estado),
    servicioSlug: row.servicio_slug ?? undefined,
    entregableId: row.entregable_id ?? undefined,
    createdBy: row.creado_por === "cliente" ? "client" : "agency",
    createdAt: row.created_at,
    comentarios: (row.tarea_comentarios ?? [])
      .map((c: any) => ({
        autor: c.autor,
        rol: "agency" as const,
        texto: c.texto,
        fecha: c.created_at,
      }))
      .sort((a: Comentario, b: Comentario) => a.fecha.localeCompare(b.fecha)),
  };
}

type Ctx = {
  tareas: Tarea[];
  loading: boolean;
  add: (t: Omit<Tarea, "id" | "clinicaId" | "createdAt" | "comentarios">) => void;
  update: (id: string, patch: Partial<Tarea>) => void;
  remove: (id: string) => void;
  move: (id: string, columna: Columna) => void;
  addComment: (id: string, c: Omit<Comentario, "fecha">) => void;
};

const Context = createContext<Ctx | null>(null);

export function TareasProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const { user } = useAuth();
  const clinicaId = activeClinic.id;
  const queryClient = useQueryClient();
  const queryKey = ["tareas", clinicaId];

  const { data: tareas = [], isLoading } = useQuery({
    queryKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tareas")
        .select("*, tarea_comentarios(*)")
        .eq("clinica_id", clinicaId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapTarea);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addMut = useMutation({
    mutationFn: async (t: Omit<Tarea, "id" | "clinicaId" | "createdAt" | "comentarios">) => {
      const { error } = await supabase.from("tareas").insert({
        clinica_id: clinicaId,
        titulo: t.titulo,
        descripcion: t.descripcion ?? null,
        prioridad: t.prioridad,
        fecha_entrega: t.fechaEntrega || null,
        estado: toDbEstado(t.columna) as never,
        servicio_slug: (t.servicioSlug ?? "diseno-web") as never,
        entregable_id: t.entregableId ?? null,
        creado_por: t.createdBy === "client" ? "cliente" : "agencia",
        created_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Tarea> }) => {
      const payload: Record<string, unknown> = {};
      if (patch.titulo !== undefined) payload.titulo = patch.titulo;
      if (patch.descripcion !== undefined) payload.descripcion = patch.descripcion || null;
      if (patch.prioridad !== undefined) payload.prioridad = patch.prioridad;
      if (patch.fechaEntrega !== undefined) payload.fecha_entrega = patch.fechaEntrega || null;
      if (patch.columna !== undefined) payload.estado = toDbEstado(patch.columna);
      if (patch.servicioSlug !== undefined) payload.servicio_slug = patch.servicioSlug;
      if (patch.entregableId !== undefined) payload.entregable_id = patch.entregableId || null;
      const { error } = await supabase.from("tareas").update(payload as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const removeMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tareas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const commentMut = useMutation({
    mutationFn: async ({ id, c }: { id: string; c: Omit<Comentario, "fecha"> }) => {
      const { error } = await supabase.from("tarea_comentarios").insert({
        tarea_id: id,
        autor: c.autor,
        texto: c.texto,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const value = useMemo<Ctx>(
    () => ({
      tareas,
      loading: isLoading,
      add: (t) => addMut.mutate(t),
      update: (id, patch) => updateMut.mutate({ id, patch }),
      remove: (id) => removeMut.mutate(id),
      move: (id, columna) => updateMut.mutate({ id, patch: { columna } }),
      addComment: (id, c) => commentMut.mutate({ id, c }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tareas, isLoading, clinicaId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTareas() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useTareas must be used within TareasProvider");
  return ctx;
}
