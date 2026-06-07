import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Film, Plus, Trash2 } from "lucide-react";
import { LoomCard } from "@/components/portal/LoomCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSession } from "@/hooks/useSession";
import { useLoomsOverrides, loomEmbedUrl } from "@/hooks/useLoomsOverrides";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Loom } from "@/types/portal";

export const Route = createFileRoute("/actualizaciones")({
  head: () => ({ meta: [{ title: "Actualizaciones semanales · Media Robots" }, { name: "description", content: "Videos Loom semanales con avances del proyecto." }] }),
  component: Page,
});

type Draft = {
  id: number;
  semana: number;
  fecha: string;
  titulo: string;
  duracion: string;
  linkLoom: string;
  resumenText: string;
  tagsText: string;
};

function toDraft(l: Loom): Draft {
  return {
    id: l.id,
    semana: l.semana,
    fecha: l.fecha,
    titulo: l.titulo,
    duracion: l.duracion,
    linkLoom: l.linkLoom,
    resumenText: l.resumen.join("\n"),
    tagsText: l.tags.join(", "),
  };
}

function Page() {
  const { role, activeClinic } = useSession();
  const isAdmin = role === "Agency_Admin";
  const { getLooms, upsertLoom, deleteLoom } = useLoomsOverrides();
  const looms = useMemo(() => [...getLooms()].sort((a, b) => a.semana - b.semana), [getLooms]);

  const [expandedId, setExpandedId] = useState<number | null>(looms[looms.length - 1]?.id ?? null);
  const [viewLoom, setViewLoom] = useState<Loom | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  const nextWeek = (looms[looms.length - 1]?.semana ?? 0) + 1;

  const startCreate = () => {
    setEditing({
      id: Date.now(),
      semana: nextWeek,
      fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      titulo: "",
      duracion: "5 min",
      linkLoom: "",
      resumenText: "",
      tagsText: "",
    });
  };

  const saveDraft = () => {
    if (!editing) return;
    const loom: Loom = {
      id: editing.id,
      clinicaId: activeClinic.id,
      semana: Number(editing.semana) || 1,
      fecha: editing.fecha.trim(),
      titulo: editing.titulo.trim() || "Sin título",
      duracion: editing.duracion.trim() || "—",
      tags: editing.tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      serviciosSlugs: [],
      resumen: editing.resumenText.split("\n").map((t) => t.trim()).filter(Boolean),
      linkLoom: editing.linkLoom.trim(),
      vistoCliente: false,
    };
    upsertLoom(loom);
    setEditing(null);
  };

  const embed = viewLoom ? loomEmbedUrl(viewLoom.linkLoom) : null;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <PageHeader eyebrow="Cada viernes" title="Actualizaciones semanales" description="Emilio te explica en video los avances de cada semana." />
        {isAdmin && (
          <Button size="sm" onClick={startCreate} className="mt-1 gap-1.5">
            <Plus className="h-4 w-4" /> Agregar semana
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {looms.map((l) => (
          <LoomCard
            key={l.id}
            loom={l}
            expanded={expandedId === l.id}
            onActivate={() => {
              setExpandedId(l.id);
              if (isAdmin) {
                setEditing(toDraft(l));
              } else {
                setViewLoom(l);
              }
            }}
          />
        ))}
        <div className="flex flex-col items-center justify-center rounded-xl bg-card px-4 py-10 text-center" style={{ border: "1.5px dashed var(--border)" }}>
          <Film className="mb-2 h-6 w-6 text-muted-foreground opacity-30" />
          <div className="text-[12px] font-medium text-muted-foreground">Semana {nextWeek}</div>
          <div className="text-[11px] text-muted-foreground">Próximo viernes</div>
          {isAdmin && (
            <Button variant="ghost" size="sm" className="mt-3 gap-1.5" onClick={startCreate}>
              <Plus className="h-3.5 w-3.5" /> Agregar
            </Button>
          )}
        </div>
      </div>

      {/* Side panel: video viewer */}
      <Sheet open={!!viewLoom} onOpenChange={(o) => !o && setViewLoom(null)}>
        <SheetContent
          side="right"
          className="w-full p-0 sm:max-w-none"
          style={{ width: "min(40vw, 720px)" }}
        >
          {viewLoom && (
            <div className="flex h-full flex-col">
              <SheetHeader className="border-b border-border p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground bg-transparent border-[#00001f]/[0.09] text-[#0f0f10] border border-solid font-sans">
                    Semana {viewLoom.semana}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{viewLoom.fecha} · {viewLoom.duracion}</span>
                </div>
                <SheetTitle className="text-left text-[15px]">{viewLoom.titulo}</SheetTitle>
                <SheetDescription className="sr-only">Video Loom de la semana</SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
                  {embed ? (
                    <iframe
                      src={embed}
                      title={viewLoom.titulo}
                      allow="fullscreen"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                      style={{ border: 0 }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[12px] text-white/70">
                      No se pudo incrustar el video. <a className="ml-1 underline" href={viewLoom.linkLoom} target="_blank" rel="noreferrer">Abrir en Loom</a>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Avances de la semana</h3>
                  <ul className="mt-3 space-y-2">
                    {viewLoom.resumen.map((b, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-foreground">
                        <span className="text-primary">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {viewLoom.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {viewLoom.tags.map((t) => (
                        <span key={t} className="rounded-full bg-[var(--border-soft)] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit / create dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing && looms.some((l) => l.id === editing.id) ? "Editar semana" : "Agregar semana"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="semana">Semana</Label>
                  <Input id="semana" type="number" value={editing.semana} onChange={(e) => setEditing({ ...editing, semana: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="duracion">Duración</Label>
                  <Input id="duracion" placeholder="7 min" value={editing.duracion} onChange={(e) => setEditing({ ...editing, duracion: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" placeholder="9 mayo 2026" value={editing.fecha} onChange={(e) => setEditing({ ...editing, fecha: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" value={editing.titulo} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="link">Enlace de Loom</Label>
                <Input id="link" placeholder="https://loom.com/share/..." value={editing.linkLoom} onChange={(e) => setEditing({ ...editing, linkLoom: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tags">Tags (separados por coma)</Label>
                <Input id="tags" placeholder="Diseño Web, SEO" value={editing.tagsText} onChange={(e) => setEditing({ ...editing, tagsText: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="resumen">Viñetas de resumen (una por línea)</Label>
                <Textarea id="resumen" rows={5} value={editing.resumenText} onChange={(e) => setEditing({ ...editing, resumenText: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            <div>
              {editing && looms.some((l) => l.id === editing.id) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => { deleteLoom(editing.id); setEditing(null); }}
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button size="sm" onClick={saveDraft}>Guardar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
