import { createFileRoute } from "@tanstack/react-router";
import { ServiceResults, type Kpi } from "@/components/portal/ServiceResults";

const kpis: Kpi[] = [
  { name: "Impresiones GMB", value: "1,240", trend: "+18%" },
  { name: "Llamadas desde Google", value: "32", trend: "+9" },
  { name: 'Clics "Cómo llegar"', value: "—", badge: "Próximamente" },
];

export const Route = createFileRoute("/resultados/seo-gmb")({
  head: () => ({ meta: [{ title: "Resultados · SEO y GMB · Media Robots" }, { name: "description", content: "Métricas de SEO local y Google My Business." }] }),
  component: () => <ServiceResults serviceSlug="seo" kpis={kpis} />,
});