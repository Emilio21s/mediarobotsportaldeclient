import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Phone, Flag } from "lucide-react";
import { portalData } from "@/data/portalData";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/proximos-pasos")({
  head: () => ({ meta: [{ title: "Próximos pasos · Media Robots" }, { name: "description", content: "Agenda de próximos pasos y entregas del proyecto." }] }),
  component: Page,
});

const ICONS = { accion: Flag, call: Phone, hito: Calendar } as const;

function Page() {
  const { proximosPasos } = useClinicData();
  const sorted = [...proximosPasos].sort((a, b) => a.fechaIso.localeCompare(b.fechaIso));
  return (
    <>
      <PageHeader eyebrow="Agenda" title="Próximos pasos" description="Lo que viene en las próximas semanas, ordenado por fecha." />
      <div className="rounded-xl border border-border bg-card">
        {sorted.length === 0 ? (
          <p className="p-6 text-center text-[12.5px] text-muted-foreground">No hay próximos pasos para esta clínica.</p>
        ) : (
        <ul className="divide-y divide-border">
          {sorted.map((p) => {
            const Icon = ICONS[p.tipo];
            const servicio = portalData.servicios.find((s) => s.slug === p.servicioSlug);
            return (
              <li key={p.id} className="flex items-start gap-4 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: servicio?.colorSoft ?? "var(--muted)", color: servicio?.color ?? "var(--foreground)" }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13px] font-medium text-foreground">{p.texto}</span>
                    <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{p.fecha}</span>
                  </div>
                  {servicio && <div className="mt-0.5 text-[11px]" style={{ color: servicio.color }}>{servicio.nombre}</div>}
                </div>
              </li>
            );
          })}
        </ul>
        )}
      </div>
    </>
  );
}
