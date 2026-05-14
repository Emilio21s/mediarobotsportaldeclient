import { MessageCircle } from "lucide-react";
import { portalData } from "@/data/portalData";

export function WelcomeHeader() {
  const { cliente } = portalData;
  return (
    <section className="space-y-1.5">
      <h1 className="text-[20px] font-semibold tracking-tight text-foreground">
        Bienvenido, {cliente.nombreDoctor} <span aria-hidden>👋</span>
      </h1>
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {cliente.nombreClinica} · Activo desde {cliente.fechaInicio} · Asesor: {cliente.asesor}
      </p>
      <a
        href={cliente.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Escribir por WhatsApp →
      </a>
    </section>
  );
}