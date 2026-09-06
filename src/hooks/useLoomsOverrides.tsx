import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { mapLoom, isUuid } from "@/lib/portalMappers";
import type { Loom } from "@/types/portal";

type Ctx = {
  getLooms: () => Loom[];
  upsertLoom: (loom: Loom) => void;
  deleteLoom: (id: string) => void;
};

const Context = createContext<Ctx | null>(null);

export function LoomsOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const queryClient = useQueryClient();
  const queryKey = ["looms", clinicaId];

  const { data: looms = [] } = useQuery({
    queryKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("looms")
        .select("*")
        .eq("clinica_id", clinicaId)
        .order("semana", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapLoom);
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const upsertMut = useMutation({
    mutationFn: async (loom: Loom) => {
      const payload = {
        clinica_id: clinicaId,
        semana: loom.semana,
        fecha: loom.fechaIso || null,
        titulo: loom.titulo,
        duracion: loom.duracion,
        tags: loom.tags,
        servicios_slugs: loom.serviciosSlugs,
        resumen: loom.resumen,
        link_loom: loom.linkLoom,
        visto_cliente: loom.vistoCliente,
      };
      const { error } = isUuid(loom.id)
        ? await supabase.from("looms").update(payload as never).eq("id", loom.id)
        : await supabase.from("looms").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("looms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const value = useMemo<Ctx>(
    () => ({
      getLooms: () => looms,
      upsertLoom: (loom) => upsertMut.mutate(loom),
      deleteLoom: (id) => deleteMut.mutate(id),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [looms, clinicaId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useLoomsOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useLoomsOverrides must be used within LoomsOverridesProvider");
  return ctx;
}

export function loomEmbedUrl(link: string): string | null {
  const m = link.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
  if (!m) return null;
  return `https://www.loom.com/embed/${m[1]}`;
}
