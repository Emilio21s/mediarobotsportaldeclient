import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, Link2, KeyRound, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";

const ICONS: Record<string, LucideIcon> = { doc: FileText, link: Link2, credenciales: KeyRound };

export const Route = createFileRoute("/recursos")({
  head: () => ({ meta: [{ title: "Recursos importantes · Media Robots" }, { name: "description", content: "Documentos, accesos y credenciales clave del proyecto." }] }),
  component: Page,
});

function Page() {
  const { recursos } = useClinicData();
  return (
    <>
      <PageHeader eyebrow="Documentación" title="Recursos importantes" description="Accesos, brief, manual de marca y credenciales compartidas." />
      {recursos.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-[12.5px] text-muted-foreground">
          Sin recursos cargados todavía.
        </p>
      ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recursos.map((r) => {
          const Icon = ICONS[r.tipo] ?? BookMarked;
          return (
            <a key={r.id} href={r.link} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-[var(--sidebar-hover)]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-foreground">{r.titulo}</div>
                <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">{r.descripcion}</div>
              </div>
            </a>
          );
        })}
      </div>
      )}
    </>
  );
}
