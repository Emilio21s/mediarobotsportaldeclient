import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import {
  mapEntregable,
  mapLoom,
  mapMetrica,
  mapMiembro,
  mapPaso,
  mapRecurso,
} from "@/lib/portalMappers";

function useTable<T>(table: string, clinicaId: string, map: (row: unknown) => T, order?: string) {
  return useQuery({
    queryKey: [table, clinicaId],
    enabled: !!clinicaId,
    queryFn: async () => {
      let q = supabase.from(table as never).select("*").eq("clinica_id", clinicaId);
      if (order) q = q.order(order);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(map);
    },
  });
}

/**
 * Returns all portal collections for the active clinic, from the database.
 */
export function useClinicData() {
  const { activeClinic } = useSession();
  const id = activeClinic.id;

  const looms = useTable("looms", id, mapLoom, "semana");
  const pasos = useTable("pasos", id, mapPaso, "fecha_iso");
  const entregables = useTable("entregables", id, mapEntregable, "created_at");
  const recursos = useTable("recursos", id, mapRecurso, "created_at");
  const metricas = useTable("metricas", id, mapMetrica, "created_at");
  const miembros = useTable("miembros", id, mapMiembro, "created_at");

  return {
    clinicaId: id,
    looms: looms.data ?? [],
    proximosPasos: pasos.data ?? [],
    entregables: entregables.data ?? [],
    recursos: recursos.data ?? [],
    resultados: metricas.data ?? [],
    miembros: miembros.data ?? [],
    loading:
      looms.isLoading ||
      pasos.isLoading ||
      entregables.isLoading ||
      recursos.isLoading ||
      metricas.isLoading ||
      miembros.isLoading,
  };
}
