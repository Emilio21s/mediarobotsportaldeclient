import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { ENTREGABLE_STATUS_COLORS, SERVICIO_NOMBRE, fechaCorta, isUuid } from "@/lib/portalMappers";
import type { Entregable, ServicioSlug } from "@/types/portal";

export interface PasoLocal {
  id: string;
  fecha: string;
  fechaIso: string;
  texto: string;
  tipo: "accion" | "call" | "hito";
}

export type EntregableStatus = Entregable["status"];

export interface EntregableLocal {
  id: string;
  nombre: string;
  servicioSlug: ServicioSlug;
  servicio: string;
  version: string;
  status: EntregableStatus;
  fecha: string;
  fechaIso?: string;
  statusColor: string;
}

export const ENTREGABLE_STATUS_COLOR: Record<EntregableStatus, string> =
  ENTREGABLE_STATUS_COLORS as Record<EntregableStatus, string>;

export interface ServicioOverride {
  avanceManual?: number | null;
}

type Ctx = {
  getOverride: (slug: string) => ServicioOverride;
  setAvanceManual: (slug: string, value: number | null) => void;
  setPasos: (slug: string, pasos: PasoLocal[]) => void;
  getEntregables: (slug: ServicioSlug) => EntregableLocal[];
  setEntregables: (slug: ServicioSlug, entregables: EntregableLocal[]) => void;
  getAllEntregables: () => EntregableLocal[];
  getPasos: (slug: ServicioSlug) => PasoLocal[];
  getAllPasos: () => Array<PasoLocal & { servicioSlug: ServicioSlug }>;
};

const Context = createContext<Ctx | null>(null);

/* eslint-disable @typescript-eslint/no-explicit-any */

export function ServicioOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const queryClient = useQueryClient();
  const [manual, setManual] = useState<Record<string, number | null>>({});

  const entregablesKey = ["entregables", clinicaId];
  const pasosKey = ["pasos", clinicaId];

  const { data: entregables = [] } = useQuery({
    queryKey: entregablesKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entregables")
        .select("*")
        .eq("clinica_id", clinicaId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map((row: any): EntregableLocal & { servicioSlug: ServicioSlug } => ({
        id: row.id,
        nombre: row.nombre,
        servicioSlug: row.servicio_slug,
        servicio: SERVICIO_NOMBRE[row.servicio_slug as ServicioSlug] ?? row.servicio_slug,
        version: row.version,
        status: row.status,
        fecha: fechaCorta(row.fecha),
        fechaIso: row.fecha ?? "",
        statusColor: ENTREGABLE_STATUS_COLORS[row.status] ?? "#787672",
      }));
    },
  });

  const { data: pasos = [] } = useQuery({
    queryKey: pasosKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pasos")
        .select("*")
        .eq("clinica_id", clinicaId)
        .order("fecha_iso");
      if (error) throw error;
      return (data ?? []).map((row: any) => ({
        id: row.id as string,
        fecha: fechaCorta(row.fecha_iso),
        fechaIso: (row.fecha_iso ?? "") as string,
        texto: row.texto as string,
        tipo: row.tipo as PasoLocal["tipo"],
        servicioSlug: (row.servicio_slug ?? undefined) as ServicioSlug | undefined,
      }));
    },
  });

  const syncEntregables = useMutation({
    mutationFn: async ({ slug, list }: { slug: ServicioSlug; list: EntregableLocal[] }) => {
      const existing = entregables.filter((e) => e.servicioSlug === slug);
      const keep = new Set(list.filter((e) => isUuid(e.id)).map((e) => e.id));
      const toDelete = existing.filter((e) => !keep.has(e.id)).map((e) => e.id);
      if (toDelete.length) {
        const { error } = await supabase.from("entregables").delete().in("id", toDelete);
        if (error) throw error;
      }
      for (const e of list) {
        const payload = {
          clinica_id: clinicaId,
          nombre: e.nombre,
          servicio_slug: slug,
          version: e.version,
          status: e.status,
          fecha: e.fechaIso || null,
        };
        const { error } = isUuid(e.id)
          ? await supabase.from("entregables").update(payload as never).eq("id", e.id)
          : await supabase.from("entregables").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: entregablesKey });
      void queryClient.invalidateQueries({ queryKey: ["tareas", clinicaId] });
    },
  });

  const syncPasos = useMutation({
    mutationFn: async ({ slug, list }: { slug: string; list: PasoLocal[] }) => {
      const existing = pasos.filter((p) => p.servicioSlug === slug);
      const keep = new Set(list.filter((p) => isUuid(p.id)).map((p) => p.id));
      const toDelete = existing.filter((p) => !keep.has(p.id)).map((p) => p.id);
      if (toDelete.length) {
        const { error } = await supabase.from("pasos").delete().in("id", toDelete);
        if (error) throw error;
      }
      for (const p of list) {
        const payload = {
          clinica_id: clinicaId,
          servicio_slug: slug,
          texto: p.texto,
          fecha_iso: p.fechaIso || null,
          tipo: p.tipo,
        };
        const { error } = isUuid(p.id)
          ? await supabase.from("pasos").update(payload as never).eq("id", p.id)
          : await supabase.from("pasos").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: pasosKey }),
  });

  const getEntregables = useCallback(
    (slug: ServicioSlug) => entregables.filter((e) => e.servicioSlug === slug),
    [entregables],
  );

  const getPasos = useCallback(
    (slug: ServicioSlug): PasoLocal[] =>
      pasos.filter((p) => p.servicioSlug === slug).map(({ servicioSlug: _s, ...rest }) => rest),
    [pasos],
  );

  const value = useMemo<Ctx>(
    () => ({
      getOverride: (slug) => ({ avanceManual: manual[slug] ?? null }),
      setAvanceManual: (slug, v) => setManual((m) => ({ ...m, [slug]: v })),
      setPasos: (slug, list) => syncPasos.mutate({ slug, list }),
      getEntregables,
      setEntregables: (slug, list) => syncEntregables.mutate({ slug, list }),
      getAllEntregables: () => entregables,
      getPasos,
      getAllPasos: () =>
        pasos
          .filter((p) => !!p.servicioSlug)
          .map((p) => ({ ...p, servicioSlug: p.servicioSlug as ServicioSlug })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entregables, pasos, manual, clinicaId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useServicioOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useServicioOverrides must be used within ServicioOverridesProvider");
  return ctx;
}
