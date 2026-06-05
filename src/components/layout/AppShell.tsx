import { Outlet, Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  MessageCircle,
  CalendarDays,
  Mail,
  Globe,
  Search,
  Workflow,
  Bot,
  Users,
  FileText,
} from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon: LucideIcon;
  dot?: "green" | "amber";
};

type Section = { label: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    label: "General",
    items: [{ to: "/", label: "Inicio", icon: Home }],
  },
  {
    label: "Comunicación",
    items: [
      { to: "/whatsapp", label: "WhatsApp", icon: MessageCircle, dot: "green" },
      { to: "/agendar", label: "Agendar reunión", icon: CalendarDays },
      { to: "/email", label: "Email", icon: Mail },
    ],
  },
  {
    label: "Resultados",
    items: [
      { to: "/sitio-web", label: "Sitio web", icon: Globe },
      { to: "/seo-gmb", label: "SEO y GMB", icon: Search },
      { to: "/ghl", label: "Go High Level", icon: Workflow, dot: "amber" },
      { to: "/agentes-ia", label: "Agentes de IA", icon: Bot },
    ],
  },
  {
    label: "Admin",
    items: [
      { to: "/equipo", label: "Equipo", icon: Users },
      { to: "/documentos", label: "Documentos", icon: FileText },
    ],
  },
];

function NavLink({ item }: { item: Item }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === item.to;
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      data-active={isActive}
      className="group mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100 data-[active=true]:bg-[#e8f5f0] data-[active=true]:text-[#1a7a5e] data-[active=true]:font-medium"
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: item.dot === "green" ? "#22c55e" : "#f59e0b" }}
          aria-hidden
        />
      )}
    </Link>
  );
}

function Sidebar() {
  return (
    <aside className="hidden h-screen w-[220px] shrink-0 flex-col border-r border-neutral-200 bg-white md:sticky md:top-0 md:flex">
      <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a7a5e] text-[11px] font-semibold text-white">
          CG
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-neutral-900">Clínica Dental García</div>
          <div className="text-[11px] text-neutral-500">Plan Pro · Activo</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mt-4 first:mt-2">
            <div className="px-4 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-neutral-400">
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-neutral-200 px-4 py-3">
        <div className="text-[11px] font-medium text-neutral-700">Emilio Sandoval</div>
        <div className="text-[10.5px] text-neutral-500">emilio@mediarobots.me</div>
      </div>
    </aside>
  );
}

export function AppShell() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50">
      <Sidebar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10 sm:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}