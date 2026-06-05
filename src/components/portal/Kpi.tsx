import type { ReactNode } from "react";

type DeltaTone = "positive" | "pending" | "neutral" | "none";

export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "neutral",
}: {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  deltaTone?: DeltaTone;
}) {
  const tone =
    deltaTone === "positive"
      ? { bg: "#ecfdf5", fg: "#047857" }
      : deltaTone === "pending"
      ? { bg: "#fef3c7", fg: "#92400e" }
      : { bg: "#f3f4f6", fg: "#6b7280" };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-neutral-900">
        {value}
      </div>
      {delta && deltaTone !== "none" && (
        <div className="mt-3">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: tone.bg, color: tone.fg }}
          >
            {delta}
          </span>
        </div>
      )}
    </div>
  );
}

export function ViewHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </div>
      )}
      <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">{title}</h1>
      {subtitle && <p className="mt-2 text-[13px] text-neutral-600">{subtitle}</p>}
    </div>
  );
}