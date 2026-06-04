import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { getServicio, portalData } from "@/data/portalData";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSession } from "@/hooks/useSession";
import { useMetricsOverrides, type Metric, type MetricStatus } from "@/hooks/useMetricsOverrides";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { ServicioSlug } from "@/types/portal";

export const Route = createFileRoute("/resultados")({
  head: () => ({ meta: [{ title: "Resultados · Media Robots" }, { name: "description", content: "Métricas y resultados de cada servicio." }] }),
  component: Page,
});

function trendIcon(delta: string) {
  if (delta.startsWith("+")) return TrendingUp;
  if (delta.startsWith("-")) return TrendingDown;
  return Minus;
}

function Page() {
  const { role } = useSession();
  const isAdmin = role === "Agency_Admin";
  const { getMetrics, upsertMetric, deleteMetric, newId } = useMetricsOverrides();
  const metrics = getMetrics();

  const [draft, setDraft] = useState<Metric | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Métricas"
        title="Resultados"
        description="Indicadores clave por servicio. Actualizado cada semana."
        right={isAdmin ? (
          <Button
            size="sm"
            onClick={() => setDraft({
              id: newId(),
              service_id: (portalData.servicios[0]?.slug ?? "seo") as ServicioSlug,
              metric_name: "",
              current_value: "0",
              trend_percentage: "+0%",
              status: "active",
            })}
          >
            <Plus className="mr-1 h-4 w-4" /> Agregar métrica
          </Button>
        ) : undefined}
      />

      {metrics.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-[12.5px] text-muted-foreground">
          Aún no hay métricas registradas para esta clínica.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => (
            <MetricCard
              key={m.id}
              metric={m}
              isAdmin={isAdmin}
              onSave={(patch) => {
                upsertMetric({ ...m, ...patch });
                toast.success("Métrica actualizada");
              }}
              onEdit={() => setDraft(m)}
              onDelete={() => {
                deleteMetric(m.id);
                toast.success("Métrica eliminada");
              }}
            />
          ))}
        </div>
      )}

      {draft && (
        <MetricDialog
          metric={draft}
          onClose={() => setDraft(null)}
          onSave={(m) => {
            upsertMetric(m);
            toast.success("Métrica guardada");
            setDraft(null);
          }}
        />
      )}
    </>
  );
}

function MetricCard({
  metric, isAdmin, onSave, onEdit, onDelete,
}: {
  metric: Metric;
  isAdmin: boolean;
  onSave: (patch: Partial<Metric>) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const servicio = getServicio(metric.service_id);
  const Icon = trendIcon(metric.trend_percentage);
  const positivo = metric.trend_percentage.startsWith("+");
  const isPending = metric.status === "pending_setup";

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: servicio?.color }} />
          <span className="text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: servicio?.color }}>
            {servicio?.nombre}
          </span>
          {isPending && (
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground">
              Pendiente
            </span>
          )}
        </div>
        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={onEdit}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Editar métrica"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
              aria-label="Eliminar métrica"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">{metric.metric_name}</div>

      <InlineField
        value={metric.current_value}
        editable={isAdmin}
        className="mt-1 text-[26px] font-semibold tabular-nums text-foreground"
        inputClassName="text-[26px] font-semibold tabular-nums"
        onSave={(v) => onSave({ current_value: v })}
      />

      <div className="mt-1 inline-flex items-center gap-1 text-[11.5px]" style={{ color: positivo ? servicio?.color : "var(--muted-foreground)" }}>
        <Icon className="h-3 w-3" />
        <InlineField
          value={metric.trend_percentage}
          editable={isAdmin}
          className="tabular-nums"
          inputClassName="text-[11.5px] tabular-nums w-16"
          onSave={(v) => onSave({ trend_percentage: v })}
        />
      </div>
    </div>
  );
}

function InlineField({
  value, editable, onSave, className, inputClassName,
}: {
  value: string;
  editable: boolean;
  onSave: (v: string) => void;
  className?: string;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { setV(value); }, [value]);
  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = v.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setV(value);
  };

  if (!editable) return <span className={className}>{value}</span>;

  if (editing) {
    return (
      <input
        ref={ref}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") { setV(value); setEditing(false); }
        }}
        className={`rounded border border-input bg-background px-1 outline-none focus:ring-2 focus:ring-ring ${inputClassName ?? ""}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click para editar"
      className={`cursor-text rounded text-left hover:bg-muted/50 ${className ?? ""}`}
    >
      {value}
    </button>
  );
}

function MetricDialog({
  metric, onSave, onClose,
}: {
  metric: Metric;
  onSave: (m: Metric) => void;
  onClose: () => void;
}) {
  const [m, setM] = useState<Metric>(metric);
  useEffect(() => { setM(metric); }, [metric]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metric.metric_name ? "Editar métrica" : "Nueva métrica"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label>Servicio</Label>
            <Select value={m.service_id} onValueChange={(v) => setM({ ...m, service_id: v as ServicioSlug })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {portalData.servicios.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Nombre de la métrica</Label>
            <Input value={m.metric_name} onChange={(e) => setM({ ...m, metric_name: e.target.value })} placeholder="Impresiones GMB" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Valor actual</Label>
              <Input value={m.current_value} onChange={(e) => setM({ ...m, current_value: e.target.value })} placeholder="1240" />
            </div>
            <div className="grid gap-1.5">
              <Label>Tendencia</Label>
              <Input value={m.trend_percentage} onChange={(e) => setM({ ...m, trend_percentage: e.target.value })} placeholder="+18%" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Estado</Label>
            <Select value={m.status} onValueChange={(v) => setM({ ...m, status: v as MetricStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="pending_setup">Pendiente de setup</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={() => {
              if (!m.metric_name.trim()) { toast.error("El nombre es obligatorio"); return; }
              onSave(m);
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

