import { portalData } from "@/data/portalData";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[10px] border border-border bg-card px-4 py-3.5">
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-[18px] font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function QuickStats() {
  const { stats } = portalData;
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard label="Días activo" value={stats.diasActivo} />
      <StatCard label="Servicios activos" value={stats.serviciosActivos} />
      <StatCard label="Próxima entrega" value={stats.proximaEntrega} />
    </section>
  );
}