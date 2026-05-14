import { portalData } from "@/data/portalData";

export function NextSteps() {
  const { proximosPasos } = portalData;
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[13px] font-semibold text-foreground">
          <span aria-hidden>📅</span> Próximos pasos
        </h2>
        <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Esta semana
        </span>
      </div>
      <ul className="divide-y divide-border">
        {proximosPasos.map((p) => (
          <li key={p.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
            <span className="min-w-[56px] shrink-0 text-[11px] font-semibold text-primary">
              {p.fecha}
            </span>
            <span className="text-[13px] leading-relaxed text-foreground">{p.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}