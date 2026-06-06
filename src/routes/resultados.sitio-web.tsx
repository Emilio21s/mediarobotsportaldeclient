import { createFileRoute } from "@tanstack/react-router";
import { ServiceResults, type Kpi } from "@/components/portal/ServiceResults";

const kpis: Kpi[] = [
  { name: "Visitas al staging", value: "84", trend: "+12%" },
  { name: "Estado", value: "—", badge: "En desarrollo" },
];

export const Route = createFileRoute("/resultados/sitio-web")({
  head: () => ({ meta: [{ title: "Resultados · Sitio web · Media Robots" }, { name: "description", content: "Métricas del sitio web." }] }),
  component: () => <ServiceResults serviceSlug="diseno-web" kpis={kpis} />,
});