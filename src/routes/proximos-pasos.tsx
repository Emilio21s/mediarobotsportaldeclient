import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Phone, Flag } from "lucide-react";
import { portalData } from "@/data/portalData";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";
import { useServicioOverrides } from "@/hooks/useServicioOverrides";
import type { ServicioSlug } from "@/types/portal";

export const Route = createFileRoute("/proximos-pasos")({
  head: () => ({ meta: [{ title: "Agenda · Media Robots" }, { name: "description", content: "Agenda cronológica del proyecto." }] }),
  component: Page,
});

const ICONS = { accion: Flag, call: Phone, hito: Calendar } as const;

function Page() {
  const { proximosPasos } = useClinicData();
  const { getAllPasos } = useServicioOverrides();

  // Pasos por servicio (vienen del store: override del servicio o defaults).
  const pasosDeServicios = getAllPasos().map((p) => ({
    id: `${p.servicioSlug}:${p.id}`,
    texto: p.texto,
    fecha: p.fecha,
    fechaIso: p.fechaIso,
    tipo: p.tipo,
    servicioSlug: p.servicioSlug as ServicioSlug | undefined,
  }));

  // Pasos sin servicio asociado (no editables aquí): se preservan tal cual.
  const pasosSinServicio = proximosPasos
    .filter((p) => !p.servicioSlug)
    .map((p) => ({
      id: `general:${p.id}`,
      texto: p.texto,
      fecha: p.fecha,
      fechaIso: p.fechaIso,
      tipo: p.tipo,
      servicioSlug: undefined as ServicioSlug | undefined,
    }));

  const sorted = [...pasosDeServicios, ...pasosSinServicio].sort((a, b) =>
    a.fechaIso.localeCompare(b.fechaIso),
  );

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Próximos pasos"
        description="Cronograma de hitos, calls y acciones. Los pasos editados en cada servicio se reflejan aquí en tiempo real."
      />

      <div className="rounded-xl border border-border bg-card">
          {sorted.length === 0 ? (
            <p className="p-6 text-center text-[12.5px] text-muted-foreground">
              No hay próximos pasos para esta clínica.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {sorted.map((p) => {
                const Icon = ICONS[p.tipo];
                const servicio = portalData.servicios.find((s) => s.slug === p.servicioSlug);
                return (
                  <li key={p.id} className="flex items-start gap-4 p-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: servicio?.colorSoft ?? "var(--muted)",
                        color: servicio?.color ?? "var(--foreground)",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] font-medium text-foreground">{p.texto}</span>
                        <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">{p.fecha}</span>
                      </div>
                      {servicio && (
                        <div className="mt-0.5 text-[11px]" style={{ color: servicio.color }}>
                          {servicio.nombre}
                        </div>
                      )}
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
