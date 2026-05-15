import { portalData } from "@/data/portalData";
import { useSession } from "@/hooks/useSession";

/**
 * Returns all portal collections filtered by the active clinic.
 * Always use this instead of reading portalData.* directly in views.
 */
export function useClinicData() {
  const { activeClinic } = useSession();
  const id = activeClinic.id;
  return {
    clinicaId: id,
    looms: portalData.looms.filter((l) => l.clinicaId === id),
    proximosPasos: portalData.proximosPasos.filter((p) => p.clinicaId === id),
    entregables: portalData.entregables.filter((e) => e.clinicaId === id),
    recursos: portalData.recursos.filter((r) => r.clinicaId === id),
    resultados: portalData.resultados.filter((m) => m.clinicaId === id),
    miembros: portalData.miembros.filter((m) => m.clinicaId === id),
  };
}
