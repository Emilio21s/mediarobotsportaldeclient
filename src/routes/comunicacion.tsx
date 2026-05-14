import { createFileRoute } from "@tanstack/react-router";
import { Smartphone, Film, Calendar, Mail } from "lucide-react";
import { portalData } from "@/data/portalData";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/comunicacion")({
  head: () => ({ meta: [{ title: "Comunicación · Media Robots" }, { name: "description", content: "Cómo y cuándo nos comunicamos contigo." }] }),
  component: Page,
});

const channels = [
  { Icon: Smartphone, title: "WhatsApp directo", detail: "Respuesta en menos de 2 horas, lunes a viernes 8am–7pm.", action: "Abrir chat", href: portalData.cliente.whatsappLink },
  { Icon: Film, title: "Loom semanal", detail: "Cada viernes antes de las 6pm recibís un video con los avances.", action: "Ver últimos videos", href: "/actualizaciones" },
  { Icon: Calendar, title: "Call semanal de 20 min", detail: "Reunión opcional cada viernes. Reservá tu horario.", action: "Reservar call", href: "#" },
  { Icon: Mail, title: "Email", detail: "emilio@mediarobots.com — para documentos formales y facturación.", action: "Escribir email", href: "mailto:emilio@mediarobots.com" },
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Canales" title="Comunicación" description="Estos son los canales que usamos para mantenernos en contacto." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {channels.map(({ Icon, title, detail, action, href }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-[13px] font-semibold text-foreground">{title}</div>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{detail}</p>
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="mt-3 inline-flex text-[12px] font-semibold text-primary">
              {action} →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
