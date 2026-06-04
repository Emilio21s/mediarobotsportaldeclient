import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { portalData } from "@/data/portalData";
import type { ServicioSlug } from "@/types/portal";

export type MetricStatus = "active" | "pending_setup";

export interface Metric {
  id: string;
  service_id: ServicioSlug;
  metric_name: string;
  current_value: string;
  trend_percentage: string; // e.g. "+18%", "-3%", "0%"
  status: MetricStatus;
}

type Store = Record<string, Metric[]>; // clinicaId -> metrics
const KEY = "mr.metrics.v1";

function load(): Store {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function save(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ } }

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
  const [store, setStore] = useState<Store>({});

  useEffect(() => { setStore(load()); }, [clinicaId]);

  const persist = useCallback((next: Store) => { setStore(next); save(next); }, []);

  const defaults = useCallback((): Metric[] => {
    return portalData.resultados
      .filter((m) => m.clinicaId === clinicaId)
      .map((m) => ({
        id: `seed-${m.id}`,
        service_id: m.servicioSlug,
        metric_name: m.label,
        current_value: m.valor,
        trend_percentage: m.delta,
        status: "active" as MetricStatus,
      }));
  }, [clinicaId]);

  const getMetrics = useCallback(
    () => store[clinicaId] ?? defaults(),
    [store, clinicaId, defaults],
  );

  const setList = (list: Metric[]) => persist({ ...store, [clinicaId]: list });

  const value = useMemo<Ctx>(() => ({
    getMetrics,
    upsertMetric: (m) => {
      const list = getMetrics();
      const idx = list.findIndex((x) => x.id === m.id);
      const next = idx >= 0 ? list.map((x) => (x.id === m.id ? m : x)) : [...list, m];
      setList(next);
    },
    deleteMetric: (id) => setList(getMetrics().filter((m) => m.id !== id)),
    newId: () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [getMetrics, store, clinicaId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMetricsOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useMetricsOverrides must be used within MetricsOverridesProvider");
  return ctx;
}