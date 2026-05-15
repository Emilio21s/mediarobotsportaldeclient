import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, ServiceNotContracted } from "@/components/portal/ServicePage";
import { getServicio } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";

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
  const { isContratado } = useServiciosContratados();
  const contratado = isContratado("go-high-level");
  if (!contratado) return <ServiceNotContracted nombre={servicio.nombre} />;
  return <ServicePage servicio={servicio} />;
}
