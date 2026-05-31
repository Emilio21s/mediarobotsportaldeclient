import { useState, type DragEvent } from "react";
import { Plus, Trash2, MessageSquare, Calendar, GripVertical, X, Lock } from "lucide-react";
import { useTareas, type Columna, type Prioridad, type Tarea } from "@/hooks/useTareas";
import { useSession } from "@/hooks/useSession";
import { portalData } from "@/data/portalData";
import { Button } from "@/components/ui/button";
import { useServicioOverrides, type EntregableLocal } from "@/hooks/useServicioOverrides";
import type { ServicioSlug } from "@/types/portal";

const COLUMNAS: { id: Columna; label: string; accent: string }[] = [
  { id: "backlog", label: "Backlog", accent: "var(--muted-foreground)" },
  { id: "progreso", label: "En progreso", accent: "#5B6AF0" },
  { id: "revision", label: "Revisión", accent: "#D97706" },
  { id: "completado", label: "Completado", accent: "#0A7C6A" },
];

const PRIO_STYLE: Record<Prioridad, { bg: string; fg: string; label: string }> = {
  alta: { bg: "#FDE8F0", fg: "#B5426B", label: "Alta" },
  media: { bg: "#FEF3E2", fg: "#D97706", label: "Media" },
  baja: { bg: "#E6F5F2", fg: "#0A7C6A", label: "Baja" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

export function KanbanBoard({ servicioSlug }: { servicioSlug?: string } = {}) {
  const { tareas, add, update, remove, move, addComment } = useTareas();
  const { role, activeClinic } = useSession();
  const { getEntregables } = useServicioOverrides();
  const isAdmin = role === "Agency_Admin";
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Columna | null>(null);
  const [openTask, setOpenTask] = useState<Tarea | null>(null);
  const [adding, setAdding] = useState(false);

  // Servicios disponibles para la clínica activa
  const serviciosClinica = portalData.servicios.filter((s) =>
    activeClinic.serviciosContratados.includes(s.slug),
  );
  const scopedTareas = servicioSlug
    ? tareas.filter((t) => t.servicioSlug === servicioSlug)
    : tareas;

  const canMove = (t: Tarea, target: Columna): boolean => {
    if (isAdmin) return true;
    // Cliente: solo revisión → completado, o revertir su propia mover
    if (t.columna === "revision" && target === "completado") return true;
    if (t.columna === "completado" && target === "revision") return true;
    return false;
  };

  const canDelete = (t: Tarea) => isAdmin || t.createdBy === "client";

  const onDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const onDragEnd = () => { setDraggingId(null); setOverCol(null); };
  const onDragOver = (e: DragEvent<HTMLDivElement>, col: Columna) => {
    e.preventDefault();
    setOverCol(col);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>, col: Columna) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    setOverCol(null); setDraggingId(null);
    if (!id) return;
    const t = tareas.find((x) => x.id === id);
    if (!t || t.columna === col) return;
    if (!canMove(t, col)) return;
    move(id, col);
  };

  // Live task in modal (read fresh from list)
  const liveOpenTask = openTask ? tareas.find((t) => t.id === openTask.id) ?? null : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12.5px] text-muted-foreground">
          {isAdmin
            ? "Arrastrá las tarjetas entre columnas. Hacé clic para editar o comentar."
            : "Podés mover tareas de Revisión a Completado y dejar comentarios."}
        </p>
        {isAdmin && (
          <Button size="sm" onClick={() => setAdding(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Nueva tarea
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNAS.map((col) => {
          const items = scopedTareas.filter((t) => t.columna === col.id);
          const isOver = overCol === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => onDragOver(e, col.id)}
              onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
              onDrop={(e) => onDrop(e, col.id)}
              className={`flex flex-col rounded-xl border bg-muted/30 p-2.5 transition-colors ${
                isOver ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <header className="mb-2 flex items-center justify-between px-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: col.accent }} />
                  <span className="text-[12px] font-semibold text-foreground">{col.label}</span>
                  <span className="text-[11px] text-muted-foreground">{items.length}</span>
                </div>
              </header>

              <div className="flex flex-col gap-2">
                {items.map((t) => {
                  const prio = PRIO_STYLE[t.prioridad];
                  const draggable = canMove(t, col.id === "revision" ? "completado" : "revision") || isAdmin;
                  const servicio = portalData.servicios.find((s) => s.slug === t.servicioSlug);
                  return (
                    <div
                      key={t.id}
                      draggable={draggable}
                      onDragStart={(e) => onDragStart(e, t.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => setOpenTask(t)}
                      className={`group cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/40 hover:shadow ${
                        draggingId === t.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: prio.bg, color: prio.fg }}
                        >
                          {prio.label}
                        </span>
                        {draggable ? (
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        ) : (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className="mt-2 text-[13px] font-medium leading-snug text-foreground">
                        {t.titulo}
                      </h4>
                      {servicio && (
                        <div className="mt-2 inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: servicio.color }} />
                          <span className="text-[10.5px] font-medium" style={{ color: servicio.color }}>
                            {servicio.nombre}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(t.fechaEntrega)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          {t.comentarios.length > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {t.comentarios.length}
                            </span>
                          )}
                          <span
                            className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                            style={{
                              background: t.createdBy === "agency" ? "var(--muted)" : "#EEF0FE",
                              color: t.createdBy === "agency" ? "var(--muted-foreground)" : "#5B6AF0",
                            }}
                          >
                            {t.createdBy === "agency" ? "Agencia" : "Cliente"}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border py-6 text-center text-[11px] text-muted-foreground">
                    Sin tareas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(adding || liveOpenTask) && (
        <TaskModal
          task={liveOpenTask}
          isAdmin={isAdmin}
          servicios={serviciosClinica}
          defaultServicioSlug={servicioSlug}
          getEntregables={getEntregables}
          authorName={isAdmin ? "Agencia" : activeClinic.nombreDoctor}
          onClose={() => { setAdding(false); setOpenTask(null); }}
          onCreate={(data) => { add({ ...data, columna: "backlog", createdBy: isAdmin ? "agency" : "client" }); setAdding(false); }}
          onUpdate={(patch) => liveOpenTask && update(liveOpenTask.id, patch)}
          onDelete={() => {
            if (liveOpenTask && canDelete(liveOpenTask)) {
              remove(liveOpenTask.id);
              setOpenTask(null);
            }
          }}
          onComment={(texto) => liveOpenTask && addComment(liveOpenTask.id, {
            autor: isAdmin ? "Agencia" : activeClinic.nombreDoctor,
            rol: isAdmin ? "agency" : "client",
            texto,
          })}
          canDelete={liveOpenTask ? canDelete(liveOpenTask) : false}
        />
      )}
    </div>
  );
}

function TaskModal({
  task, isAdmin, servicios, defaultServicioSlug, authorName, onClose, onCreate, onUpdate, onDelete, onComment, canDelete,
}: {
  task: Tarea | null;
  isAdmin: boolean;
  servicios: { slug: string; nombre: string; color: string }[];
  defaultServicioSlug?: string;
  authorName: string;
  onClose: () => void;
  onCreate: (data: { titulo: string; prioridad: Prioridad; fechaEntrega: string; servicioSlug?: string }) => void;
  onUpdate: (patch: Partial<Tarea>) => void;
  onDelete: () => void;
  onComment: (texto: string) => void;
  canDelete: boolean;
}) {
  const isNew = !task;
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [prioridad, setPrioridad] = useState<Prioridad>(task?.prioridad ?? "media");
  const [fechaEntrega, setFechaEntrega] = useState(task?.fechaEntrega ?? new Date().toISOString().slice(0, 10));
  const [servicioSlug, setServicioSlug] = useState<string>(task?.servicioSlug ?? defaultServicioSlug ?? servicios[0]?.slug ?? "");
  const [comentario, setComentario] = useState("");

  const editable = isAdmin;

  const save = () => {
    if (isNew) {
      if (!titulo.trim()) return;
      onCreate({ titulo: titulo.trim(), prioridad, fechaEntrega, servicioSlug: servicioSlug || undefined });
    } else {
      onUpdate({ titulo: titulo.trim(), prioridad, fechaEntrega, servicioSlug: servicioSlug || undefined });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-foreground">
            {isNew ? "Nueva tarea" : "Detalle de tarea"}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={!editable && !isNew}
              placeholder="Describí la tarea"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] disabled:opacity-70"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Prioridad</label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                disabled={!editable && !isNew}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] disabled:opacity-70"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Fecha</label>
              <input
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                disabled={!editable && !isNew}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] disabled:opacity-70"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Servicio vinculado</label>
            <select
              value={servicioSlug}
              onChange={(e) => setServicioSlug(e.target.value)}
              disabled={!editable && !isNew}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] disabled:opacity-70"
            >
              <option value="">Sin servicio</option>
              {servicios.map((s) => (
                <option key={s.slug} value={s.slug}>{s.nombre}</option>
              ))}
            </select>
          </div>

          {!isNew && task && (
            <div className="space-y-2 border-t border-border pt-3">
              <h4 className="text-[12px] font-semibold text-foreground">Comentarios</h4>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {task.comentarios.length === 0 && (
                  <p className="text-[11.5px] text-muted-foreground">Sin comentarios todavía.</p>
                )}
                {task.comentarios.map((c, i) => (
                  <div key={i} className="rounded-md bg-muted/50 p-2">
                    <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
                      <span className="font-semibold">{c.autor}</span>
                      <span>{new Date(c.fecha).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-foreground">{c.texto}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder={`Comentar como ${authorName}…`}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-[12.5px]"
                />
                <Button
                  size="sm"
                  onClick={() => { if (comentario.trim()) { onComment(comentario.trim()); setComentario(""); } }}
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
          <div>
            {!isNew && canDelete && (
              <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Borrar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cerrar</Button>
            {(isAdmin || isNew) && (
              <Button size="sm" onClick={save}>{isNew ? "Crear" : "Guardar"}</Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
