import { Smartphone, Film, Calendar, Mail } from "lucide-react";

const channels = [
  { Icon: Smartphone, title: "WhatsApp directo", detail: "Respuesta en menos de 2 horas (8am–7pm)" },
  { Icon: Film, title: "Loom semanal", detail: "Cada viernes antes de las 6pm" },
  { Icon: Calendar, title: "Call semanal 20 min", detail: "Cada viernes — link de Calendly" },
  { Icon: Mail, title: "Email", detail: "emilio@mediarobots.com — documentos formales" },
];

export function Communication() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 text-[13px] font-semibold text-foreground">
        <span aria-hidden>💬</span> Cómo nos comunicamos
      </h2>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {channels.map(({ Icon, title, detail }) => (
          <div key={title} className="rounded-lg bg-background p-3 bg-zinc-50">
            <div className="flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-[12px] font-semibold text-foreground">{title}</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}