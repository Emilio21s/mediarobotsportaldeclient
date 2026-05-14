import { portalData } from "@/data/portalData";

export function Footer() {
  const { cliente } = portalData;
  return (
    <footer className="py-6 text-center text-[11px] text-muted-foreground">
      Media Robots · {cliente.asesor} · {cliente.nombreClinica}
    </footer>
  );
}