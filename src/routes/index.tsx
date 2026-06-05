import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { KpiCard, ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inicio · Media Robots" },
      { name: "description", content: "Resumen del portal de cliente." },
    ],
  }),
  component: Page,
});

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  external,
}: {
  to: string;
  icon: typeof MessageCircle;
  title: string;
  description: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white px-5 py-4 transition-colors hover:bg-neutral-50">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-neutral-900">{title}</div>
        <div className="text-[12px] text-neutral-500">{description}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-neutral-400" />
    </div>
  );
  return external ? (
    <a href={to} target="_blank" rel="noopener">
      {content}
    </a>
  ) : (
    <Link to={to}>{content}</Link>
  );
}

function Page() {
  return (
    <>
      <ViewHeader
        eyebrow="General"
        title="Buenas, Clínica Dental García"
        subtitle="Resumen de tu proyecto con Media Robots."
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard label="Impresiones GMB" value="1,240" delta="+18%" deltaTone="positive" />
        <KpiCard label="Llamadas desde Google" value="32" delta="+9" deltaTone="positive" />
        <KpiCard label="Visitas al sitio web" value="84" />
        <KpiCard
          label="Citas agendadas GHL"
          value="—"
          delta="Pendiente de setup"
          deltaTone="pending"
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-3">
        <QuickAction
          to="/whatsapp"
          icon={MessageCircle}
          title="WhatsApp directo"
          description="Respuesta en menos de 2 horas, L–V 8am–7pm."
        />
        <QuickAction
          to="/agendar"
          icon={Phone}
          title="Call semanal"
          description="Reservá tu reunión de 20 minutos."
        />
      </section>
    </>
  );
}