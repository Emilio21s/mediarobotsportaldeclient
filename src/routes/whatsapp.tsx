import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp · Media Robots" }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <ViewHeader
        eyebrow="Comunicación"
        title="WhatsApp directo"
        subtitle="Respuesta en menos de 2 horas · Lunes a viernes 8am–7pm"
      />
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En línea
        </span>
        <div className="mt-3 text-[15px] font-semibold text-neutral-900">Emilio Sandoval</div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600">
          Tu asesor de Media Robots. Escribime para dudas rápidas, cambios urgentes o coordinar horarios.
        </p>
        <a
          href="https://wa.me/5491100000000"
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#1a7a5e] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Abrir WhatsApp <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </>
  );
}