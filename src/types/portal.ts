export interface Cliente {
  nombreDoctor: string;
  nombreClinica: string;
  paquete: "Starter" | "Pro" | "Completo";
  fechaInicio: string;
  asesor: string;
  whatsappLink: string;
  diasActivo: number;
}

export interface Stats {
  diasActivo: number;
  serviciosActivos: string;
  proximaEntrega: string;
}

export interface Servicio {
  nombre: string;
  fase: string;
  avance: number;
  color: string;
  activo: boolean;
}

export interface Loom {
  id: number;
  semana: number;
  fecha: string;
  titulo: string;
  duracion: string;
  tags: string[];
  resumen: string[];
  linkLoom: string;
  vistoCliente: boolean;
}

export interface Paso {
  id: number;
  fecha: string;
  texto: string;
  tipo: "accion" | "call" | "hito";
}

export interface Entregable {
  id: number;
  nombre: string;
  servicio: string;
  version: string;
  status: "Borrador" | "Para revisión" | "Aprobado" | "Final entregado";
  fecha: string;
  statusColor: string;
}

export interface PortalData {
  cliente: Cliente;
  stats: Stats;
  servicios: Servicio[];
  looms: Loom[];
  proximosPasos: Paso[];
  entregables: Entregable[];
}