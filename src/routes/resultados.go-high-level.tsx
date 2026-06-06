import { createFileRoute } from "@tanstack/react-router";
import { ServiceResults, type Kpi } from "@/components/portal/ServiceResults";

const kpis: Kpi[] = [
  { name: "Citas agendadas", value: "—", badge: "Pendiente de setup" },
  { name: "Contactos en CRM", value: "—", badge: "Pendiente de setup" },
];

export const Route = createFileRoute("/resultados/go-high-level")({
  head: () => ({ meta: [{ title: "Resultados · Go High Level · Media Robots" }, { name: "description", content: "Métricas de Go High Level." }] }),
  component: () => <ServiceResults serviceSlug="go-high-level" kpis={kpis} />,
});