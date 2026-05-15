import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { getServicio } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";

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
  const { isContratado } = useServiciosContratados();
  const contratado = isContratado("agentes-ia");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
