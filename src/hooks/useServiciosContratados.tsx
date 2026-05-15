import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { portalData } from "@/data/portalData";
import type { ServicioSlug, Servicio } from "@/types/portal";

const STORAGE_KEY = "mr.serviciosContratados";
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
  const [contratados, setState] = useState<ServicioSlug[]>(
    portalData.cliente.serviciosContratados,
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ServicioSlug[];
        const valid = parsed.filter((s): s is ServicioSlug => ALL_SLUGS.includes(s));
        setState(valid);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setContratados = (next: ServicioSlug[]) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
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
