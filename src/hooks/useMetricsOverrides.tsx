import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { isUuid } from "@/lib/portalMappers";
import type { ServicioSlug } from "@/types/portal";

export type MetricStatus = "active" | "pending_setup";

export interface Metric {
  id: string;
  service_id: ServicioSlug;
  metric_name: string;
  current_value: string;
  trend_percentage: string;
  status: MetricStatus;
}

type Ctx = {
  getMetrics: () => Metric[];
  upsertMetric: (m: Metric) => void;
  deleteMetric: (id: string) => void;
  newId: () => string;
};

const Context = createContext<Ctx | null>(null);

export function MetricsOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const queryClient = useQueryClient();
  const queryKey = ["metricas", clinicaId];

  const { data: metrics = [] } = useQuery({
    queryKey,
    enabled: !!clinicaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metricas")
        .select("*")
        .eq("clinica_id", clinicaId)
        .order("created_at");
      if (error) throw error;
      return (data ?? []).map((row): Metric => ({
        id: row.id,
        service_id: row.servicio_slug as ServicioSlug,
        metric_name: row.metric_name,
        current_value: row.current_value,
        trend_percentage: row.trend_percentage,
        status: (row.status as MetricStatus) ?? "active",
      }));
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const upsertMut = useMutation({
    mutationFn: async (m: Metric) => {
      const payload = {
        clinica_id: clinicaId,
        servicio_slug: m.service_id,
        metric_name: m.metric_name,
        current_value: m.current_value,
        trend_percentage: m.trend_percentage,
        positivo: !m.trend_percentage.trim().startsWith("-"),
        status: m.status,
      };
      const { error } = isUuid(m.id)
        ? await supabase.from("metricas").update(payload as never).eq("id", m.id)
        : await supabase.from("metricas").insert(payload as never);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("metricas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const value = useMemo<Ctx>(
    () => ({
      getMetrics: () => metrics,
      upsertMetric: (m) => upsertMut.mutate(m),
      deleteMetric: (id) => deleteMut.mutate(id),
      newId: () => `new-${Date.now()}`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metrics, clinicaId],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMetricsOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useMetricsOverrides must be used within MetricsOverridesProvider");
  return ctx;
}
