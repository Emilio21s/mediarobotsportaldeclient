## Portal de Cliente — Media Robots

Construir el portal en `/` con datos estáticos siguiendo el documento. Sin login, sin admin, sin routing extra (eso queda para más adelante según la sección 10).

### Stack
- React + TanStack Start (ya está en el proyecto)
- Tailwind v4 con tokens en `src/styles.css`
- shadcn/ui (ya disponible) + iconos Lucide
- Tipografía: Geist Sans / Geist Mono vía Google Fonts
- Datos hardcodeados en `src/data/portalData.ts`

### Estructura de archivos
```
src/
  styles.css                  → tokens de color (bg, surface, border, teal, text, muted) + import Geist
  types/portal.ts             → interfaces PortalData, Servicio, Loom, Paso, Entregable
  data/portalData.ts          → datos de ejemplo (Dr. Carlos García, 3 servicios, 2 looms, etc.)
  components/portal/
    Navbar.tsx                → sticky, logo MR + clínica + badge paquete
    WelcomeHeader.tsx         → H1 bienvenida + WhatsApp CTA
    QuickStats.tsx            → grid 3 columnas
    ProjectStatus.tsx         → lista de servicios con progress bars
    WeeklyUpdates.tsx         → sección estrella con accordion de Looms + placeholder dashed + nota
    LoomCard.tsx              → tarjeta individual expandible
    NextSteps.tsx             → 3 ítems con fecha
    Deliverables.tsx          → archivos con status coloreado
    Communication.tsx         → grid 2x2 de canales
    Footer.tsx                → línea muted centrada
  routes/index.tsx            → compone todas las secciones, max-w-3xl mx-auto, bg #F5F4F0
  routes/__root.tsx           → meta tags (título "Portal · Media Robots")
```

### Tokens de diseño (en `src/styles.css`)
Mapear la paleta del doc a tokens semánticos OKLCH:
- `--background` = #F5F4F0
- `--card` / `--surface` = white
- `--border` = #E2E0DB
- `--primary` (teal) = #0A7C6A con foreground blanco
- `--muted-foreground` = #787672
- Colores accesorios (#5B6AF0 indigo, #D97706 amber, #B5426B pink) como variables aux para servicios/status

Nada hardcodeado en componentes — todo vía tokens o (para los colores por servicio que vienen del JSON) inline `style={{ color }}` ya que son data-driven.

### Comportamiento clave
- **WeeklyUpdates**: accordion controlado — solo un Loom expandido a la vez, borde cambia a teal cuando expandido, botón "Ver video" cambia a teal sólido y no propaga el click. Barra accent de 3px arriba de la card. Placeholder dashed para próximo viernes. Nota de archivo al pie.
- **ProjectStatus**: progress bars animadas (transition width 0.8s al montar).
- **Responsividad**: stats / looms / comunicación → 1 columna en mobile; navbar oculta nombre de clínica en mobile.

### Detalles técnicos
- TanStack Start usa file-based routing en `src/routes/`. Reemplazar el placeholder de `src/routes/index.tsx` por la composición real.
- Geist se carga en el `<head>` del root (links a Google Fonts) y se aplica en `body` vía CSS.
- WhatsApp y Loom links abren en nueva pestaña (`target="_blank" rel="noopener"`).
- Toda la copia y datos vienen de `portalData.ts`; los labels de sección sí pueden ser literales.

### Fuera de alcance (sección 10 del doc)
- Rutas `/[slug]` por cliente
- Panel `/admin`
- Persistencia en Supabase / login
- Notificaciones por email/WhatsApp

Listo para implementar cuando aprobés.