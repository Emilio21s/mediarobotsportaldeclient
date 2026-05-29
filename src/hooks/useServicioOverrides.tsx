import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";

export interface PasoLocal {
  id: string;
  fecha: string;
  fechaIso: string;
  texto: string;
  tipo: "accion" | "call" | "hito";
}

export interface ServicioOverride {
  avanceManual?: number | null;
  pasos?: PasoLocal[]; // when present, replaces defaults
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
  }), [getOverride, store, clinicaId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useServicioOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useServicioOverrides must be used within ServicioOverridesProvider");
  return ctx;
}
