import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";
import { ServiciosContratadosProvider } from "@/hooks/useServiciosContratados";
import { SessionProvider } from "@/hooks/useSession";
import { TareasProvider } from "@/hooks/useTareas";
import { ServicioOverridesProvider } from "@/hooks/useServicioOverrides";
import { LoomsOverridesProvider } from "@/hooks/useLoomsOverrides";
import { RecursosOverridesProvider } from "@/hooks/useRecursosOverrides";
import { MetricsOverridesProvider } from "@/hooks/useMetricsOverrides";
import { InvitationsProvider } from "@/hooks/useInvitations";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Portal del cliente · Media Robots" },
      { name: "description", content: "Tu proyecto en Media Robots, en tiempo real: avances, videos semanales, entregables y próximos pasos." },
      { name: "author", content: "Media Robots" },
      { property: "og:title", content: "Portal del cliente · Media Robots" },
      { property: "og:description", content: "Tu proyecto en Media Robots, en tiempo real: avances, videos semanales, entregables y próximos pasos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Portal del cliente · Media Robots" },
      { name: "twitter:description", content: "Tu proyecto en Media Robots, en tiempo real: avances, videos semanales, entregables y próximos pasos." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/qjerHikMW4buArvWUrjlBOSexUc2/social-images/social-1780688319826-Mediarobots_portal.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/qjerHikMW4buArvWUrjlBOSexUc2/social-images/social-1780688319826-Mediarobots_portal.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ServiciosContratadosProvider>
          <TareasProvider>
            <ServicioOverridesProvider>
              <LoomsOverridesProvider>
                <RecursosOverridesProvider>
                  <MetricsOverridesProvider>
                    <InvitationsProvider>
                      <RootContent />
                      <Toaster />
                    </InvitationsProvider>
                  </MetricsOverridesProvider>
                </RecursosOverridesProvider>
              </LoomsOverridesProvider>
            </ServicioOverridesProvider>
          </TareasProvider>
        </ServiciosContratadosProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootContent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (isLogin) return;
    let hasSession = false;
    try { hasSession = !!localStorage.getItem("mr.session"); } catch { /* noop */ }
    if (!hasSession) navigate({ to: "/login" });
  }, [isLogin, pathname, navigate]);

  if (isLogin) return <Outlet />;
  return <AppShell />;
}
