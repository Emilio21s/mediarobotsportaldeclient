import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type InvitationStatus = "pending_approval" | "approved" | "rejected";

export interface Invitation {
  id: string;
  clinicaId: string;
  clinicaNombre: string;
  nombre: string;
  email: string;
  status: InvitationStatus;
  createdAt: string;
  decidedAt?: string;
}

const KEY = "mr.invitations.v1";

function load(): Invitation[] {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function save(s: Invitation[]) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ } }

type Ctx = {
  invitations: Invitation[];
  createInvitation: (input: { clinicaId: string; clinicaNombre: string; nombre: string; email: string }) => Invitation;
  approveInvitation: (id: string) => void;
  rejectInvitation: (id: string) => void;
  deleteInvitation: (id: string) => void;
  forClinic: (clinicaId: string) => Invitation[];
  pending: Invitation[];
};

const Context = createContext<Ctx | null>(null);

export function InvitationsProvider({ children }: { children: ReactNode }) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => { setInvitations(load()); }, []);

  const persist = useCallback((next: Invitation[]) => { setInvitations(next); save(next); }, []);

  const value = useMemo<Ctx>(() => ({
    invitations,
    createInvitation: ({ clinicaId, clinicaNombre, nombre, email }) => {
      const inv: Invitation = {
        id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        clinicaId,
        clinicaNombre,
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        status: "pending_approval",
        createdAt: new Date().toISOString(),
      };
      persist([inv, ...invitations]);
      return inv;
    },
    approveInvitation: (id) => persist(invitations.map((i) => i.id === id ? { ...i, status: "approved", decidedAt: new Date().toISOString() } : i)),
    rejectInvitation: (id) => persist(invitations.map((i) => i.id === id ? { ...i, status: "rejected", decidedAt: new Date().toISOString() } : i)),
    deleteInvitation: (id) => persist(invitations.filter((i) => i.id !== id)),
    forClinic: (clinicaId) => invitations.filter((i) => i.clinicaId === clinicaId),
    pending: invitations.filter((i) => i.status === "pending_approval"),
  }), [invitations, persist]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useInvitations() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useInvitations must be used within InvitationsProvider");
  return ctx;
}