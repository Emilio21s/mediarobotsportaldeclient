import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { mapRecurso, isUuid } from "@/lib/portalMappers";
import type { Recurso } from "@/types/portal";

type Ctx = {
  getRecursos: () => Recurso[];
  upsertRecurso: (r: Recurso) => void;
  deleteRecurso: (id: string) => void;
  nextId: () => string;
};

const Context = createContext<Ctx | null>(null);

export function RecursosOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const queryClient = useQueryClient();
  const queryKey = ["recursos", clinicaId];

  const { data: recursos = [] } = useQuery({
    queryKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recursos")
        .select("*")
        .eq("clinica_id", clinicaId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map(mapRecurso);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const upsertMut = useMutation({
    mutationFn: async (r: Recurso) => {
      const payload = {
        clinica_id: clinicaId,
        titulo: r.titulo,
        descripcion: r.descripcion ?? "",
        tipo: r.tipo,
        categoria: r.categoria ?? "accesos",
        link: r.link ?? "",
      };
      const { error } = isUuid(r.id)
        ? await supabase.from("recursos").update(payload as never).eq("id", r.id)
        : await supabase.from("recursos").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recursos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const value = useMemo<Ctx>(
    () => ({
      getRecursos: () => recursos,
      upsertRecurso: (r) => upsertMut.mutate(r),
      deleteRecurso: (id) => deleteMut.mutate(id),
      nextId: () => `new-${Date.now()}`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recursos, clinicaId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRecursosOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useRecursosOverrides must be used within RecursosOverridesProvider");
  return ctx;
}
