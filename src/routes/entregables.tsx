import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useServicioOverrides } from "@/hooks/useServicioOverrides";

export const Route = createFileRoute("/entregables")({
  head: () => ({ meta: [{ title: "Centro de entregables · Media Robots" }, { name: "description", content: "Todos los archivos y entregables del proyecto." }] }),
  component: Page,
});

function Page() {
  const { getAllEntregables } = useServicioOverrides();
  const entregables = getAllEntregables();
  // Agrupar por servicio para que la segmentación sea clara
  const grupos = entregables.reduce<Record<string, typeof entregables>>((acc, e) => {
    (acc[e.servicio] ??= []).push(e);
    return acc;
  }, {});
  const servicios = Object.keys(grupos).sort();
  return (
    <>
      <PageHeader eyebrow="Archivos" title="Centro de entregables" description="Versiones, estados y descargas de cada entregable." />
      {entregables.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-[12.5px] text-muted-foreground">
          Aún no hay entregables para esta clínica.
        </div>
      ) : (
        <div className="space-y-5">
          {servicios.map((servicio) => {
            const items = grupos[servicio];
            const accent = items[0]?.statusColor ?? "var(--muted-foreground)";
            return (
              <section key={servicio} className="overflow-hidden rounded-xl border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                    <h2 className="text-[12.5px] font-semibold text-foreground">{servicio}</h2>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{items.length} {items.length === 1 ? "archivo" : "archivos"}</span>
                </header>
                <ul className="divide-y divide-border">
                  {items.map((e) => (
                    <li key={e.id} className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-foreground">{e.nombre}</div>
                        <div className="text-[11px] text-muted-foreground">{e.version} · {e.fecha}</div>
                      </div>
                      <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold" style={{ backgroundColor: `${e.statusColor}1a`, color: e.statusColor }}>
                        {e.status}
                      </span>
                      <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-background">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
