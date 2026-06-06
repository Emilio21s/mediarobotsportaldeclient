import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Film } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/comunicacion/agendar")({
  head: () => ({ meta: [{ title: "Agendar reunión · Media Robots" }, { name: "description", content: "Reservá tu call semanal o revisá los Looms." }] }),
  component: Page,
});

const items = [
  {
    Icon: Calendar,
    title: "Call semanal de 20 min",
    detail: "Reunión opcional cada viernes para revisar avances y resolver bloqueos. Reservá tu horario en Calendly.",
    cta: "Reservar call →",
    href: "https://calendly.com/mediarobots/weekly",
    accent: "#5B6AF0",
  },
  {
    Icon: Film,
    title: "Loom semanal",
    detail: "Cada viernes antes de las 6pm recibís un video corto con el detalle de avances de la semana.",
    cta: "Ver últimos videos →",
    href: "/actualizaciones",
    accent: "#0A7C6A",
  },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Comunicación · Agenda"
        title="Agendar reunión"
        description="Reservá tu call semanal o revisá los Looms con los avances."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(({ Icon, title, detail, cta, href, accent }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1a`, color: accent }}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="mt-3 text-[13.5px] font-semibold text-foreground">{title}</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{detail}</p>
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="mt-4 inline-flex text-[12.5px] font-semibold"
              style={{ color: accent }}
            >
              {cta}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}