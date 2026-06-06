import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getServicio } from "@/data/portalData";
import type { ServicioSlug } from "@/types/portal";

export type Kpi = {
  name: string;
  value: string;
  trend?: string; // "+18%", "+9", etc — optional
  badge?: string; // "Próximamente", "Pendiente de setup", "En desarrollo", etc
};

function trendMeta(trend?: string): { Icon: LucideIcon; color: string } {
  if (!trend) return { Icon: Minus, color: "var(--muted-foreground)" };
  if (trend.startsWith("+")) return { Icon: TrendingUp, color: "#10b981" };
  if (trend.startsWith("-")) return { Icon: TrendingDown, color: "#ef4444" };
  return { Icon: Minus, color: "var(--muted-foreground)" };
}

export function ServiceResults({
  serviceSlug,
  kpis,
}: {
  serviceSlug: ServicioSlug;
  kpis: Kpi[];
}) {
  const servicio = getServicio(serviceSlug);
  const color = servicio?.color ?? "#5B6AF0";

  return (
    <>
      <div className="mb-5 overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
        <div className="p-5">
          <PageHeader
            eyebrow={`Resultados · ${servicio?.nombre ?? ""}`}
            title={servicio?.nombre ?? "Resultados"}
            description={servicio?.descripcion}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.map((k) => {
              const { Icon, color: tColor } = trendMeta(k.trend);
              return (
                <div key={k.name} className="rounded-xl border border-border bg-background p-5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color }}>
                      {servicio?.nombre}
                    </span>
                  </div>
                  <div className="mt-2 text-[11.5px] text-muted-foreground">{k.name}</div>
                  <div className="mt-1 text-[26px] font-semibold tabular-nums text-foreground">{k.value}</div>
                  {k.trend ? (
                    <div className="mt-1 inline-flex items-center gap-1 text-[11.5px] tabular-nums" style={{ color: tColor }}>
                      <Icon className="h-3 w-3" />
                      {k.trend}
                    </div>
                  ) : k.badge ? (
                    <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                      {k.badge}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}