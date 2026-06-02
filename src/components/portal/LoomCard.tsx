import { Play } from "lucide-react";
import type { Loom } from "@/types/portal";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "Diseño Web": { bg: "var(--primary-soft)", text: "var(--primary)" },
  SEO: { bg: "var(--indigo-soft)", text: "var(--indigo)" },
  "SEO Local": { bg: "var(--indigo-soft)", text: "var(--indigo)" },
  "Go High Level": { bg: "var(--amber-soft)", text: "var(--amber)" },
  "Agente IA": { bg: "var(--pink-soft)", text: "var(--pink)" },
};

function tagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { bg: "var(--border-soft)", text: "var(--muted-foreground)" };
}

interface Props {
  loom: Loom;
  expanded: boolean;
  onActivate: () => void;
}

export function LoomCard({ loom, expanded, onActivate }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      className="group cursor-pointer rounded-[10px] bg-card p-[18px] transition-colors"
      style={{
        border: `1.5px solid ${expanded ? "var(--primary)" : "var(--border)"}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          Semana {loom.semana}
        </span>
        <span className="text-[11px] text-muted-foreground">{loom.duracion}</span>
      </div>

      <div className="mt-3 text-[11px] text-muted-foreground">{loom.fecha}</div>
      <h3 className="mt-0.5 text-[13px] font-semibold leading-snug text-foreground">
        {loom.titulo}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {loom.tags.map((tag) => {
          const c = tagStyle(tag);
          return (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: c.bg, color: c.text }}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
        {loom.resumen.map((b, i) => (
          <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-foreground">
            <span className="text-primary">—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-colors"
        style={{
          backgroundColor: expanded ? "var(--primary)" : "var(--background)",
          color: expanded ? "var(--primary-foreground)" : "var(--foreground)",
        }}
      >
        <Play className="h-3 w-3 fill-current" />
        Ver video
      </div>
    </div>
  );
}