import { createFileRoute } from "@tanstack/react-router";
import { KpiCard, ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/seo-gmb")({
  head: () => ({ meta: [{ title: "SEO y GMB · Media Robots" }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Resultados · SEO Local" title="SEO y GMB" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Impresiones GMB" value="1,240" delta="+18%" deltaTone="positive" />
        <KpiCard label="Llamadas desde Google" value="32" delta="+9" deltaTone="positive" />
        <KpiCard label="Clics 'Cómo llegar'" value="—" delta="Próximamente" deltaTone="neutral" />
      </div>
    </>
  );
}