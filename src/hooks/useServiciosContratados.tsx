import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { portalData } from "@/data/portalData";
import { useSession } from "@/hooks/useSession";
import type { ServicioSlug, Servicio } from "@/types/portal";

const STORAGE_PREFIX = "mr.serviciosContratados.";
const ALL_SLUGS: ServicioSlug[] = ["diseno-web", "seo", "go-high-level", "agentes-ia"];

type Ctx = {
  contratados: ServicioSlug[];
  setContratados: (next: ServicioSlug[]) => void;
  toggle: (slug: ServicioSlug) => void;
  isContratado: (slug: ServicioSlug) => boolean;
  servicios: Servicio[];
};

const Context = createContext<Ctx | null>(null);

export function ServiciosContratadosProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const storageKey = STORAGE_PREFIX + activeClinic.id;
  const [contratados, setState] = useState<ServicioSlug[]>(activeClinic.serviciosContratados);

  // Reload on clinic change.
  useEffect(() => {
    let next = activeClinic.serviciosContratados;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ServicioSlug[];
        next = parsed.filter((s): s is ServicioSlug => ALL_SLUGS.includes(s));
      }
    } catch { /* noop */ }
    setState(next);
  }, [storageKey, activeClinic]);

  const setContratados = (next: ServicioSlug[]) => {
    setState(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* noop */ }
  };
  const toggle = (slug: ServicioSlug) => {
    setContratados(
      contratados.includes(slug)
        ? contratados.filter((s) => s !== slug)
        : [...contratados, slug],
    );
  };
  const isContratado = (slug: ServicioSlug) => contratados.includes(slug);
  const servicios = portalData.servicios.filter((s) => contratados.includes(s.slug));

  return (
    <Context.Provider value={{ contratados, setContratados, toggle, isContratado, servicios }}>
      {children}
    </Context.Provider>
  );
}

export function useServiciosContratados() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useServiciosContratados must be used within ServiciosContratadosProvider");
  return ctx;
}
