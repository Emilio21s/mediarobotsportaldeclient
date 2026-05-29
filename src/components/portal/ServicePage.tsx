import { useEffect, useState } from "react";
import { Check, CircleDot, Circle, FileText, ExternalLink, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Servicio } from "@/types/portal";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/portal/KanbanBoard";

export function ServicePage({ servicio }: { servicio: Servicio }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const data = useClinicData();
  const looms = data.looms.filter((l) => l.serviciosSlugs.includes(servicio.slug));
  const entregables = data.entregables.filter((e) => e.servicioSlug === servicio.slug);
  const pasos = data.proximosPasos.filter((p) => p.servicioSlug === servicio.slug);
  const metricas = data.resultados.filter((m) => m.servicioSlug === servicio.slug);

  return (
    <>
      <PageHeader
        eyebrow="Servicio"
        title={servicio.nombre}
        description={servicio.descripcion}
        right={
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: servicio.colorSoft, color: servicio.color }}
            >
              {servicio.fase}
            </span>
          </div>
        }
      />

      {/* Progress card */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold text-foreground">Avance general</h2>
          <span className="text-[20px] font-semibold tabular-nums" style={{ color: servicio.color }}>
            {servicio.avance}%
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-soft)]">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: mounted ? `${servicio.avance}%` : "0%", backgroundColor: servicio.color }}
          />
        </div>

        {/* Phases timeline */}
        <ol className="mt-6 space-y-3">
          {servicio.fases.map((f, i) => {
            const Icon = f.estado === "completada" ? Check : f.estado === "actual" ? CircleDot : Circle;
            return (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: f.estado === "completada" ? servicio.color : f.estado === "actual" ? servicio.colorSoft : "transparent",
                    border: f.estado === "pendiente" ? "1.5px solid var(--border)" : "none",
                    color: f.estado === "completada" ? "white" : servicio.color,
                  }}
                >
                  <Icon className="h-3 w-3" strokeWidth={f.estado === "completada" ? 3 : 2} />
                </div>
                <div className="flex flex-1 items-baseline justify-between gap-2">
                  <span className={`text-[13px] ${f.estado === "actual" ? "font-semibold text-foreground" : "text-foreground"}`}>
                    {f.nombre}
                  </span>
                  {f.fecha && <span className="text-[11px] text-muted-foreground">{f.fecha}</span>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Two columns */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[13px] font-semibold text-foreground">Entregables</h2>
          {entregables.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Aún no hay entregables.</p>
          ) : (
            <ul className="space-y-2">
              {entregables.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <div className="text-[12px] font-medium text-foreground">{e.nombre}</div>
                      <div className="text-[11px] text-muted-foreground">{e.fecha} · {e.version}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: e.statusColor }}>{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[13px] font-semibold text-foreground">Videos relacionados</h2>
          {looms.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">No hay videos aún.</p>
          ) : (
            <ul className="space-y-2.5">
              {looms.map((l) => (
                <li key={l.id} className="rounded-lg bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Semana {l.semana}</span>
                    <span className="text-[10px] text-muted-foreground">{l.duracion}</span>
                  </div>
                  <div className="mt-1 text-[12.5px] font-medium text-foreground">{l.titulo}</div>
                  <a href={l.linkLoom} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: servicio.color }}>
                    <Play className="h-3 w-3 fill-current" /> Ver video
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[13px] font-semibold text-foreground">Próximos pasos</h2>
          {pasos.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Sin pasos pendientes.</p>
          ) : (
            <ul className="divide-y divide-border">
              {pasos.map((p) => (
                <li key={p.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="min-w-[60px] text-[11px] font-semibold" style={{ color: servicio.color }}>{p.fecha}</span>
                  <span className="text-[12.5px] text-foreground">{p.texto}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[13px] font-semibold text-foreground">Resultados</h2>
          {metricas.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Sin métricas registradas.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {metricas.map((m) => (
                <li key={m.id} className="rounded-lg bg-background p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  <div className="mt-1 text-[18px] font-semibold text-foreground">{m.valor}</div>
                  <div className="text-[11px]" style={{ color: m.positivo ? servicio.color : "var(--muted-foreground)" }}>{m.delta}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export function ServiceNotContracted({ nombre }: { nombre: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-[20px] font-semibold text-foreground">{nombre} no está contratado</h1>
      <p className="mt-2 max-w-md text-[13px] text-muted-foreground">
        Este servicio no forma parte de tu paquete actual. Si te interesa activarlo, hablá con tu asesor.
      </p>
      <Link to="/" className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
        Volver al inicio <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}
