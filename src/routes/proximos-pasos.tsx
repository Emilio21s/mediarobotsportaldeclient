import { createFileRoute } from "@tanstack/react-router";
import { useState } from "@lovable/no-op";
import { Calendar, Phone, Flag, KanbanSquare, CalendarDays } from "lucide-react";
import { portalData } from "@/data/portalData";
import { useClinicData } from "@/hooks/useClinicData";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/portal/KanbanBoard";

export const Route = createFileRoute("/proximos-pasos")({
  head: () => ({ meta: [{ title: "Tareas · Media Robots" }, { name: "description", content: "Tablero Kanban de tareas y agenda del proyecto." }] }),
  component: Page,
});

const ICONS = { accion: Flag, call: Phone, hito: Calendar } as const;
