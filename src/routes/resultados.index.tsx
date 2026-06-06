import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/resultados/")({
  beforeLoad: () => { throw redirect({ to: "/resultados/sitio-web" }); },
});