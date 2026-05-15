import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Palette, Search, Workflow, Bot, Film, ListChecks, FolderOpen,
  BookMarked, MessageCircle, TrendingUp, Users, ChevronsUpDown, Plus, Send, Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { portalData, getProximoPaso } from "@/data/portalData";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";
import type { ServicioSlug } from "@/types/portal";

const SERVICE_ICONS: Record<ServicioSlug, LucideIcon> = {
  "diseno-web": Palette,
  seo: Search,
  "go-high-level": Workflow,
  "agentes-ia": Bot,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1.5 pt-4 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  right,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  right?: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className="group mx-1.5 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-foreground transition-colors hover:bg-[var(--sidebar-hover)] data-[active=true]:bg-[var(--sidebar-accent)] data-[active=true]:font-medium"
      data-active={isActive}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-data-[active=true]:text-foreground" strokeWidth={1.75} />
      <span className="flex-1 truncate">{label}</span>
      {right}
    </Link>
  );
}

function PlusButton({ onClick }: { onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.(e);
      }}
      className="flex h-5 w-5 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
      aria-label="Añadir"
    >
      <Plus className="h-3 w-3" strokeWidth={2} />
    </button>
  );
}

export function AppSidebar() {
  const { cliente } = portalData;
  const { servicios } = useServiciosContratados();
  const proximo = getProximoPaso();

  return (
    <aside
      className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] md:sticky md:top-0 md:flex"
    >
      {/* Brand */}
      <div className="px-4 pt-4 pb-3">
        <div className="text-[15px] font-bold tracking-tight text-foreground">
          Media Robots
        </div>
      </div>

      {/* Project switcher */}
      <div className="px-3">
        <button className="flex w-full items-center gap-2 rounded-lg border border-[var(--sidebar-border)] bg-card px-2.5 py-2 text-left transition-colors hover:bg-[var(--sidebar-hover)]">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ background: "conic-gradient(from 200deg, #0A7C6A, #5B6AF0, #D97706, #B5426B, #0A7C6A)" }}
            aria-hidden
          />
          <span className="flex-1 truncate text-[12.5px] font-medium text-foreground">
            {cliente.nombreClinica}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Home */}
      <div className="mt-3 px-1.5">
        <NavItem to="/" icon={Home} label="Home" />
      </div>

      {/* Scrollable */}
      <nav className="flex-1 overflow-y-auto pb-2">
        {servicios.length > 0 && (
          <>
            <SectionLabel>Servicios</SectionLabel>
            {servicios.map((s) => {
              const Icon = SERVICE_ICONS[s.slug];
              return (
                <NavItem
                  key={s.slug}
                  to={`/servicios/${s.slug}`}
                  icon={Icon}
                  label={s.nombre}
                />
              );
            })}
          </>
        )}

        <SectionLabel>Actualizaciones semanales</SectionLabel>
        <NavItem to="/actualizaciones" icon={Film} label="Looms" right={<PlusButton />} />

        <SectionLabel>Próximos pasos</SectionLabel>
        <NavItem
          to="/proximos-pasos"
          icon={ListChecks}
          label="Agenda"
          right={
            <span className="rounded-full bg-[var(--sidebar-accent)] px-1.5 py-0.5 text-[9.5px] font-medium text-foreground">
              {proximo?.fecha ?? "—"}
            </span>
          }
        />

        <SectionLabel>Centro de Entregables</SectionLabel>
        <NavItem to="/entregables" icon={FolderOpen} label="Archivos" right={<PlusButton />} />

        <SectionLabel>Recursos importantes</SectionLabel>
        <NavItem to="/recursos" icon={BookMarked} label="Documentos" />

        <SectionLabel>Comunicación</SectionLabel>
        <NavItem to="/comunicacion" icon={MessageCircle} label="Canales" />

        <SectionLabel>Resultados</SectionLabel>
        <NavItem to="/resultados" icon={TrendingUp} label="Métricas" />

        <SectionLabel>Miembros</SectionLabel>
        <NavItem to="/miembros" icon={Users} label="Equipo" />

        <SectionLabel>Administración</SectionLabel>
        <NavItem to="/configuracion" icon={Settings} label="Configuración" />
      </nav>

      {/* Footer card */}
      <div className="p-3">
        <div className="rounded-2xl border border-[var(--sidebar-border)] bg-card p-3">
          <Send className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          <div className="mt-2 text-[12px] font-bold text-foreground">Invite team members</div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Sumá a tu equipo para colaborar y revisar avances.
          </div>
        </div>
      </div>
    </aside>
  );
}
