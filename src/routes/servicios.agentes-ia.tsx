import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { portalData, getServicio } from "@/data/portalData";

export const Route = createFileRoute("/servicios/agentes-ia")({
  head: () => {
    const s = getServicio("agentes-ia");
    return {
      meta: [
        { title: `${s?.nombre ?? "Servicio"} · Media Robots` },
        { name: "description", content: s?.descripcion ?? "" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const servicio = getServicio("agentes-ia");
  if (!servicio) return null;
  const contratado = portalData.cliente.serviciosContratados.includes("agentes-ia");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
