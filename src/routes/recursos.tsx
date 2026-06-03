import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookMarked, Link2, KeyRound, FileText, Plus, Palette, Brain, Scale, Trash2, Pencil,
  Image as ImageIcon, FileSpreadsheet, FileSignature,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSession } from "@/hooks/useSession";
import { useRecursosOverrides } from "@/hooks/useRecursosOverrides";
import type { Recurso, RecursoCategoria } from "@/types/portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIAS: { value: RecursoCategoria; label: string; icon: LucideIcon }[] = [
  { value: "accesos", label: "Accesos y Credenciales", icon: KeyRound },
  { value: "identidad", label: "Identidad y Marca", icon: Palette },
  { value: "estrategia", label: "Estrategia (SEO/IA)", icon: Brain },
  { value: "legal", label: "Legal y Finanzas", icon: Scale },
];

function inferCategoria(r: Recurso): RecursoCategoria {
  if (r.categoria) return r.categoria;
  if (r.tipo === "credenciales") return "accesos";
  const t = (r.titulo + " " + r.descripcion).toLowerCase();
  if (/(marca|logo|brand|identidad|tipograf)/.test(t)) return "identidad";
  if (/(seo|ia|estrategia|agente|guion|prompt)/.test(t)) return "estrategia";
  if (/(contrato|factura|legal|finanza|pago)/.test(t)) return "legal";
  return "accesos";
}

function iconFor(r: Recurso): LucideIcon {
  const cat = inferCategoria(r);
  if (r.tipo === "credenciales") return KeyRound;
  if (r.tipo === "link") return Link2;
  if (cat === "identidad") return ImageIcon;
  if (cat === "legal") return FileSignature;
  if (cat === "estrategia") return Brain;
  const ext = r.link.split(".").pop()?.toLowerCase();
  if (ext === "xls" || ext === "xlsx" || ext === "csv") return FileSpreadsheet;
  if (ext === "pdf" || ext === "doc" || ext === "docx") return FileText;
  return BookMarked;
}

export const Route = createFileRoute("/recursos")({
  head: () => ({ meta: [{ title: "Recursos importantes · Media Robots" }, { name: "description", content: "Documentos, accesos y credenciales clave del proyecto." }] }),
  component: Page,
});

function Page() {
  const { role, activeClinic } = useSession();
  const { getRecursos, upsertRecurso, deleteRecurso, nextId } = useRecursosOverrides();
  const isAdmin = role === "Agency_Admin";
  const recursos = getRecursos();
  const [filter, setFilter] = useState<"all" | RecursoCategoria>("all");
  const [editing, setEditing] = useState<Recurso | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => filter === "all" ? recursos : recursos.filter((r) => inferCategoria(r) === filter),
    [recursos, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: recursos.length };
    CATEGORIAS.forEach((cat) => { c[cat.value] = 0; });
    recursos.forEach((r) => { c[inferCategoria(r)]++; });
    return c;
  }, [recursos]);

  const openCreate = () => {
    setEditing({
      id: nextId(), clinicaId: activeClinic.id, titulo: "", descripcion: "",
      tipo: "link", link: "", categoria: "accesos",
    });
    setOpen(true);
  };
  const openEdit = (r: Recurso) => {
    setEditing({ ...r, categoria: inferCategoria(r) });
    setOpen(true);
  };
  const handleSave = () => {
    if (!editing) return;
    if (!editing.titulo.trim() || !editing.link.trim()) {
      toast.error("Título y URL/archivo son obligatorios");
      return;
    }
    upsertRecurso(editing);
    setOpen(false);
    setEditing(null);
    toast.success("Recurso guardado");
  };
  const handleDelete = (r: Recurso) => {
    if (!confirm(`¿Eliminar "${r.titulo}"?`)) return;
    deleteRecurso(r.id);
    toast.success("Recurso eliminado");
  };

  return (
    <>
      <PageHeader eyebrow="Documentación" title="Recursos importantes" description="Accesos, brief, manual de marca y credenciales compartidas." />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`Todos (${counts.all})`} />
        {CATEGORIAS.map((c) => (
          <FilterChip
            key={c.value}
            active={filter === c.value}
            onClick={() => setFilter(c.value)}
            label={`${c.label} (${counts[c.value] ?? 0})`}
            Icon={c.icon}
          />
        ))}
        {isAdmin && (
          <Button size="sm" onClick={openCreate} className="ml-auto gap-1.5">
            <Plus className="h-4 w-4" /> Agregar recurso
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-center text-[12.5px] text-muted-foreground">
          {recursos.length === 0 ? "Sin recursos cargados todavía." : "No hay recursos en esta categoría."}
        </p>
      ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((r) => {
          const Icon = iconFor(r);
          const cat = CATEGORIAS.find((c) => c.value === inferCategoria(r));
          return (
            <div key={r.id} className="group relative flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-[var(--sidebar-hover)]">
              <a
                href={r.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 rounded-xl"
                aria-label={r.titulo}
              />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-foreground">{r.titulo}</div>
                <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted-foreground">{r.descripcion}</div>
                {cat && <div className="mt-1.5 text-[10.5px] uppercase tracking-wide text-muted-foreground">{cat.label}</div>}
              </div>
              {isAdmin && (
                <div className="relative z-10 flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={(e) => { e.preventDefault(); openEdit(r); }} className="rounded p-1 hover:bg-accent" aria-label="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); handleDelete(r); }} className="rounded p-1 text-destructive hover:bg-accent" aria-label="Eliminar">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing && recursos.some((r) => r.id === editing.id) ? "Editar recurso" : "Agregar recurso"}</DialogTitle>
            <DialogDescription>Comparte enlaces, documentos o credenciales con el cliente.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="r-titulo">Título</Label>
                <Input id="r-titulo" value={editing.titulo} onChange={(e) => setEditing({ ...editing, titulo: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="r-desc">Descripción corta</Label>
                <Textarea id="r-desc" rows={2} value={editing.descripcion} onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Categoría</Label>
                  <Select value={editing.categoria ?? "accesos"} onValueChange={(v) => setEditing({ ...editing, categoria: v as RecursoCategoria })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Tipo</Label>
                  <Select value={editing.tipo} onValueChange={(v) => setEditing({ ...editing, tipo: v as Recurso["tipo"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Enlace externo</SelectItem>
                      <SelectItem value="doc">Archivo / Documento</SelectItem>
                      <SelectItem value="credenciales">Credenciales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="r-link">{editing.tipo === "doc" ? "URL del archivo" : "URL"}</Label>
                <Input id="r-link" placeholder="https://..." value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} />
                {editing.tipo === "doc" && (
                  <Input
                    type="file"
                    className="text-xs"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setEditing({ ...editing, link: URL.createObjectURL(f), titulo: editing.titulo || f.name });
                    }}
                  />
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterChip({ active, onClick, label, Icon }: { active: boolean; onClick: () => void; label: string; Icon?: LucideIcon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
        active
          ? "border-primary bg-[var(--primary-soft)] text-primary"
          : "border-border bg-card text-muted-foreground hover:bg-[var(--sidebar-hover)]"
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
