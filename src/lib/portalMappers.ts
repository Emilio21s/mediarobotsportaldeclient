import type {
  Entregable,
  Loom,
  Metrica,
  Miembro,
  Paso,
  Recurso,
  RecursoCategoria,
  ServicioSlug,
} from "@/types/portal";

export const SERVICIO_NOMBRE: Record<ServicioSlug, string> = {
  "diseno-web": "Diseño Web",
  seo: "SEO Local",
  "go-high-level": "Go High Level",
  "agentes-ia": "Agentes de IA",
};

export const ENTREGABLE_STATUS_COLORS: Record<string, string> = {
  Borrador: "#787672",
  "Para revisión": "#D97706",
  Aprobado: "#0A7C6A",
  "Final entregado": "#5B6AF0",
};

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: string | undefined | null): boolean {
  return !!v && UUID_RE.test(v);
}

export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-GT", { day: "numeric", month: "long" });
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapLoom(row: any): Loom {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    semana: row.semana,
    fecha: fechaCorta(row.fecha),
    fechaIso: row.fecha ?? "",
    titulo: row.titulo,
    duracion: row.duracion,
    tags: row.tags ?? [],
    serviciosSlugs: row.servicios_slugs ?? [],
    resumen: row.resumen ?? [],
    linkLoom: row.link_loom ?? "",
    vistoCliente: !!row.visto_cliente,
  };
}

export function mapPaso(row: any): Paso {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    fecha: fechaCorta(row.fecha_iso),
    fechaIso: row.fecha_iso ?? "",
    texto: row.texto,
    tipo: row.tipo,
    servicioSlug: row.servicio_slug ?? undefined,
  };
}

export function mapEntregable(row: any): Entregable {
  const slug = row.servicio_slug as ServicioSlug;
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    nombre: row.nombre,
    servicio: SERVICIO_NOMBRE[slug] ?? slug,
    servicioSlug: slug,
    version: row.version,
    status: row.status,
    fecha: fechaCorta(row.fecha),
    fechaIso: row.fecha ?? "",
    statusColor: ENTREGABLE_STATUS_COLORS[row.status] ?? "#787672",
  };
}

export function mapRecurso(row: any): Recurso {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    titulo: row.titulo,
    descripcion: row.descripcion ?? "",
    tipo: row.tipo,
    link: row.link ?? "",
    categoria: (row.categoria ?? "accesos") as RecursoCategoria,
  };
}

export function mapMetrica(row: any): Metrica {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    servicioSlug: row.servicio_slug,
    label: row.metric_name,
    valor: row.current_value,
    delta: row.trend_percentage,
    positivo: !!row.positivo,
  };
}

export function mapMiembro(row: any): Miembro {
  return {
    id: row.id,
    clinicaId: row.clinica_id,
    nombre: row.nombre,
    rol: row.rol,
    equipo: row.equipo,
    avatarColor: row.avatar_color,
    iniciales: row.iniciales,
    email: row.email ?? undefined,
  };
}
