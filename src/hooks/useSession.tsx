import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { portalData } from "@/data/portalData";
import type { Clinica, Role } from "@/types/portal";

const ROLE_KEY = "mr.role";
const CLINIC_KEY = "mr.activeClinicId";

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  clinicas: Clinica[];
  activeClinic: Clinica;
  setActiveClinicId: (id: string) => void;
};

const Context = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const clinicas = portalData.clinicas;
  const [role, setRoleState] = useState<Role>("Agency_Admin");
  const [activeClinicId, setActiveClinicIdState] = useState<string>(clinicas[0].id);

  useEffect(() => {
    try {
      const r = localStorage.getItem(ROLE_KEY);
      if (r === "Agency_Admin" || r === "Client_User") setRoleState(r);
      const c = localStorage.getItem(CLINIC_KEY);
      if (c && clinicas.some((cl) => cl.id === c)) setActiveClinicIdState(c);
    } catch { /* noop */ }
  }, [clinicas]);

  const setRole = (r: Role) => {
    setRoleState(r);
    try { localStorage.setItem(ROLE_KEY, r); } catch { /* noop */ }
  };
  const setActiveClinicId = (id: string) => {
    setActiveClinicIdState(id);
    try { localStorage.setItem(CLINIC_KEY, id); } catch { /* noop */ }
  };

  const activeClinic = clinicas.find((c) => c.id === activeClinicId) ?? clinicas[0];

  return (
    <Context.Provider value={{ role, setRole, clinicas, activeClinic, setActiveClinicId }}>
      {children}
    </Context.Provider>
  );
}

export function useSession() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
