import { createFileRoute } from "@tanstack/react-router";
import { ViewHeader } from "@/components/portal/Kpi";

export const Route = createFileRoute("/equipo")({
  head: () => ({ meta: [{ title: "Equipo · Media Robots" }] }),
  component: Page,
});

const team = [
  { name: "Emilio Sandoval", role: "Asesor principal", email: "emilio@mediarobots.me", initials: "ES" },
  { name: "Equipo Media Robots", role: "Diseño, SEO y desarrollo", email: "team@mediarobots.com", initials: "MR" },
];

function Page() {
  return (
    <>
      <ViewHeader eyebrow="Admin" title="Equipo" subtitle="Las personas asignadas a tu cuenta." />
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <ul className="divide-y divide-neutral-200">
          {team.map((m) => (
            <li key={m.email} className="flex items-center gap-3 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-700">
                {m.initials}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-neutral-900">{m.name}</div>
                <div className="text-[12px] text-neutral-500">{m.role}</div>
              </div>
              <a href={`mailto:${m.email}`} className="text-[12px] font-medium text-[#1a7a5e]">
                {m.email}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}