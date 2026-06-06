import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/resultados")({
  head: () => ({ meta: [{ title: "Resultados · Media Robots" }, { name: "description", content: "Métricas y resultados de cada servicio." }] }),
  component: () => <Outlet />,
});
