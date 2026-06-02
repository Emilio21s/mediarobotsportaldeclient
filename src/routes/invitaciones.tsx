import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Lock, Mail, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSession } from "@/hooks/useSession";
import { useInvitations, type InvitationStatus } from "@/hooks/useInvitations";

export const Route = createFileRoute("/invitaciones")({
  head: () => ({
    meta: [
      { title: "Invitaciones · Media Robots" },
      { name: "description", content: "Aprobá miembros invitados por los clientes." },
    ],
  }),
  component: InvitationsPage,
});

const STATUS_META: Record<InvitationStatus, { label: string; color: string; Icon: typeof Clock }> = {
  pending_approval: { label: "Pendiente", color: "text-amber-600", Icon: Clock },
  approved: { label: "Aprobado", color: "text-emerald-600", Icon: CheckCircle2 },
  rejected: { label: "Rechazado", color: "text-rose-600", Icon: XCircle },
};

function InvitationsPage() {
  const { role } = useSession();
  const { invitations, approveInvitation, rejectInvitation, deleteInvitation, pending } = useInvitations();

  if (role !== "Agency_Admin") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
        <h2 className="mt-3 text-[15px] font-semibold text-foreground">Acceso restringido</h2>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Solo el equipo de Media Robots puede aprobar invitaciones.
        </p>
      </div>
    );
  }

  const sorted = [...invitations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <PageHeader
        eyebrow="Panel admin"
        title="Invitaciones de equipo"
        description="Revisá y aprobá los miembros que los clientes invitaron a sus portales. Solo los aprobados podrán acceder."
        right={
          <span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11.5px] text-muted-foreground">
            {pending.length} pendiente{pending.length === 1 ? "" : "s"}
          </span>
        }
      />

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <Mail className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-3 text-[13px] text-muted-foreground">No hay invitaciones todavía.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((inv) => {
            const meta = STATUS_META[inv.status];
            return (
              <li
                key={inv.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sidebar-accent)] text-[12px] font-semibold text-foreground">
                  {inv.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-foreground">{inv.nombre}</div>
                  <div className="truncate text-[11.5px] text-muted-foreground">
                    {inv.email} · {inv.clinicaNombre}
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-[11.5px] font-medium ${meta.color}`}>
                  <meta.Icon className="h-3.5 w-3.5" /> {meta.label}
                </span>
                {inv.status === "pending_approval" ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => approveInvitation(inv.id)}
                      className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Aprobar
                    </button>
                    <button
                      onClick={() => rejectInvitation(inv.id)}
                      className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-[12px] font-medium text-foreground transition-colors hover:bg-[var(--sidebar-hover)]"
                    >
                      <X className="h-3.5 w-3.5" /> Rechazar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => deleteInvitation(inv.id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-[var(--sidebar-hover)] hover:text-foreground"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}