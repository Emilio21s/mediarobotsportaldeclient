import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/hooks/useSession";

export type Prioridad = "alta" | "media" | "baja";
export type Columna = "backlog" | "progreso" | "revision" | "completado";

export interface Comentario {
  autor: string;
  rol: "agency" | "client";
  texto: string;
  fecha: string;
}

export interface Tarea {
  id: string;
  clinicaId: string;
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  fechaEntrega: string; // YYYY-MM-DD
  columna: Columna;
  createdBy: "agency" | "client";
  createdAt: string;
  comentarios: Comentario[];
}

const KEY = "mr.tareas.v1";

const seed = (clinicaId: string): Tarea[] => {
  const base = Date.now();
  const mk = (i: number, t: Partial<Tarea>): Tarea => ({
    id: `${clinicaId}-${base}-${i}`,
    clinicaId,
    titulo: "",
    prioridad: "media",
    fechaEntrega: new Date(base + i * 86400000 * 3).toISOString().slice(0, 10),
    columna: "backlog",
    createdBy: "agency",
    createdAt: new Date().toISOString(),
    comentarios: [],
    ...t,
  });
  if (clinicaId === "garcia") {
    return [
      mk(1, { titulo: "Definir wireframe del sitio", prioridad: "alta", columna: "completado" }),
      mk(2, { titulo: "Mockup visual home + servicios", prioridad: "alta", columna: "revision" }),
      mk(3, { titulo: "Optimizar perfil de Google Business", prioridad: "media", columna: "progreso" }),
      mk(4, { titulo: "Investigación de keywords locales", prioridad: "media", columna: "progreso" }),
      mk(5, { titulo: "Setup pipeline GHL", prioridad: "baja", columna: "backlog" }),
      mk(6, { titulo: "Redactar copy de la home", prioridad: "media", columna: "backlog" }),
    ];
  }
  if (clinicaId === "sonrisas") {
    return [
      mk(1, { titulo: "Ajustar guion del agente IA", prioridad: "alta", columna: "revision" }),
      mk(2, { titulo: "Reporte SEO mensual", prioridad: "media", columna: "completado" }),
      mk(3, { titulo: "Configurar campaña local", prioridad: "alta", columna: "progreso" }),
    ];
  }
  return [
    mk(1, { titulo: "Brief de contenidos", prioridad: "alta", columna: "progreso" }),
    mk(2, { titulo: "Logo y manual de marca", prioridad: "media", columna: "backlog" }),
  ];
};

function loadAll(): Record<string, Tarea[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, Tarea[]>) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* noop */ }
}

type Ctx = {
  tareas: Tarea[];
  add: (t: Omit<Tarea, "id" | "clinicaId" | "createdAt" | "comentarios">) => void;
  update: (id: string, patch: Partial<Tarea>) => void;
  remove: (id: string) => void;
  move: (id: string, columna: Columna) => void;
  addComment: (id: string, c: Omit<Comentario, "fecha">) => void;
};

const Context = createContext<Ctx | null>(null);

export function TareasProvider({ children }: { children: ReactNode }) {
  const { activeClinic } = useSession();
  const clinicaId = activeClinic.id;
  const [store, setStore] = useState<Record<string, Tarea[]>>({});

  useEffect(() => {
    const all = loadAll();
    if (!all[clinicaId]) {
      all[clinicaId] = seed(clinicaId);
      saveAll(all);
    }
    setStore(all);
  }, [clinicaId]);

  const persist = useCallback((next: Record<string, Tarea[]>) => {
    setStore(next);
    saveAll(next);
  }, []);

  const tareas = useMemo(() => store[clinicaId] ?? [], [store, clinicaId]);

  const add: Ctx["add"] = (t) => {
    const tarea: Tarea = {
      ...t,
      id: `${clinicaId}-${Date.now()}`,
      clinicaId,
      createdAt: new Date().toISOString(),
      comentarios: [],
    };
    persist({ ...store, [clinicaId]: [tarea, ...(store[clinicaId] ?? [])] });
  };

  const update: Ctx["update"] = (id, patch) => {
    persist({
      ...store,
      [clinicaId]: (store[clinicaId] ?? []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const remove: Ctx["remove"] = (id) => {
    persist({
      ...store,
      [clinicaId]: (store[clinicaId] ?? []).filter((t) => t.id !== id),
    });
  };

  const move: Ctx["move"] = (id, columna) => update(id, { columna });

  const addComment: Ctx["addComment"] = (id, c) => {
    const comentario: Comentario = { ...c, fecha: new Date().toISOString() };
    persist({
      ...store,
      [clinicaId]: (store[clinicaId] ?? []).map((t) =>
        t.id === id ? { ...t, comentarios: [...t.comentarios, comentario] } : t,
      ),
    });
  };

  return (
    <Context.Provider value={{ tareas, add, update, remove, move, addComment }}>
      {children}
    </Context.Provider>
  );
}

export function useTareas() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useTareas must be used within TareasProvider");
  return ctx;
}
