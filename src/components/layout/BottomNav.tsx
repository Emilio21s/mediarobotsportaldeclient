import { Link, useRouterState } from "@tanstack/react-router";
import { Home, FolderOpen, MessageCircle, Film, LayoutGrid, ListChecks } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "@/hooks/useSession";

const adminItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/actualizaciones", icon: Film, label: "Looms" },
  { to: "/entregables", icon: FolderOpen, label: "Archivos" },
  { to: "/comunicacion", icon: MessageCircle, label: "Chat" },
  { to: "/miembros", icon: LayoutGrid, label: "Más" },
];

const clientItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/proximos-pasos", icon: ListChecks, label: "Tareas" },
  { to: "/entregables", icon: FolderOpen, label: "Archivos" },
  { to: "/comunicacion", icon: MessageCircle, label: "Chat" },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { role } = useSession();
  const items = role === "Agency_Admin" ? adminItems : clientItems;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sidebar-border)] bg-[var(--sidebar)] backdrop-blur md:hidden">
      <ul className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)] pt-1.5">
        {items.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] text-muted-foreground transition-colors data-[active=true]:text-foreground"
                data-active={active}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
