export interface Cliente {
  nombreDoctor: string;
  nombreClinica: string;
  paquete: "Starter" | "Pro" | "Completo";
  fechaInicio: string;
  asesor: string;
  whatsappLink: string;
  diasActivo: number;
  serviciosContratados: ServicioSlug[];
}

export interface Clinica {
  id: string;
  nombreClinica: string;
  nombreDoctor: string;
  paquete: "Starter" | "Pro" | "Completo";
  fechaInicio: string;
  asesor: string;
  whatsappLink: string;
  diasActivo: number;
  serviciosContratados: ServicioSlug[];
  color: string;
  iniciales: string;
}

export type Role = "Agency_Admin" | "Client_User";

export type ServicioSlug = "diseno-web" | "seo" | "go-high-level" | "agentes-ia";

export interface Stats {
  diasActivo: number;
  serviciosActivos: string;
  proximaEntrega: string;
}

export interface Fase {
  nombre: string;
  estado: "completada" | "actual" | "pendiente";
  fecha?: string;
}

export interface Servicio {
  slug: ServicioSlug;
  nombre: string;
  descripcion: string;
  fase: string;
  avance: number;
  color: string;
  colorSoft: string;
  activo: boolean;
  fases: Fase[];
}

export interface Loom {
  id: number;
  clinicaId: string;
  semana: number;
  fecha: string;
  titulo: string;
  duracion: string;
  tags: string[];
  serviciosSlugs: ServicioSlug[];
  resumen: string[];
  linkLoom: string;
  vistoCliente: boolean;
}

export interface Paso {
  id: number;
  clinicaId: string;
  fecha: string;
  fechaIso: string;
  texto: string;
  tipo: "accion" | "call" | "hito";
  servicioSlug?: ServicioSlug;
}

export interface Entregable {
  id: number;
  clinicaId: string;
  nombre: string;
  servicio: string;
  servicioSlug: ServicioSlug;
  version: string;
  status: "Borrador" | "Para revisión" | "Aprobado" | "Final entregado";
  fecha: string;
  statusColor: string;
}

export interface Recurso {
  id: number;
  clinicaId: string;
  titulo: string;
  descripcion: string;
  tipo: "doc" | "link" | "credenciales";
  link: string;
}

export interface Metrica {
  id: number;
  clinicaId: string;
  servicioSlug: ServicioSlug;
  label: string;
  valor: string;
  delta: string;
  positivo: boolean;
}

export interface Miembro {
  id: number;
  clinicaId: string;
  nombre: string;
  rol: string;
  equipo: "media-robots" | "cliente";
  avatarColor: string;
  iniciales: string;
  email?: string;
}

export interface PortalData {
  cliente: Cliente;
  stats: Stats;
  servicios: Servicio[];
  looms: Loom[];
  proximosPasos: Paso[];
  entregables: Entregable[];
  recursos: Recurso[];
  resultados: Metrica[];
  miembros: Miembro[];
  clinicas: Clinica[];
}
