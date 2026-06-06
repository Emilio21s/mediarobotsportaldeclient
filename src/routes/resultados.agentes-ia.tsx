import { createFileRoute } from "@tanstack/react-router";
import { ServiceResults, type Kpi } from "@/components/portal/ServiceResults";

const kpis: Kpi[] = [
  { name: "Conversaciones", value: "—", badge: "Sin agentes activos" },
  { name: "Llamadas atendidas", value: "—", badge: "Sin agentes activos" },
];

export const Route = createFileRoute("/resultados/agentes-ia")({
  head: () => ({ meta: [{ title: "Resultados · Agentes de IA · Media Robots" }, { name: "description", content: "Métricas de Agentes de IA." }] }),
  component: () => <ServiceResults serviceSlug="agentes-ia" kpis={kpis} />,
});