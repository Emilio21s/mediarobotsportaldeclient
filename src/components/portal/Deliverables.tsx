import { FileText, Check } from "lucide-react";
import { portalData } from "@/data/portalData";

export function Deliverables() {
  const { entregables } = portalData;
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 text-[13px] font-semibold text-foreground">
        <span aria-hidden>📁</span> Centro de entregables
      </h2>
      <ul className="space-y-2">
        {entregables.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium text-foreground">
                  {e.nombre}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {e.servicio} · {e.fecha}
                </div>
              </div>
            </div>
            <span
              className="flex shrink-0 items-center gap-1 text-[11px] font-semibold"
              style={{ color: e.statusColor }}
            >
              {e.status === "Aprobado" && <Check className="h-3 w-3" strokeWidth={3} />}
              {e.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}