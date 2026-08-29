import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Clinica, Role, ServicioSlug } from "@/types/portal";

const CLINIC_KEY = "mr.activeClinicId";

const PLACEHOLDER: Clinica = {
  id: "",
  nombreClinica: "Cargando…",
  nombreDoctor: "",
  paquete: "Pro",
  fechaInicio: "",
  asesor: "",
  whatsappLink: "",
  diasActivo: 0,
  serviciosContratados: [],
  color: "#0A7C6A",
  iniciales: "—",
};

type ClinicaRow = {
  id: string;
  nombre_clinica: string;
  nombre_doctor: string;
  paquete: string;
  fecha_inicio: string;
  asesor: string;
  whatsapp_link: string;
  servicios_contratados: ServicioSlug[];
  color: string;
  iniciales: string;
};

function mapClinica(row: ClinicaRow): Clinica {
  const inicio = new Date(row.fecha_inicio);
  const dias = Math.max(
    0,
    Math.round((Date.now() - inicio.getTime()) / 86400000),
  );
  return {
    id: row.id,
    nombreClinica: row.nombre_clinica,
    nombreDoctor: row.nombre_doctor,
    paquete: (row.paquete as Clinica["paquete"]) ?? "Pro",
    fechaInicio: inicio.toLocaleDateString("es-GT", { day: "numeric", month: "long", year: "numeric" }),
    asesor: row.asesor,
    whatsappLink: row.whatsapp_link,
    diasActivo: dias,
    serviciosContratados: row.servicios_contratados ?? [],
    color: row.color,
    iniciales: row.iniciales,
  };
}

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  clinicas: Clinica[];
  activeClinic: Clinica;
  setActiveClinicId: (id: string) => void;
  loading: boolean;
};

const Context = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { dbRole, clinicaId: myClinicaId, session } = useAuth();
  const [previewClient, setPreviewClient] = useState(false);
  const [activeClinicId, setActiveClinicIdState] = useState<string>("");

  const { data: clinicas = [], isLoading } = useQuery({
    queryKey: ["clinicas", session?.user.id ?? null],
    enabled: !!session,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinicas")
        .select("id, nombre_clinica, nombre_doctor, paquete, fecha_inicio, asesor, whatsapp_link, servicios_contratados, color, iniciales")
        .order("nombre_clinica");
      if (error) throw error;
      return (data as ClinicaRow[]).map(mapClinica);
    },
  });

  const isAgency = dbRole === "agency_admin" && !previewClient;
  const role: Role = isAgency ? "Agency_Admin" : "Client_User";

  useEffect(() => {
    if (!clinicas.length) return;
    if (dbRole === "client_user" && myClinicaId) {
      setActiveClinicIdState(myClinicaId);
      return;
    }
    if (activeClinicId && clinicas.some((c) => c.id === activeClinicId)) return;
    let stored = "";
    try { stored = localStorage.getItem(CLINIC_KEY) ?? ""; } catch { /* noop */ }
    const next = clinicas.find((c) => c.id === stored)?.id ?? clinicas[0].id;
    setActiveClinicIdState(next);
  }, [clinicas, dbRole, myClinicaId, activeClinicId]);

  const setActiveClinicId = (id: string) => {
    setActiveClinicIdState(id);
    try { localStorage.setItem(CLINIC_KEY, id); } catch { /* noop */ }
  };

  const setRole = (r: Role) => setPreviewClient(r === "Client_User");

  const activeClinic = clinicas.find((c) => c.id === activeClinicId) ?? clinicas[0] ?? PLACEHOLDER;

  return (
    <Context.Provider
      value={{ role, setRole, clinicas, activeClinic, setActiveClinicId, loading: isLoading }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSession() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
