import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/agentes-ia")({
  head: () => ({ meta: [{ title: "Agentes de IA · Media Robots" }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Resultados · Agentes de IA" title="Agentes de IA" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Conversaciones" value="—" delta="Sin agentes activos" deltaTone="neutral" />
        <KpiCard label="Llamadas atendidas" value="—" delta="Sin agentes activos" deltaTone="neutral" />
      </div>
    </>
  );
}