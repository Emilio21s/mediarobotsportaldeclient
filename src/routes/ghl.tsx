import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/ghl")({
  head: () => ({ meta: [{ title: "Go High Level · Media Robots" }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Resultados · Go High Level" title="Go High Level" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Citas agendadas" value="—" delta="Pendiente de setup" deltaTone="pending" />
        <KpiCard label="Contactos en CRM" value="—" delta="Pendiente de setup" deltaTone="pending" />
      </div>
    </>
  );
}