import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/sitio-web")({
  head: () => ({ meta: [{ title: "Sitio web · Media Robots" }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Resultados · Sitio web" title="Sitio web" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Visitas al staging" value="84" />
        <KpiCard label="Estado" value="En desarrollo" delta="En curso" deltaTone="pending" />
      </div>
    </>
  );
}