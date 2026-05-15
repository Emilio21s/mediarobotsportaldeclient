import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { portalData } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración · Media Robots" },
      { name: "description", content: "Configurá qué servicios están contratados por el cliente." },
    ],
  }),
  component: ConfigPage,
});

function ConfigPage() {
  const { contratados, toggle, setContratados } = useServiciosContratados();
  const { role, activeClinic } = useSession();

  if (role !== "Agency_Admin") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
        <h2 className="mt-3 text-[15px] font-semibold text-foreground">Acceso restringido</h2>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Esta sección solo está disponible para el equipo de Media Robots.
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Panel admin"
        title={`Configuración · ${activeClinic.nombreClinica}`}
        description="Activá los servicios que este cliente tiene contratados. La selección filtra el Home, la barra lateral y las páginas de servicio."
        right={
          <button
            onClick={() => setContratados([])}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-[var(--sidebar-hover)]"
          >
            Limpiar todo
          </button>
        }
      />

      <section className="rounded-xl border border-border bg-card p-2">
        <ul className="divide-y divide-border">
          {portalData.servicios.map((s) => {
            const activo = contratados.includes(s.slug);
            return (
              <li key={s.slug}>
                <button
                  onClick={() => toggle(s.slug)}
                  className="flex w-full items-center gap-4 rounded-lg px-3 py-3.5 text-left transition-colors hover:bg-[var(--sidebar-hover)]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: s.colorSoft, color: s.color }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-foreground">{s.nombre}</div>
                    <div className="text-[11.5px] text-muted-foreground">{s.descripcion}</div>
                  </div>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md border"
                    style={{
                      borderColor: activo ? s.color : "var(--border)",
                      backgroundColor: activo ? s.color : "transparent",
                    }}
                    aria-hidden
                  >
                    {activo && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-3 text-[11.5px] text-muted-foreground">
        Esta configuración se guarda localmente en este navegador. Cuando conectes Lovable Cloud, podemos persistirla por cliente.
      </p>
    </>
  );
}
