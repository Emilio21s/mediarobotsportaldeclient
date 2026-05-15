import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { getServicio } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";

export const Route = createFileRoute("/servicios/diseno-web")({
  head: () => {
    const s = getServicio("diseno-web");
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
  const servicio = getServicio("diseno-web");
  if (!servicio) return null;
  const { isContratado } = useServiciosContratados();
  const contratado = isContratado("diseno-web");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
