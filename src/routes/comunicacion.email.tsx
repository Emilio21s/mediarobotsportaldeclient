import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const EMAIL = "emilio@mediarobots.me";

export const Route = createFileRoute("/comunicacion/email")({
  head: () => ({ meta: [{ title: "Email · Comunicación · Media Robots" }, { name: "description", content: "Email para documentos formales y facturación." }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Comunicación · Email"
        title="Email"
        description="Para documentos formales, contratos y facturación."
      />
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-foreground">{EMAIL}</div>
            <div className="text-[11.5px] text-muted-foreground">Respuesta en menos de 24h hábiles</div>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          Usá el email para documentos formales, contratos, comprobantes y facturación.
          Para dudas rápidas o pedidos del día a día, preferimos WhatsApp.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 bg-[#0f0f10] font-sans"
        >
          Redactar email →
        </a>
      </div>
    </>
  );
}