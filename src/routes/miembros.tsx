import { createFileRoute } from "@tanstack/react-router";
import type { Miembro } from "@/types/portal";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/miembros")({
  head: () => ({ meta: [{ title: "Miembros · Media Robots" }, { name: "description", content: "Equipo Media Robots y contactos del cliente." }] }),
  component: Page,
});

function Group({ title, miembros }: { title: string; miembros: Miembro[] }) {
  return (
    <section className="mb-5 last:mb-0">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {miembros.map((m) => (
            <li key={m.id} className="flex items-center gap-3 p-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white" style={{ backgroundColor: m.avatarColor }}>
                {m.iniciales}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-foreground">{m.nombre}</div>
                <div className="text-[11px] text-muted-foreground">{m.rol}</div>
              </div>
              {m.email && <a href={`mailto:${m.email}`} className="text-[11.5px] font-semibold text-primary">Email</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Page() {
  const { miembros } = useClinicData();
  const mr = miembros.filter((m) => m.equipo === "media-robots");
  const cli = miembros.filter((m) => m.equipo === "cliente");
  return (
    <>
      <PageHeader eyebrow="Equipo" title="Miembros" description="Quienes trabajan en tu proyecto desde Media Robots y desde tu equipo." />
      <Group title="Media Robots" miembros={mr} />
      <Group title="Tu equipo" miembros={cli} />
    </>
  );
}
