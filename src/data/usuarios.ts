import type { Role } from "@/types/portal";

export type Usuario = {
  email: string;
  password: string;
  nombre: string;
  role: Role;
};

/** Usuarios demo del portal (autenticación simulada en el cliente). */
export const usuarios: Usuario[] = [
  {
    email: "admin@mediarobots.me",
    password: "MediaRobots2026!",
    nombre: "Emilio Sandoval",
    role: "Agency_Admin",
  },
  {
    email: "cliente@clinicagarcia.com",
    password: "Cliente2026!",
    nombre: "Dr. Carlos García",
    role: "Client_User",
  },
];

export function autenticar(email: string, password: string): Usuario | null {
  const e = email.trim().toLowerCase();
  return usuarios.find((u) => u.email === e && u.password === password) ?? null;
}
