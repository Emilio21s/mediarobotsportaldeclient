import { createFileRoute } from "@tanstack/react-router";
import { FileText, ArrowUpRight } from "lucide-react";
import { ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/documentos")({
  head: () => ({ meta: [{ title: "Documentos · Media Robots" }] }),
  component: Page,
});

const docs = [
  { name: "Contrato de servicios", description: "Acuerdo firmado · PDF", href: "#" },
  { name: "Propuesta comercial", description: "Plan Pro · PDF", href: "#" },
  { name: "Brief inicial", description: "Notas del kickoff · Documento", href: "#" },
];

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Admin" title="Documentos" subtitle="Archivos compartidos del proyecto." />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <ul className="divide-y divide-neutral-200">
          {docs.map((d) => (
            <li key={d.name}>
              <a
                href={d.href}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  <FileText className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-neutral-900">{d.name}</div>
                  <div className="text-[12px] text-neutral-500">{d.description}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-neutral-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}