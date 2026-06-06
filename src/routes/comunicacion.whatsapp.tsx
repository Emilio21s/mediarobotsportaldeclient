import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/comunicacion/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp · Comunicación · Media Robots" }, { name: "description", content: "Chat directo por WhatsApp con tu asesor." }] }),
  component: Page,
});

function Page() {
  const { activeClinic } = useSession();
  return (
    <>
      <PageHeader
        eyebrow="Comunicación · WhatsApp"
        title="WhatsApp directo"
        description="Respuesta en menos de 2 horas · Lunes a viernes 8am–7pm"
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[14px] font-semibold text-foreground">{activeClinic.asesor}</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> En línea
                </span>
              </div>
              <div className="text-[11.5px] text-muted-foreground">Asesor asignado · Media Robots</div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          Escribinos lo que necesités: dudas, pedidos, ajustes o emergencias. Respondemos en menos de 2 horas
          dentro del horario de atención. Para temas formales o facturación, usá el email.
        </p>
        <a
          href={activeClinic.whatsappLink}
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1ebe5d]"
        >
          Abrir WhatsApp →
        </a>
      </div>
    </>
  );
}