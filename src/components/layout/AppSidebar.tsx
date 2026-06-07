import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Palette, Search, Workflow, Bot, Film, ListChecks, FolderOpen,
  BookMarked, MessageCircle, TrendingUp, Users, ChevronsUpDown, Plus, Send, Settings,
  Check, Shield, User as UserIcon, Mail, Smartphone, Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useServiciosContratados } from "@/hooks/useServiciosContratados";
import { useSession } from "@/hooks/useSession";
import { useClinicData } from "@/hooks/useClinicData";
import { useInvitations } from "@/hooks/useInvitations";
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
  to, icon: Icon, label, right,
}: { to: string; icon: LucideIcon; label: string; right?: React.ReactNode }) {
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

function PlusButton() {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      className="flex h-5 w-5 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
      aria-label="Añadir"
    >
      <Plus className="h-3 w-3" strokeWidth={2} />
    </button>
  );
}

function ClinicAvatar({ color, iniciales, size = 16 }: { color: string; iniciales: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
      style={{ width: size, height: size, backgroundColor: color }}
      aria-hidden
    >
      {iniciales.slice(0, 2)}
    </span>
  );
}

export function AppSidebar() {
  const { role, setRole, clinicas, activeClinic, setActiveClinicId } = useSession();
  const { servicios } = useServiciosContratados();
  const { proximosPasos } = useClinicData();
  const { pending } = useInvitations();
  const proximo = [...proximosPasos].sort((a, b) => a.fechaIso.localeCompare(b.fechaIso))[0];
  const isAdmin = role === "Agency_Admin";

  return (
    <aside className="hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] md:sticky md:top-0 md:flex">
      {/* Brand */}
      <div className="px-4 pt-4 pb-3">
        <div className="text-[15px] font-bold tracking-tight text-foreground">
          {isAdmin ? "Media Robots" : activeClinic.nombreClinica}
        </div>
        {!isAdmin && (
          <div className="mt-0.5 text-[11px] text-muted-foreground">Portal del cliente</div>
        )}
      </div>

      {/* Clinic switcher (admin) or static (client) */}
      <div className="px-3">
        {isAdmin ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg border border-[var(--sidebar-border)] bg-card px-2.5 py-2 text-left transition-colors hover:bg-[var(--sidebar-hover)]">
                <ClinicAvatar color={activeClinic.color} iniciales={activeClinic.iniciales} />
                <span className="flex-1 truncate text-[12.5px] font-medium text-foreground">
                  {activeClinic.nombreClinica}
                </span>
                <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[244px]">
              <DropdownMenuLabel className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
                Clínicas
              </DropdownMenuLabel>
              {clinicas.map((c) => {
                const active = c.id === activeClinic.id;
                return (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setActiveClinicId(c.id)}
                    className="gap-2"
                  >
                    <ClinicAvatar color={c.color} iniciales={c.iniciales} />
                    <span className="flex-1 truncate text-[12.5px]">{c.nombreClinica}</span>
                    {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-[12px] text-muted-foreground">
                <Plus className="h-3.5 w-3.5" /> Añadir clínica
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex w-full items-center gap-2 rounded-lg border border-[var(--sidebar-border)] bg-card px-2.5 py-2">
            <ClinicAvatar color={activeClinic.color} iniciales={activeClinic.iniciales} />
            <span className="flex-1 truncate text-[12.5px] font-medium text-foreground">
              {activeClinic.nombreClinica}
            </span>
          </div>
        )}
      </div>

      {/* Home */}
      <div className="mt-3 px-1.5">
        <NavItem to="/" icon={Home} label="Home" />
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto pb-2">
        {servicios.length > 0 && (
          <>
            <SectionLabel>Servicios</SectionLabel>
            {servicios.map((s) => (
              <NavItem
                key={s.slug}
                to={`/servicios/${s.slug}`}
                icon={SERVICE_ICONS[s.slug]}
                label={s.nombre}
              />
            ))}
          </>
        )}

        <SectionLabel>Actualizaciones semanales</SectionLabel>
        <NavItem to="/actualizaciones" icon={Film} label="Looms" right={isAdmin ? <PlusButton /> : undefined} />

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
        <NavItem to="/entregables" icon={FolderOpen} label="Archivos" right={isAdmin ? <PlusButton /> : undefined} />

        <SectionLabel>Recursos importantes</SectionLabel>
        <NavItem to="/recursos" icon={BookMarked} label="Documentos" />

        <SectionLabel>Comunicación</SectionLabel>
        <div className="space-y-0.5 pl-3 px-0">
          <NavItem to="/comunicacion/whatsapp" icon={Smartphone} label="WhatsApp" />
          <NavItem to="/comunicacion/agendar" icon={Calendar} label="Agendar reunión" />
          <NavItem to="/comunicacion/email" icon={Mail} label="Email" />
        </div>

        <SectionLabel>Resultados</SectionLabel>
        <div className="space-y-0.5 pl-3 px-0">
          <NavItem to="/resultados/sitio-web" icon={Palette} label="Sitio web" />
          <NavItem to="/resultados/seo-gmb" icon={Search} label="SEO y GMB" />
          <NavItem to="/resultados/go-high-level" icon={Workflow} label="Go High Level" />
          <NavItem to="/resultados/agentes-ia" icon={Bot} label="Agentes de IA" />
        </div>

        <SectionLabel>Miembros</SectionLabel>
        <NavItem to="/miembros" icon={Users} label="Equipo" />

        {isAdmin && (
          <>
            <SectionLabel>Administración</SectionLabel>
            <NavItem
              to="/invitaciones"
              icon={Mail}
              label="Invitaciones"
              right={
                pending.length > 0 ? (
                  <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9.5px] font-semibold text-white">
                    {pending.length}
                  </span>
                ) : undefined
              }
            />
            <NavItem to="/configuracion" icon={Settings} label="Configuración" />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="space-y-2 p-3">
        <InviteTeamCard />

        {/* Demo role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md border border-[var(--sidebar-border)] bg-card px-2.5 py-1.5 text-left text-[11.5px] text-muted-foreground transition-colors hover:bg-[var(--sidebar-hover)]">
              {isAdmin ? <Shield className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
              <span className="flex-1 truncate">
                Vista: <span className="font-semibold text-foreground">{isAdmin ? "Admin" : "Cliente"}</span>
              </span>
              <ChevronsUpDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[230px]">
            <DropdownMenuLabel className="text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
              Cambiar rol (demo)
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setRole("Agency_Admin")} className="gap-2">
              <Shield className="h-3.5 w-3.5" />
              <span className="flex-1">Agency Admin</span>
              {isAdmin && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Client_User")} className="gap-2">
              <UserIcon className="h-3.5 w-3.5" />
              <span className="flex-1">Client User</span>
              {!isAdmin && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function InviteTeamCard() {
  const { role, activeClinic } = useSession();
  const { createInvitation, forClinic, pending } = useInvitations();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const isAdmin = role === "Agency_Admin";
  const clinicInvites = forClinic(activeClinic.id);
  const clinicPending = clinicInvites.filter((i) => i.status === "pending_approval").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nombre.trim();
    const m = email.trim();
    if (!n || n.length > 100) { toast.error("Ingresá un nombre válido"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) || m.length > 255) { toast.error("Email inválido"); return; }
    createInvitation({
      clinicaId: activeClinic.id,
      clinicaNombre: activeClinic.nombreClinica,
      nombre: n,
      email: m,
    });
    toast.success("Invitación enviada. Pendiente de aprobación.");
    setNombre(""); setEmail(""); setOpen(false);
  };

  if (isAdmin) {
    return (
      <Link
        to="/invitaciones"
        className="block rounded-2xl border border-[var(--sidebar-border)] bg-card p-3 transition-colors hover:bg-[var(--sidebar-hover)]"
      >
        <Mail className="h-4 w-4 text-foreground" strokeWidth={1.75} />
        <div className="mt-2 flex items-center gap-2">
          <div className="text-[12px] font-bold text-foreground">Invitaciones</div>
          {pending.length > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9.5px] font-semibold text-white">
              {pending.length}
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          {pending.length > 0
            ? `${pending.length} miembro${pending.length === 1 ? "" : "s"} pendiente${pending.length === 1 ? "" : "s"} de aprobar.`
            : "No hay invitaciones pendientes."}
        </div>
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="block w-full rounded-2xl border border-[var(--sidebar-border)] bg-card p-3 text-left transition-colors hover:bg-[var(--sidebar-hover)]">
          <Send className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          <div className="mt-2 flex items-center gap-2">
            <div className="text-[12px] font-bold text-foreground">Invite team members</div>
            {clinicPending > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9.5px] font-semibold text-white">
                {clinicPending}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Sumá a tu equipo. Media Robots debe aprobar cada invitación.
          </div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar a un miembro de tu equipo</DialogTitle>
          <DialogDescription>
            Enviá la solicitud. El equipo de Media Robots la revisará y aprobará el acceso al portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="inv-nombre">Nombre</Label>
            <Input id="inv-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} placeholder="Ej: Ana López" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="inv-email">Email</Label>
            <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="ana@clinica.com" />
          </div>

          {clinicInvites.length > 0 && (
            <div className="rounded-md border border-border bg-[var(--sidebar)] p-2">
              <div className="mb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
                Invitaciones de {activeClinic.nombreClinica}
              </div>
              <ul className="space-y-1">
                {clinicInvites.slice(0, 5).map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="truncate text-foreground">{i.nombre} <span className="text-muted-foreground">· {i.email}</span></span>
                    <span
                      className={
                        i.status === "approved" ? "text-emerald-600"
                        : i.status === "rejected" ? "text-rose-600"
                        : "text-amber-600"
                      }
                    >
                      {i.status === "approved" ? "Aprobado" : i.status === "rejected" ? "Rechazado" : "Pendiente"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border bg-card px-3 py-1.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-[var(--sidebar-hover)]">
              Cancelar
            </button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Enviar invitación
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
