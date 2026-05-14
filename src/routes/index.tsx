import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, Play, FileText } from "lucide-react";
import { portalData, getProximoPaso, getServiciosContratados } from "@/data/portalData";
import { PageHeader } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home · Media Robots" },
      { name: "description", content: "Estado general de tu proyecto: avances, métricas y próximos pasos." },
    ],
  }),
  component: Home,
});

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-[22px] font-semibold text-foreground">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Home() {
  const { cliente, stats, looms } = portalData;
  const servicios = getServiciosContratados();
  const proximo = getProximoPaso();
  const ultimoLoom = looms[looms.length - 1];
  const ultimosEntregables = portalData.entregables.slice(-3).reverse();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <>
      <PageHeader
        eyebrow={`Paquete ${cliente.paquete}`}
        title={`Buenas, ${cliente.nombreDoctor.replace("Dr. ", "Dr. ")}`}
        description={`${cliente.nombreClinica} · Activo desde ${cliente.fechaInicio} · Asesor: ${cliente.asesor}`}
        right={
          <a
            href={cliente.whatsappLink}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Días activo" value={stats.diasActivo} hint="desde el kickoff" />
        <StatCard label="Servicios" value={`${servicios.length}`} hint="contratados" />
        <StatCard label="Próxima entrega" value={stats.proximaEntrega} />
        <StatCard label="Próximo paso" value={proximo?.fecha ?? "—"} hint={proximo?.tipo} />
      </section>

      {/* Service status */}
      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">Estado de tus servicios</h2>
          <span className="text-[11px] text-muted-foreground">Click para ver detalle</span>
        </div>
        <ul className="divide-y divide-border">
          {servicios.map((s) => (
            <li key={s.slug}>
              <Link
                to={`/servicios/${s.slug}`}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-[var(--sidebar-hover)] -mx-2 px-2 rounded-md"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-foreground">{s.nombre}</span>
                    <span className="text-[11px] text-muted-foreground">{s.fase}</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--border-soft)]">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{ width: mounted ? `${s.avance}%` : "0%", backgroundColor: s.color }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-[12px] font-semibold tabular-nums" style={{ color: s.avance === 0 ? "var(--muted-foreground)" : s.color }}>
                  {s.avance}%
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Two-column secondary */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {ultimoLoom && (
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-[13px] font-semibold text-foreground">Último video</h2>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Semana {ultimoLoom.semana}
              </span>
              <span className="text-[11px] text-muted-foreground">{ultimoLoom.duracion} · {ultimoLoom.fecha}</span>
            </div>
            <div className="mt-2 text-[14px] font-semibold text-foreground">{ultimoLoom.titulo}</div>
            <a href={ultimoLoom.linkLoom} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground">
              <Play className="h-3 w-3 fill-current" /> Ver video
            </a>
          </section>
        )}

        {proximo && (
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 text-[13px] font-semibold text-foreground">Próximo paso</h2>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{proximo.fecha} · {proximo.tipo}</div>
            <div className="mt-1.5 text-[14px] text-foreground">{proximo.texto}</div>
            <Link to="/proximos-pasos" className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
              Ver toda la agenda <ArrowRight className="h-3 w-3" />
            </Link>
          </section>
        )}

        <section className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[13px] font-semibold text-foreground">Últimos entregables</h2>
            <Link to="/entregables" className="text-[11px] font-semibold text-primary">Ver todos →</Link>
          </div>
          <ul className="space-y-2">
            {ultimosEntregables.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <div className="text-[12px] font-medium text-foreground">{e.nombre}</div>
                    <div className="text-[11px] text-muted-foreground">{e.servicio} · {e.fecha}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: e.statusColor }}>{e.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
