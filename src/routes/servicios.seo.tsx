import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { portalData, getServicio } from "@/data/portalData";

export const Route = createFileRoute("/servicios/seo")({
  head: () => {
    const s = getServicio("seo");
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
  const servicio = getServicio("seo");
  if (!servicio) return null;
  const contratado = portalData.cliente.serviciosContratados.includes("seo");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
