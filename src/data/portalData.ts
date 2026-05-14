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
  },
  stats: {
    diasActivo: 9,
    serviciosActivos: "2 / 3",
    proximaEntrega: "20 mayo",
  },
  servicios: [
    { nombre: "Diseño Web", fase: "Mockup en revisión", avance: 35, color: "#0A7C6A", activo: true },
    { nombre: "SEO Local", fase: "Auditoría completada", avance: 20, color: "#5B6AF0", activo: true },
    { nombre: "Go High Level", fase: "Inicia semana 4", avance: 0, color: "#D97706", activo: true },
  ],
  looms: [
    {
      id: 1,
      semana: 1,
      fecha: "9 mayo 2026",
      titulo: "Kickoff: wireframe del sitio web listo",
      duracion: "7 min",
      tags: ["Diseño Web"],
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
    { id: 1, fecha: "18 mayo", texto: "Revisá el mockup y envianos tus comentarios", tipo: "accion" },
    { id: 2, fecha: "20 mayo", texto: "Call de 20 min para resolver dudas del diseño", tipo: "call" },
    { id: 3, fecha: "23 mayo", texto: "Inicio del desarrollo del sitio web", tipo: "hito" },
  ],
  entregables: [
    { id: 1, nombre: "Wireframe_sitio_v1.pdf", servicio: "Diseño Web", version: "v1", status: "Aprobado", fecha: "12 mayo", statusColor: "#0A7C6A" },
    { id: 2, nombre: "Mockup_sitio_v1.pdf", servicio: "Diseño Web", version: "v1", status: "Para revisión", fecha: "16 mayo", statusColor: "#D97706" },
    { id: 3, nombre: "Auditoria_SEO_inicial.pdf", servicio: "SEO Local", version: "v1", status: "Final entregado", fecha: "16 mayo", statusColor: "#5B6AF0" },
  ],
};