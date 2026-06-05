import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Film, ArrowRight } from "lucide-react";
import { ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/agendar")({
  head: () => ({ meta: [{ title: "Agendar reunión · Media Robots" }] }),
  component: Page,
});

const items = [
  {
    icon: Calendar,
    title: "Call semanal de 20 min",
    description: "Reunión opcional cada viernes. Reservá tu horario.",
    cta: "Reservar call",
    href: "#",
  },
  {
    icon: Film,
    title: "Loom semanal",
    description: "Cada viernes recibís un video con los avances de la semana.",
    cta: "Ver últimos Looms",
    href: "#",
  },
];

function Page() {
  return (
    <>
      <ViewHeader
        eyebrow="Comunicación"
        title="Agendar reunión"
        subtitle="Coordinemos un espacio para revisar el avance."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, description, cta, href }) => (
          <div key={title} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
            <div className="mt-4 text-[14px] font-semibold text-neutral-900">{title}</div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-600">{description}</p>
            <a
              href={href}
              className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-[#1a7a5e]"
            >
              {cta} <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
    </>
  );
}