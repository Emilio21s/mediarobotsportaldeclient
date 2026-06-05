import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email · Media Robots" }] }),
  component: Page,
});

function Page() {
  const email = "emilio.sandoval@mediarobots.com";
  return (
    <>
      <ViewHeader
        eyebrow="Comunicación"
        title="Email"
        subtitle="Canal formal para documentos y facturación."
      />
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
          <Mail className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="mt-4 text-[14px] font-semibold text-neutral-900">{email}</div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-600">
          Usá este canal para documentos formales, contratos y facturación. Respondemos en 24 hs hábiles.
        </p>
        <a
          href={`mailto:${email}`}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#1a7a5e] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Redactar email <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </>
  );
}