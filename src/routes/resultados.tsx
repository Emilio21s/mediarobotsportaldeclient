import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getServicio } from "@/data/portalData";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/resultados")({
  head: () => ({ meta: [{ title: "Resultados · Media Robots" }, { name: "description", content: "Métricas y resultados de cada servicio." }] }),
  component: Page,
});

function Page() {
  const { resultados } = useClinicData();
  return (
    <>
      <PageHeader eyebrow="Métricas" title="Resultados" description="Indicadores clave por servicio. Actualizado cada semana." />
      {resultados.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-[12.5px] text-muted-foreground">
          Aún no hay métricas registradas para esta clínica.
        </p>
      ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {resultados.map((m) => {
          const servicio = getServicio(m.servicioSlug);
          const Icon = m.delta.startsWith("+") ? TrendingUp : m.delta.startsWith("-") ? TrendingDown : Minus;
          return (
            <div key={m.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: servicio?.color }} />
                <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: servicio?.color }}>{servicio?.nombre}</span>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">{m.label}</div>
              <div className="mt-1 text-[26px] font-semibold tabular-nums text-foreground">{m.valor}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11.5px]" style={{ color: m.positivo ? servicio?.color : "var(--muted-foreground)" }}>
                <Icon className="h-3 w-3" /> {m.delta}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </>
  );
}
