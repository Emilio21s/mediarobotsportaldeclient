import type { PortalData } from "@/types/portal";

export const portalData: PortalData = {
  cliente: {
    nombreDoctor: "Dr. Carlos García",
    nombreClinica: "Clínica Dental García",
    paquete: "Pro",
    fechaInicio: "5 mayo 2026",
    asesor: "Emilio Sandoval",
    whatsappLink: "https://wa.me/50212345678",
    diasActivo: 9,
    serviciosContratados: ["diseno-web", "seo", "go-high-level"],
  },
  stats: {
    diasActivo: 9,
    serviciosActivos: "2 / 3",
    proximaEntrega: "20 mayo",
  },
  servicios: [
    {
      slug: "diseno-web",
      nombre: "Diseño Web",
      descripcion: "Sitio web profesional optimizado para conversión.",
      fase: "Mockup en revisión",
      avance: 35,
      color: "#0A7C6A",
      colorSoft: "#E6F5F2",
      activo: true,
      fases: [
        { nombre: "Kickoff & wireframe", estado: "completada", fecha: "9 may" },
        { nombre: "Mockup visual", estado: "actual", fecha: "16 may" },
        { nombre: "Desarrollo", estado: "pendiente", fecha: "23 may" },
        { nombre: "QA & lanzamiento", estado: "pendiente", fecha: "6 jun" },
      ],
    },
    {
      slug: "seo",
      nombre: "SEO Local",
      descripcion: "Posicionamiento en Google y Maps para tu zona.",
      fase: "Auditoría completada",
      avance: 20,
      color: "#5B6AF0",
      colorSoft: "#EEF0FE",
      activo: true,
      fases: [
        { nombre: "Auditoría inicial", estado: "completada", fecha: "12 may" },
        { nombre: "Optimización GMB", estado: "actual", fecha: "18 may" },
        { nombre: "Contenido & keywords", estado: "pendiente", fecha: "25 may" },
        { nombre: "Link building", estado: "pendiente" },
      ],
    },
    {
      slug: "go-high-level",
      nombre: "Go High Level",
      descripcion: "Automatización de citas, recordatorios y CRM.",
      fase: "Inicia semana 4",
      avance: 0,
      color: "#D97706",
      colorSoft: "#FEF3E2",
      activo: true,
      fases: [
        { nombre: "Setup cuenta", estado: "pendiente", fecha: "30 may" },
        { nombre: "Pipelines & automatizaciones", estado: "pendiente" },
        { nombre: "Integración WhatsApp", estado: "pendiente" },
        { nombre: "Capacitación equipo", estado: "pendiente" },
      ],
    },
    {
      slug: "agentes-ia",
      nombre: "Agentes de IA",
      descripcion: "Recepcionista virtual 24/7 para tu clínica.",
      fase: "No contratado",
      avance: 0,
      color: "#B5426B",
      colorSoft: "#FDE8F0",
      activo: false,
      fases: [],
    },
  ],
  looms: [
    {
      id: 1,
      semana: 1,
      fecha: "9 mayo 2026",
      titulo: "Kickoff: wireframe del sitio web listo",
      duracion: "7 min",
      tags: ["Diseño Web"],
      serviciosSlugs: ["diseno-web"],
      resumen: [
        "Wireframe de 6 páginas definido y documentado",
        "Paleta de colores elegida según identidad de la clínica",
        "Próximo: mockup visual completo para su aprobación",
      ],
      linkLoom: "https://loom.com/share/ejemplo1",
      vistoCliente: true,
    },
    {
      id: 2,
      semana: 2,
      fecha: "16 mayo 2026",
      titulo: "Mockup del sitio + auditoría SEO",
      duracion: "9 min",
      tags: ["Diseño Web", "SEO"],
      serviciosSlugs: ["diseno-web", "seo"],
      resumen: [
        "Mockup de 6 páginas listo para revisión",
        "Auditoría SEO: 10 keywords locales definidas",
        "GMB sin categoría secundaria — corregido",
      ],
      linkLoom: "https://loom.com/share/ejemplo2",
      vistoCliente: false,
    },
  ],
  proximosPasos: [
    { id: 1, fecha: "18 mayo", fechaIso: "2026-05-18", texto: "Revisá el mockup y envianos tus comentarios", tipo: "accion", servicioSlug: "diseno-web" },
    { id: 2, fecha: "20 mayo", fechaIso: "2026-05-20", texto: "Call de 20 min para resolver dudas del diseño", tipo: "call", servicioSlug: "diseno-web" },
    { id: 3, fecha: "23 mayo", fechaIso: "2026-05-23", texto: "Inicio del desarrollo del sitio web", tipo: "hito", servicioSlug: "diseno-web" },
    { id: 4, fecha: "25 mayo", fechaIso: "2026-05-25", texto: "Publicación de primeros artículos SEO", tipo: "hito", servicioSlug: "seo" },
  ],
  entregables: [
    { id: 1, nombre: "Wireframe_sitio_v1.pdf", servicio: "Diseño Web", servicioSlug: "diseno-web", version: "v1", status: "Aprobado", fecha: "12 mayo", statusColor: "#0A7C6A" },
    { id: 2, nombre: "Mockup_sitio_v1.pdf", servicio: "Diseño Web", servicioSlug: "diseno-web", version: "v1", status: "Para revisión", fecha: "16 mayo", statusColor: "#D97706" },
    { id: 3, nombre: "Auditoria_SEO_inicial.pdf", servicio: "SEO Local", servicioSlug: "seo", version: "v1", status: "Final entregado", fecha: "16 mayo", statusColor: "#5B6AF0" },
  ],
  recursos: [
    { id: 1, titulo: "Brief inicial firmado", descripcion: "Documento maestro del proyecto", tipo: "doc", link: "#" },
    { id: 2, titulo: "Manual de marca", descripcion: "Logos, paleta y tipografías oficiales", tipo: "doc", link: "#" },
    { id: 3, titulo: "Acceso staging del sitio", descripcion: "URL privada para revisar avances", tipo: "link", link: "#" },
    { id: 4, titulo: "Credenciales Google Business", descripcion: "Acceso compartido al perfil GMB", tipo: "credenciales", link: "#" },
  ],
  resultados: [
    { id: 1, servicioSlug: "seo", label: "Impresiones GMB", valor: "1,240", delta: "+18%", positivo: true },
    { id: 2, servicioSlug: "seo", label: "Llamadas desde Google", valor: "32", delta: "+9", positivo: true },
    { id: 3, servicioSlug: "diseno-web", label: "Visitas al staging", valor: "84", delta: "—", positivo: true },
    { id: 4, servicioSlug: "go-high-level", label: "Citas agendadas", valor: "—", delta: "Pendiente setup", positivo: true },
  ],
  miembros: [
    { id: 1, nombre: "Emilio Sandoval", rol: "Asesor principal", equipo: "media-robots", avatarColor: "#0A7C6A", iniciales: "ES", email: "emilio@mediarobots.com" },
    { id: 2, nombre: "Lucía Pérez", rol: "Diseñadora web", equipo: "media-robots", avatarColor: "#5B6AF0", iniciales: "LP" },
    { id: 3, nombre: "Andrés Mora", rol: "SEO specialist", equipo: "media-robots", avatarColor: "#D97706", iniciales: "AM" },
    { id: 4, nombre: "Dr. Carlos García", rol: "Director clínica", equipo: "cliente", avatarColor: "#B5426B", iniciales: "CG" },
    { id: 5, nombre: "Sofía Méndez", rol: "Coordinadora marketing", equipo: "cliente", avatarColor: "#787672", iniciales: "SM" },
  ],
};

export function getProximoPaso() {
  const sorted = [...portalData.proximosPasos].sort((a, b) =>
    a.fechaIso.localeCompare(b.fechaIso),
  );
  return sorted[0];
}

export function getServicio(slug: string) {
  return portalData.servicios.find((s) => s.slug === slug);
}

export function getServiciosContratados() {
  return portalData.servicios.filter((s) =>
    portalData.cliente.serviciosContratados.includes(s.slug),
  );
}
