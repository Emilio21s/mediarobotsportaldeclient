import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbRole = "agency_admin" | "client_user";

type Ctx = {
  session: Session | null;
  user: User | null;
  dbRole: DbRole | null;
  clinicaId: string | null;
  nombre: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Context = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [dbRole, setDbRole] = useState<DbRole | null>(null);
  const [clinicaId, setClinicaId] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProfile = async (userId: string) => {
      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("profiles").select("clinica_id, nombre").eq("id", userId).maybeSingle(),
      ]);
      if (!active) return;
      const isAgency = (roles ?? []).some((r) => r.role === "agency_admin");
      setDbRole(isAgency ? "agency_admin" : "client_user");
      setClinicaId(profile?.clinica_id ?? null);
      setNombre(profile?.nombre ?? null);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      setSession(next);
      if (next?.user) {
        setTimeout(() => void loadProfile(next.user.id), 0);
      } else {
        setDbRole(null);
        setClinicaId(null);
        setNombre(null);
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        void queryClient.invalidateQueries();
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) await loadProfile(data.session.user.id);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [queryClient]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
  };

  return (
    <Context.Provider
      value={{ session, user: session?.user ?? null, dbRole, clinicaId, nombre, loading, signOut }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
