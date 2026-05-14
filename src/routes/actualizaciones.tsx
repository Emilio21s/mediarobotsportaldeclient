import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Film } from "lucide-react";
import { portalData } from "@/data/portalData";
import { LoomCard } from "@/components/portal/LoomCard";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/actualizaciones")({
  head: () => ({ meta: [{ title: "Actualizaciones semanales · Media Robots" }, { name: "description", content: "Videos Loom semanales con avances del proyecto." }] }),
  component: Page,
});

function Page() {
  const { looms } = portalData;
  const [expandedId, setExpandedId] = useState<number | null>(looms[looms.length - 1]?.id ?? null);
  const nextWeek = (looms[looms.length - 1]?.semana ?? 0) + 1;
  return (
    <>
      <PageHeader eyebrow="Cada viernes" title="Actualizaciones semanales" description="Emilio te explica en video los avances de cada semana." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {looms.map((l) => (
          <LoomCard key={l.id} loom={l} expanded={expandedId === l.id} onToggle={() => setExpandedId((p) => (p === l.id ? null : l.id))} />
        ))}
        <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-10 text-center" style={{ border: "1.5px dashed var(--border)" }}>
          <Film className="mb-2 h-6 w-6 text-muted-foreground opacity-30" />
          <div className="text-[12px] font-medium text-muted-foreground">Semana {nextWeek}</div>
          <div className="text-[11px] text-muted-foreground">Próximo viernes</div>
        </div>
      </div>
    </>
  );
}
