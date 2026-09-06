import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useAuth } from "@/hooks/useAuth";

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

type Ctx = {
  invitations: Invitation[];
  createInvitation: (input: { clinicaId: string; clinicaNombre: string; nombre: string; email: string }) => void;
  approveInvitation: (id: string) => void;
  rejectInvitation: (id: string) => void;
  deleteInvitation: (id: string) => void;
  forClinic: (clinicaId: string) => Invitation[];
  pending: Invitation[];
};

const Context = createContext<Ctx | null>(null);

export function InvitationsProvider({ children }: { children: ReactNode }) {
  const { clinicas } = useSession();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ["team_invitations"];

  const { data: invitations = [] } = useQuery({
    queryKey,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_invitations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row): Invitation => ({
        id: row.id,
        clinicaId: row.clinica_id,
        clinicaNombre:
          clinicas.find((c) => c.id === row.clinica_id)?.nombreClinica ?? "",
        nombre: row.nombre,
        email: row.email,
        status: row.status as InvitationStatus,
        createdAt: row.created_at,
        decidedAt: row.status === "pending_approval" ? undefined : row.updated_at,
      }));
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const createMut = useMutation({
    mutationFn: async (input: { clinicaId: string; nombre: string; email: string }) => {
      const { error } = await supabase.from("team_invitations").insert({
        clinica_id: input.clinicaId,
        nombre: input.nombre.trim(),
        email: input.email.trim().toLowerCase(),
        status: "pending_approval",
        invited_by: user?.id ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InvitationStatus }) => {
      const { error } = await supabase.from("team_invitations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_invitations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const value = useMemo<Ctx>(
    () => ({
      invitations,
      createInvitation: ({ clinicaId, nombre, email }) =>
        createMut.mutate({ clinicaId, nombre, email }),
      approveInvitation: (id) => statusMut.mutate({ id, status: "approved" }),
      rejectInvitation: (id) => statusMut.mutate({ id, status: "rejected" }),
      deleteInvitation: (id) => deleteMut.mutate(id),
      forClinic: (clinicaId) => invitations.filter((i) => i.clinicaId === clinicaId),
      pending: invitations.filter((i) => i.status === "pending_approval"),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invitations],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useInvitations() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useInvitations must be used within InvitationsProvider");
  return ctx;
}
