import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión · Media Robots" },
      { name: "description", content: "Ingresa a tu portal de Media Robots." },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Por favor completa todos los campos");
      return;
    }
    setError("");
    try { localStorage.setItem("mr.session", "1"); } catch { /* noop */ }
    navigate({ to: "/" });
  };

  const handleGoogle = () => {
    try { localStorage.setItem("mr.session", "1"); } catch { /* noop */ }
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left column */}
      <div className="relative flex w-full flex-col bg-white px-6 py-6 md:w-1/2 md:px-12">
        <div className="text-[15px] font-bold tracking-tight text-foreground">Media Robots</div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[360px]">
            <h1 className="text-[22px] font-medium text-foreground">Bienvenido</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">Ingresa a tu portal</p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[12.5px] font-medium text-foreground">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#e0ddd6] bg-white px-3.5 py-2.5 text-[13px] text-foreground outline-none transition-colors focus:border-[#1a7a5e]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[12.5px] font-medium text-foreground">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#e0ddd6] bg-white px-3.5 py-2.5 pr-10 text-[13px] text-foreground outline-none transition-colors focus:border-[#1a7a5e]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-[12px] text-rose-600">{error}</div>
              )}

              <button
                type="submit"
                className="h-[42px] w-full rounded-lg bg-[#1a7a5e] text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Ingresar
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e0ddd6]" />
              <span className="text-[12px] text-muted-foreground">o</span>
              <div className="h-px flex-1 bg-[#e0ddd6]" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex h-[42px] w-full items-center justify-center gap-2.5 rounded-lg border border-[#e0ddd6] bg-white text-[13px] font-medium text-foreground transition-colors hover:bg-[#faf9f6]"
            >
              <GoogleIcon />
              Continuar con Google
            </button>

            <div className="mt-5 text-center">
              <a href="#" className="text-[12px] text-[#1a7a5e] hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center bg-[#0f2d24] px-12">
        <div className="max-w-[280px]">
          <h2 className="text-[24px] font-medium leading-tight text-white">
            Tu proyecto, en tiempo real.
          </h2>
          <ul className="mt-6 space-y-2.5 text-[13px] text-white/70">
            <li>· Avances semanales en video</li>
            <li>· Métricas de negocio reales</li>
            <li>· Comunicación directa con tu equipo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}