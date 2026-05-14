import { portalData } from "@/data/portalData";

export function Navbar() {
  const { cliente } = portalData;
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] bg-primary text-[11px] font-bold text-primary-foreground">
            MR
          </div>
          <div className="leading-tight">
            <div className="text-[12px] font-semibold text-foreground">Media Robots</div>
            <div className="text-[10px] text-muted-foreground">Portal de cliente</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            {cliente.nombreClinica}
          </span>
          <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-primary">
            Paquete {cliente.paquete}
          </span>
        </div>
      </div>
    </header>
  );
}