import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";
import { portalData } from "@/data/portalData";
import type { Loom } from "@/types/portal";

type Store = Record<string, Loom[]>; // clinicaId -> looms (replaces defaults when present)

const KEY = "mr.looms.v1";

function load(): Store {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function save(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ } }

type Ctx = {
  getLooms: () => Loom[];
  upsertLoom: (loom: Loom) => void;
  deleteLoom: (id: number) => void;
};

const Context = createContext<Ctx | null>(null);

export function LoomsOverridesProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const [store, setStore] = useState<Store>({});

  useEffect(() => { setStore(load()); }, [clinicaId]);

  const persist = useCallback((next: Store) => { setStore(next); save(next); }, []);

  const defaults = useCallback(
    () => portalData.looms.filter((l) => l.clinicaId === clinicaId),
    [clinicaId],
  );

  const getLooms = useCallback(
    () => store[clinicaId] ?? defaults(),
    [store, clinicaId, defaults],
  );

  const setList = (list: Loom[]) => persist({ ...store, [clinicaId]: list });

  const value = useMemo<Ctx>(() => ({
    getLooms,
    upsertLoom: (loom) => {
      const list = getLooms();
      const idx = list.findIndex((l) => l.id === loom.id);
      const next = idx >= 0
        ? list.map((l) => (l.id === loom.id ? loom : l))
        : [...list, loom];
      setList(next);
    },
    deleteLoom: (id) => setList(getLooms().filter((l) => l.id !== id)),
  }), [getLooms, store, clinicaId]);

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