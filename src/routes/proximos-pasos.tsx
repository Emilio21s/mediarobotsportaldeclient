import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Phone, Flag, KanbanSquare, CalendarDays } from "lucide-react";
import { portalData } from "@/data/portalData";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/portal/KanbanBoard";

export const Route = createFileRoute("/proximos-pasos")({
  head: () => ({ meta: [{ title: "Tareas · Media Robots" }, { name: "description", content: "Tablero Kanban de tareas y agenda del proyecto." }] }),
  component: Page,
});

const ICONS = { accion: Flag, call: Phone, hito: Calendar } as const;

type Tab = "tablero" | "agenda";

function Page() {
  const [tab, setTab] = useState<Tab>("tablero");
  const { proximosPasos } = useClinicData();
  const sorted = [...proximosPasos].sort((a, b) => a.fechaIso.localeCompare(b.fechaIso));

  return (
    <>
      <PageHeader
        eyebrow="Tareas"
        title="Tablero del proyecto"
        description="Gestioná las tareas en columnas tipo Kanban o consultá la agenda cronológica."
        right={
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <TabBtn active={tab === "tablero"} onClick={() => setTab("tablero")} icon={KanbanSquare}>
              Tablero
            </TabBtn>
            <TabBtn active={tab === "agenda"} onClick={() => setTab("agenda")} icon={CalendarDays}>
              Agenda
            </TabBtn>
          </div>
        }
      />

      {tab === "tablero" ? (
        <KanbanBoard />
      ) : (
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
      )}
    </>
  );
}

function TabBtn({
  active, onClick, icon: Icon, children,
}: { active: boolean; onClick: () => void; icon: typeof KanbanSquare; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
