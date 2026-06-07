import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MessageCircle, Play, FileText } from "lucide-react";
import { getProximoPaso } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";
import { useSession } from "@/hooks/useSession";
import { useClinicData } from "@/hooks/useClinicData";
import { useLoomsOverrides } from "@/hooks/useLoomsOverrides";
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
  const { activeClinic } = useSession();
  const { entregables, proximosPasos } = useClinicData();
  const { getLooms } = useLoomsOverrides();
  const looms = useMemo(
    () => [...getLooms()].sort((a, b) => a.semana - b.semana),
    [getLooms],
  );
  const { servicios } = useServiciosContratados();
  const proximo = getProximoPaso(activeClinic.id);
  const ultimoLoom = looms[looms.length - 1];
  const ultimosEntregables = entregables.slice(-3).reverse();
  const proximaEntrega = [...proximosPasos]
    .filter((p) => p.tipo === "hito" || p.tipo === "accion")
    .sort((a, b) => a.fechaIso.localeCompare(b.fechaIso))[0]?.fecha ?? "—";
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  return (
    <>
      <PageHeader
        eyebrow={`Paquete ${activeClinic.paquete}`}
        title={`Buenas, ${activeClinic.nombreDoctor}`}
        description={`${activeClinic.nombreClinica} · Activo desde ${activeClinic.fechaInicio} · Asesor: ${activeClinic.asesor}`}
        right={
          <a
            href={activeClinic.whatsappLink}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        }
      />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Días activo" value={activeClinic.diasActivo} hint="desde el kickoff" />
        <StatCard label="Servicios" value={`${servicios.length}`} hint="contratados" />
        <StatCard label="Próxima entrega" value={proximaEntrega} />
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
                      className="h-full rounded-full transition-[width] duration-700 ease-out bg-[#19191a] border-[#19191a]"
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
          <Link
            to="/actualizaciones"
            className="block rounded-xl border border-border bg-card p-5 transition-colors hover:bg-[var(--sidebar-hover)]"
          >
            <h2 className="mb-3 text-[13px] font-semibold text-foreground">Último video</h2>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground bg-[#00001f]/[0.06]">
                Semana {ultimoLoom.semana}
              </span>
              <span className="text-[11px] text-muted-foreground">{ultimoLoom.duracion} · {ultimoLoom.fecha}</span>
            </div>
            <div className="mt-2 text-[14px] font-semibold text-foreground">{ultimoLoom.titulo}</div>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground">
              <Play className="h-3 w-3 fill-current" /> Ver video
            </span>
          </Link>
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
              <li key={e.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 bg-transparent">
                <div className="flex items-center gap-2.5">
                  <FileText className="text-muted-foreground w-[18px] h-[18px] text-[#0f0f10]" />
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
