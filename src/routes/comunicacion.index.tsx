import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/comunicacion/")({
  beforeLoad: () => { throw redirect({ to: "/comunicacion/whatsapp" }); },
});