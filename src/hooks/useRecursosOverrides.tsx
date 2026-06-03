import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { portalData } from "@/data/portalData";
import type { Recurso } from "@/types/portal";

type Store = Record<string, Recurso[]>;
const KEY = "mr.recursos.v1";

function load(): Store {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function save(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ } }

type Ctx = {
  getRecursos: () => Recurso[];
  upsertRecurso: (r: Recurso) => void;
  deleteRecurso: (id: number) => void;
  nextId: () => number;
};

const Context = createContext<Ctx | null>(null);

export function RecursosOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const [store, setStore] = useState<Store>({});

  useEffect(() => { setStore(load()); }, [clinicaId]);

  const persist = useCallback((next: Store) => { setStore(next); save(next); }, []);

  const defaults = useCallback(
    () => portalData.recursos.filter((r) => r.clinicaId === clinicaId),
    [clinicaId],
  );

  const getRecursos = useCallback(
    () => store[clinicaId] ?? defaults(),
    [store, clinicaId, defaults],
  );

  const setList = (list: Recurso[]) => persist({ ...store, [clinicaId]: list });

  const value = useMemo<Ctx>(() => ({
    getRecursos,
    upsertRecurso: (r) => {
      const list = getRecursos();
      const idx = list.findIndex((x) => x.id === r.id);
      const next = idx >= 0 ? list.map((x) => (x.id === r.id ? r : x)) : [...list, r];
      setList(next);
    },
    deleteRecurso: (id) => setList(getRecursos().filter((r) => r.id !== id)),
    nextId: () => {
      const list = getRecursos();
      return list.length ? Math.max(...list.map((r) => r.id)) + 1 : 1;
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [getRecursos, store, clinicaId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useRecursosOverrides() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useRecursosOverrides must be used within RecursosOverridesProvider");
  return ctx;
}