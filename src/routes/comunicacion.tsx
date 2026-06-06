import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/comunicacion")({
  head: () => ({ meta: [{ title: "Comunicación · Media Robots" }, { name: "description", content: "Cómo y cuándo nos comunicamos contigo." }] }),
  component: () => <Outlet />,
});
