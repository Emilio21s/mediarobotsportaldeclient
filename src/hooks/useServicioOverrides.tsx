import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { portalData } from "@/data/portalData";
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
  statusColor: string;
}

export const ENTREGABLE_STATUS_COLOR: Record<EntregableStatus, string> = {
  "Borrador": "#787672",
  "Para revisión": "#D97706",
  "Aprobado": "#0A7C6A",
  "Final entregado": "#5B6AF0",
};

export interface ServicioOverride {
  avanceManual?: number | null;
  pasos?: PasoLocal[]; // when present, replaces defaults
  entregables?: EntregableLocal[]; // when present, replaces defaults for that slug
}

type Store = Record<string, Record<string, ServicioOverride>>; // clinicaId -> slug -> override

const KEY = "mr.servicios.v1";

function load(): Store {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function save(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ } }

type Ctx = {
  getOverride: (slug: string) => ServicioOverride;
  setAvanceManual: (slug: string, value: number | null) => void;
  setPasos: (slug: string, pasos: PasoLocal[]) => void;
  getEntregables: (slug: ServicioSlug) => EntregableLocal[];
  setEntregables: (slug: ServicioSlug, entregables: EntregableLocal[]) => void;
  getAllEntregables: () => EntregableLocal[];
};

const Context = createContext<Ctx | null>(null);

export function ServicioOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const [store, setStore] = useState<Store>({});

  useEffect(() => { setStore(load()); }, [clinicaId]);

  const persist = useCallback((next: Store) => { setStore(next); save(next); }, []);

  const getOverride = useCallback(
    (slug: string) => store[clinicaId]?.[slug] ?? {},
    [store, clinicaId],
  );

  const defaultEntregables = useCallback(
    (slug: ServicioSlug): EntregableLocal[] =>
      portalData.entregables
        .filter((e) => e.clinicaId === clinicaId && e.servicioSlug === slug)
        .map((e) => ({
          id: `seed-${e.id}`,
          nombre: e.nombre,
          servicioSlug: e.servicioSlug,
          servicio: e.servicio,
          version: e.version,
          status: e.status,
          fecha: e.fecha,
          statusColor: e.statusColor,
        })),
    [clinicaId],
  );

  const getEntregables = useCallback(
    (slug: ServicioSlug) => store[clinicaId]?.[slug]?.entregables ?? defaultEntregables(slug),
    [store, clinicaId, defaultEntregables],
  );

  const getAllEntregables = useCallback(() => {
    const slugs = Array.from(
      new Set(portalData.servicios.map((s) => s.slug as ServicioSlug)),
    );
    return slugs.flatMap((slug) => getEntregables(slug));
  }, [getEntregables]);

  const mutate = (slug: string, patch: Partial<ServicioOverride>) => {
    const clinicMap = { ...(store[clinicaId] ?? {}) };
    const current = clinicMap[slug] ?? {};
    clinicMap[slug] = { ...current, ...patch };
    persist({ ...store, [clinicaId]: clinicMap });
  };

  const value = useMemo<Ctx>(() => ({
    getOverride,
    setAvanceManual: (slug, value) => mutate(slug, { avanceManual: value }),
    setPasos: (slug, pasos) => mutate(slug, { pasos }),
    getEntregables,
    setEntregables: (slug, entregables) => mutate(slug, { entregables }),
    getAllEntregables,
  }), [getOverride, getEntregables, getAllEntregables, store, clinicaId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useServicioOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useServicioOverrides must be used within ServicioOverridesProvider");
  return ctx;
}
