import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { portalData, getServicio } from "@/data/portalData";

export const Route = createFileRoute("/servicios/go-high-level")({
  head: () => {
    const s = getServicio("go-high-level");
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
  const servicio = getServicio("go-high-level");
  if (!servicio) return null;
  const contratado = portalData.cliente.serviciosContratados.includes("go-high-level");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
