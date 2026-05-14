## Rediseño del Portal de Cliente — estilo ElevenLabs

Convertir el portal de single-page a una app multi-página con sidebar persistente (desktop) / bottom nav (mobile), siguiendo la estética del dashboard de ElevenLabs.

### 1. Layout global

Mover toda la composición a `src/routes/__root.tsx` (o un layout `_app`):
- **Desktop (≥768px)**: sidebar fijo a la izquierda (260–280px) + contenido scrollable a la derecha.
- **Mobile (<768px)**: sidebar oculto, bottom navigation bar fija con los íconos principales (Home, Servicios contratados, Entregables, Comunicación, Más).

### 2. Sidebar (desktop) — `src/components/layout/AppSidebar.tsx`

Estructura exacta según especificación:

**Header:**
- Título "Media Robots" en negrita, color foreground.
- Selector de proyecto: botón redondeado con borde fino, dot circular degradado teal, "Clínica Dental García", chevron up/down.
- Botón "Home" con `bg-muted/60`, ícono `Home` de Lucide, esquinas redondeadas.

**Grupos (label en `text-[11px] uppercase tracking-wide text-muted-foreground`):**

1. **Servicios** (filtrado por `cliente.serviciosContratados`):
   - Diseño Web → `/servicios/diseno-web` (ícono `Palette`)
   - SEO → `/servicios/seo` (ícono `Search`)
   - Go High Level → `/servicios/go-high-level` (ícono `Workflow`)
   - Agentes de IA → `/servicios/agentes-ia` (ícono `Bot`)

2. **Actualizaciones semanales** → `/actualizaciones` (`Film`) + botón `+` minimalista a la derecha.

3. **Próximos Pasos** → `/proximos-pasos` (`ListChecks`) + badge pill con fecha del próximo paso (calculada dinámicamente desde los datos).

4. **Centro de Entregables** → `/entregables` (`FolderOpen`) + botón `+`.

5. **Recursos Importantes** → `/recursos` (`BookMarked`).

6. **Comunicación** → `/comunicacion` (`MessageCircle`).

7. **Resultados** → `/resultados` (`TrendingUp`).

8. **Miembros** → `/miembros` (`Users`).

**Items**: ícono Lucide a la izquierda + label, hover `bg-muted/60`, activo `bg-muted` + texto bold. Usar `Link` de TanStack Router con `activeProps`.

**Footer**: card blanca redondeada (`rounded-2xl`, borde sutil) con ícono `Send`, título "Invite team members" bold, descripción pequeña en muted.

### 3. Bottom navigation (mobile) — `src/components/layout/BottomNav.tsx`

5 íconos fijos abajo: Home, Servicios (drawer con la lista), Entregables, Comunicación, Más (drawer con resto).

### 4. Rutas (file-based, TanStack Router)

```
src/routes/
  __root.tsx                          → shell con sidebar/bottom nav
  index.tsx                           → Home (dashboard general)
  servicios.diseno-web.tsx            → página servicio
  servicios.seo.tsx
  servicios.go-high-level.tsx
  servicios.agentes-ia.tsx
  actualizaciones.tsx                 → Looms semanales
  proximos-pasos.tsx
  entregables.tsx
  recursos.tsx
  comunicacion.tsx
  resultados.tsx
  miembros.tsx
```

Cada ruta con su `head()` (título + descripción únicos).

### 5. Home (`/`) — Dashboard general

Vista resumen con:
- Hero: saludo + nombre clínica + paquete.
- Grid de KPIs (días activo, servicios activos, próxima entrega, próximo Loom).
- Card "Estado del proyecto" con progress bars de cada servicio contratado.
- Card "Último Loom" (preview del más reciente).
- Card "Próximo paso" con fecha y CTA.
- Card "Últimos entregables" (top 3).

### 6. Páginas de servicio (template compartido)

Componente `ServicePage` que recibe el servicio y muestra:
- Header con nombre, ícono color del servicio, fase actual, % avance.
- Timeline de fases (completadas / actual / pendientes).
- Entregables filtrados por servicio.
- Looms relacionados (filtrados por tag).
- Próximos pasos relacionados.

Si el servicio no está contratado → 404 propio o redirect a `/`.

### 7. Datos — `src/data/portalData.ts` extendido

Añadir:
- `cliente.serviciosContratados: string[]` (slugs).
- `servicios[]` con: `slug`, `nombre`, `icono`, `color`, `colorSoft`, `fases: Fase[]`, `avance`, `faseActual`.
- Cada `Loom`, `Entregable`, `Paso` ya referencia el servicio por slug para filtrar.
- `recursos: Recurso[]` (links/PDFs importantes).
- `resultados: Metrica[]` (KPIs como tráfico, leads, etc).
- `miembros: Miembro[]` (equipo Media Robots asignado + contactos clínica).

Helper `getProximoPaso()` para el badge de fecha en sidebar.

### 8. Tokens de diseño (`src/styles.css`)

Ajustar para acercarse a ElevenLabs:
- Sidebar bg `oklch(0.985 0.002 95)` (casi blanco con tinte cálido).
- Border muy sutil `oklch(0.92 0.003 90)`.
- Item hover `oklch(0.955 0.003 90)`.
- Item activo con fondo `oklch(0.93 0.005 90)`.
- Mantener teal `#0A7C6A` solo como acento (no dominante en sidebar).
- Tipografía: mantener Geist.

### 9. Componentes reutilizables

- `SidebarItem` — link con ícono, hover, activo, slot opcional derecho (badge / botón +).
- `SectionLabel` — encabezado de grupo del sidebar.
- `ProjectSwitcher` — el dropdown de proyecto (visual only por ahora, sin lógica multi-proyecto).
- `ServiceProgressCard` — usado en Home y página de servicio.
- `LoomCard`, `DeliverableRow`, `StepRow` — refactor de los actuales.

### 10. Detalles técnicos

- `useRouterState({ select: r => r.location.pathname })` para detectar ruta activa en sidebar.
- `useIsMobile()` (hook ya existente) para renderizar Sidebar vs BottomNav.
- Filtrado de servicios contratados con `cliente.serviciosContratados.includes(servicio.slug)` antes de renderizar el grupo.
- Botones `+` y selector de proyecto sin lógica funcional aún (solo UI) — quedan listos para conectar al panel admin más adelante.

### Fuera de alcance (siguiente iteración)
- Panel `/admin` para editar contenido.
- Persistencia en Lovable Cloud (ahora todo viene de `portalData.ts`).
- Multi-cliente real (rutas `/[slug]`).
- Login.
- Subida de archivos / botones `+` funcionales.

¿Aprobás este plan para arrancar?
