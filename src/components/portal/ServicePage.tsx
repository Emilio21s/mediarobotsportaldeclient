import { useEffect, useMemo, useState } from "react";
import { Check, CircleDot, Circle, FileText, ExternalLink, Play, Pencil, Plus, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Servicio } from "@/types/portal";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/portal/KanbanBoard";
import { useTareas } from "@/hooks/useTareas";
import { useSession } from "@/hooks/useSession";
import { useServicioOverrides, type PasoLocal, type EntregableLocal, type EntregableStatus, ENTREGABLE_STATUS_COLOR } from "@/hooks/useServicioOverrides";
import { Button } from "@/components/ui/button";

function shortDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }); }
  catch { return iso; }
}

export function ServicePage({ servicio }: { servicio: Servicio }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const data = useClinicData();
  const { role } = useSession();
  const isAdmin = role === "Agency_Admin";
  const { tareas } = useTareas();
  const { getOverride, setPasos, getEntregables, setEntregables } = useServicioOverrides();

  const looms = data.looms.filter((l) => l.serviciosSlugs.includes(servicio.slug));
  const entregables = getEntregables(servicio.slug);
  const metricas = data.resultados.filter((m) => m.servicioSlug === servicio.slug);

  // Tareas del servicio
  const tareasServicio = tareas.filter((t) => t.servicioSlug === servicio.slug);
  const completadas = tareasServicio.filter((t) => t.columna === "completado").length;
  const totalTareas = tareasServicio.length;

  const override = getOverride(servicio.slug);

  // Hitos = entregables del servicio. Cada hito agrupa tareas vinculadas por entregableId.
  const hitosComputed = entregables.map((e) => {
    const matched = tareasServicio.filter((t) => t.entregableId === e.id);
    const done = matched.filter((t) => t.columna === "completado").length;
    const total = matched.length;
    const ratio = total > 0 ? done / total : 0;
    let estado: "completada" | "actual" | "pendiente";
    if (total > 0 && ratio === 1) estado = "completada";
    else if (total > 0) estado = "actual";
    else estado = "pendiente";
    return { id: e.id, nombre: e.nombre, fecha: e.fecha, estado, done, total, ratio };
  });
  // Marca la primera pendiente como "actual" si ninguna está activa.
  const hasActual = hitosComputed.some((f) => f.estado === "actual");
  if (!hasActual) {
    const idx = hitosComputed.findIndex((f) => f.estado === "pendiente");
    if (idx !== -1) hitosComputed[idx] = { ...hitosComputed[idx], estado: "actual" };
  }
  // Avance general = % de entregables completados (todas sus tareas en "completado").
  // Un entregable sin tareas vinculadas cuenta como no completado para mantener
  // la consistencia tras crear/editar/eliminar entregables o tareas.
  const entregablesCompletados = hitosComputed.filter(
    (f) => f.total > 0 && f.ratio === 1,
  ).length;
  const avanceFinal = hitosComputed.length > 0
    ? Math.round((entregablesCompletados / hitosComputed.length) * 100)
    : (totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : servicio.avance);

  // Próximos pasos: override list (PasoLocal) si existe; sino, defaults de portalData
  const defaultPasos: PasoLocal[] = useMemo(
    () => data.proximosPasos
      .filter((p) => p.servicioSlug === servicio.slug)
      .map((p) => ({
        id: `seed-${p.id}`,
        fecha: p.fecha,
        fechaIso: p.fechaIso,
        texto: p.texto,
        tipo: p.tipo,
      })),
    [data.proximosPasos, servicio.slug],
  );
  const pasosActuales: PasoLocal[] = override.pasos ?? defaultPasos;

  const [pasoModal, setPasoModal] = useState<{ paso: PasoLocal | null } | null>(null);
  const [entregableModal, setEntregableModal] = useState<{ entregable: EntregableLocal | null } | null>(null);

  const savePaso = (paso: PasoLocal) => {
    const exists = pasosActuales.some((p) => p.id === paso.id);
    const next = exists
      ? pasosActuales.map((p) => (p.id === paso.id ? paso : p))
      : [...pasosActuales, paso];
    next.sort((a, b) => a.fechaIso.localeCompare(b.fechaIso));
    setPasos(servicio.slug, next);
    setPasoModal(null);
  };
  const removePaso = (id: string) => {
    setPasos(servicio.slug, pasosActuales.filter((p) => p.id !== id));
  };

  const saveEntregable = (e: EntregableLocal) => {
    const exists = entregables.some((x) => x.id === e.id);
    const next = exists
      ? entregables.map((x) => (x.id === e.id ? e : x))
      : [...entregables, e];
    setEntregables(servicio.slug, next);
    setEntregableModal(null);
  };
  const removeEntregable = (id: string) => {
    setEntregables(servicio.slug, entregables.filter((x) => x.id !== id));
  };

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
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Avance general</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {hitosComputed.length === 0
                ? "Creá entregables para definir los hitos del proyecto"
                : `${entregablesCompletados} de ${hitosComputed.length} entregables completados · ${completadas}/${totalTareas} tareas`}
            </p>
          </div>
          <span className="text-[20px] font-semibold tabular-nums" style={{ color: servicio.color }}>
            {avanceFinal}%
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border-soft)]">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out bg-[#19191a]"
            style={{ width: mounted ? `${avanceFinal}%` : "0%", backgroundColor: servicio.color }}
          />
        </div>

        {/* Phases timeline */}
        <ol className="mt-6 space-y-3">
          {hitosComputed.length === 0 && (
            <li className="text-[12px] text-muted-foreground">Sin hitos todavía.</li>
          )}
          {hitosComputed.map((f, i) => {
            const Icon = f.estado === "completada" ? Check : f.estado === "actual" ? CircleDot : Circle;
            return (
              <li key={f.id ?? i} className="flex items-start gap-3">
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
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {f.total > 0 ? `${f.done}/${f.total} tareas` : "sin tareas"}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Two columns */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground">Entregables</h2>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => setEntregableModal({ entregable: null })} className="h-7 gap-1 px-2 text-[11px]">
                <Plus className="h-3 w-3" /> Nuevo
              </Button>
            )}
          </div>
          {entregables.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Aún no hay entregables.</p>
          ) : (
            <ul className="space-y-2">
              {entregables.map((e) => (
                <li key={e.id} className="group flex items-center justify-between rounded-lg bg-background px-3 py-2 bg-transparent">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="shrink-0 text-muted-foreground w-[18px] h-[18px] text-[#0f0f10]" />
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-medium text-foreground">{e.nombre}</div>
                      <div className="text-[11px] text-muted-foreground">{e.fecha} · {e.version}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] font-semibold" style={{ color: e.statusColor }}>{e.status}</span>
                    {isAdmin && (
                      <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => setEntregableModal({ entregable: e })}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Editar entregable"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeEntregable(e.id)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Borrar entregable"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
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
                <li key={l.id} className="rounded-lg bg-background p-3 bg-zinc-50">
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
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-foreground">Próximos pasos</h2>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => setPasoModal({ paso: null })} className="h-7 gap-1 px-2 text-[11px]">
                <Plus className="h-3 w-3" /> Agregar
              </Button>
            )}
          </div>
          {pasosActuales.length === 0 ? (
            <p className="text-[12px] text-muted-foreground">Sin pasos pendientes.</p>
          ) : (
            <ul className="divide-y divide-border">
              {pasosActuales.map((p) => (
                <li key={p.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="min-w-[60px] text-[11px] font-semibold" style={{ color: servicio.color }}>{p.fecha}</span>
                  <span className="flex-1 text-[12.5px] text-foreground">{p.texto}</span>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPasoModal({ paso: p })}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Editar"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removePaso(p.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Borrar"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
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
                <li key={m.id} className="rounded-lg bg-background p-3 bg-zinc-50">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                  <div className="mt-1 text-[18px] font-semibold text-foreground">{m.valor}</div>
                  <div className="text-[11px]" style={{ color: m.positivo ? servicio.color : "var(--muted-foreground)" }}>{m.delta}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Kanban del servicio */}
      <section className="mt-5 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Tablero de tareas</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Las tareas completadas alimentan el avance del servicio automáticamente.
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground">{completadas}/{totalTareas} completadas</span>
        </div>
        <KanbanBoard servicioSlug={servicio.slug} />
      </section>

      {pasoModal && (
        <PasoModal
          paso={pasoModal.paso}
          onClose={() => setPasoModal(null)}
          onSave={savePaso}
        />
      )}

      {entregableModal && (
        <EntregableModal
          entregable={entregableModal.entregable}
          servicioNombre={servicio.nombre}
          servicioSlug={servicio.slug}
          onClose={() => setEntregableModal(null)}
          onSave={saveEntregable}
        />
      )}
    </>
  );
}

function PasoModal({
  paso, onClose, onSave,
}: {
  paso: PasoLocal | null;
  onClose: () => void;
  onSave: (p: PasoLocal) => void;
}) {
  const isNew = !paso;
  const [texto, setTexto] = useState(paso?.texto ?? "");
  const [fechaIso, setFechaIso] = useState(paso?.fechaIso ?? new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState<PasoLocal["tipo"]>(paso?.tipo ?? "accion");

  const save = () => {
    if (!texto.trim()) return;
    const fecha = shortDate(fechaIso);
    onSave({
      id: paso?.id ?? `local-${Date.now()}`,
      texto: texto.trim(),
      fechaIso,
      fecha,
      tipo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-foreground">{isNew ? "Nuevo paso" : "Editar paso"}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </header>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Descripción</label>
            <input
              value={texto} onChange={(e) => setTexto(e.target.value)}
              placeholder="¿Qué sigue?"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Fecha</label>
              <input
                type="date" value={fechaIso} onChange={(e) => setFechaIso(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Tipo</label>
              <select
                value={tipo} onChange={(e) => setTipo(e.target.value as PasoLocal["tipo"])}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
              >
                <option value="accion">Acción</option>
                <option value="call">Call</option>
                <option value="hito">Hito</option>
              </select>
            </div>
          </div>
        </div>
        <footer className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={save}>{isNew ? "Agregar" : "Guardar"}</Button>
        </footer>
      </div>
    </div>
  );
}

function EntregableModal({
  entregable, servicioNombre, servicioSlug, onClose, onSave,
}: {
  entregable: EntregableLocal | null;
  servicioNombre: string;
  servicioSlug: EntregableLocal["servicioSlug"];
  onClose: () => void;
  onSave: (e: EntregableLocal) => void;
}) {
  const isNew = !entregable;
  const [nombre, setNombre] = useState(entregable?.nombre ?? "");
  const [version, setVersion] = useState(entregable?.version ?? "v1");
  const [status, setStatus] = useState<EntregableStatus>(entregable?.status ?? "Borrador");
  const [fechaIso, setFechaIso] = useState(() => {
    if (entregable?.fecha) {
      const d = new Date(entregable.fecha);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  });

  const save = () => {
    if (!nombre.trim()) return;
    const fecha = new Date(fechaIso).toLocaleDateString("es-ES", { day: "2-digit", month: "long" });
    onSave({
      id: entregable?.id ?? `local-${Date.now()}`,
      nombre: nombre.trim(),
      servicioSlug,
      servicio: servicioNombre,
      version: version.trim() || "v1",
      status,
      fecha,
      statusColor: ENTREGABLE_STATUS_COLOR[status],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-foreground">{isNew ? "Nuevo entregable" : "Editar entregable"}</h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </header>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Nombre del archivo</label>
            <input
              value={nombre} onChange={(e) => setNombre(e.target.value)}
              placeholder="Mockup_home_v2.pdf"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Versión</label>
              <input
                value={version} onChange={(e) => setVersion(e.target.value)}
                placeholder="v1"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Fecha</label>
              <input
                type="date" value={fechaIso} onChange={(e) => setFechaIso(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Estado</label>
            <select
              value={status} onChange={(e) => setStatus(e.target.value as EntregableStatus)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px]"
            >
              <option value="Borrador">Borrador</option>
              <option value="Para revisión">Para revisión</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Final entregado">Final entregado</option>
            </select>
          </div>
          <p className="text-[10.5px] text-muted-foreground">Vinculado a <span className="font-semibold text-foreground">{servicioNombre}</span></p>
        </div>
        <footer className="mt-5 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" onClick={save}>{isNew ? "Crear" : "Guardar"}</Button>
        </footer>
      </div>
    </div>
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
