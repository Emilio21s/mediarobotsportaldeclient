import { useState } from "react";
import { Film, FolderOpen } from "lucide-react";
import { portalData } from "@/data/portalData";
import { LoomCard } from "./LoomCard";

export function WeeklyUpdates() {
  const { looms } = portalData;
  const [expandedId, setExpandedId] = useState<number | null>(looms[0]?.id ?? null);
  const nextWeek = (looms[looms.length - 1]?.semana ?? 0) + 1;

  return (
    <section
      className="relative overflow-hidden rounded-xl bg-card p-5 sm:p-6"
      style={{ border: "1.5px solid var(--primary-mid)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] bg-primary"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground">
            <span aria-hidden>🎬</span> Actualizaciones semanales
          </h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Cada viernes antes de las 6pm — Emilio te explica qué avanzamos esta semana
          </p>
        </div>
        <span className="shrink-0 bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground border-[#00001f]/[0.09] border border-solid font-sans text-slate-950 bg-transparent rounded-md">
          {looms.length} videos
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {looms.map((loom) => (
          <LoomCard
            key={loom.id}
            loom={loom}
            expanded={expandedId === loom.id}
            onActivate={() =>
              setExpandedId((prev) => (prev === loom.id ? null : loom.id))
            }
          />
        ))}
        <div
          className="flex flex-col items-center justify-center rounded-[10px] bg-background px-4 py-8 text-center"
          style={{ border: "1.5px dashed var(--border)" }}
        >
          <Film className="mb-2 h-6 w-6 text-muted-foreground opacity-30" />
          <div className="text-[12px] font-medium text-muted-foreground">Semana {nextWeek}</div>
          <div className="text-[11px] text-muted-foreground">Próximo viernes</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--primary-soft)] px-3.5 py-2.5 text-[11px] text-primary">
        <FolderOpen className="h-3.5 w-3.5" />
        Todos los videos quedan archivados aquí. Puede volver a verlos cuando necesite.
      </div>
    </section>
  );
}