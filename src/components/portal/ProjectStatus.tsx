import { useEffect, useState } from "react";
import { portalData } from "@/data/portalData";

export function ProjectStatus() {
  const { servicios } = portalData;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 text-[13px] font-semibold text-foreground">
        <span aria-hidden>📊</span> Estado del proyecto
      </h2>
      <ul className="divide-y divide-border">
        {servicios.map((s) => (
          <li key={s.nombre} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium text-foreground">{s.nombre}</span>
                <span className="ml-2 text-[11px] text-muted-foreground">{s.fase}</span>
              </div>
              <span
                className="text-[12px] font-semibold tabular-nums"
                style={{ color: s.avance === 0 ? "var(--muted-foreground)" : s.color }}
              >
                {s.avance}%
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--border-soft)]">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out bg-[#19191a]"
                style={{
                  width: mounted ? `${s.avance}%` : "0%",
                  backgroundColor: s.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}