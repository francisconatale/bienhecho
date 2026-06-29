# Design Memory — Presupuestito

Decisiones de diseño documentadas en orden cronológico. Leer antes de hacer cambios visuales.

---

## Principios Generales

### Estética base
- Sistema de color **Material You / verde esmeralda** definido en `globals.css` como tokens `@theme`.
- **Glassmorphism** como lenguaje de superficies: `bg-surface/60 backdrop-blur-xl` con `border-outline-variant/20`.
- **Aurora + Noise** como fondo de páginas principales: dos blobs radiales de color + overlay de `noise.svg` con `mix-blend-overlay`.
- **Nunca usar colores hardcodeados** (`gray-100`, `zinc-900`, `white`). Solo tokens del sistema.

### Tokens de color más usados

| Token | Uso |
|---|---|
| `text-on-surface` | Texto principal, títulos |
| `text-on-surface-variant` | Texto secundario, labels, metadatos |
| `bg-surface/60` o `70` | Fondo de tarjetas glassmorphic |
| `border-outline-variant/20` | Bordes de tarjetas |
| `border-outline-variant/15` | Separadores internos entre ítems |
| `text-primary` | Acciones, links, acentos |
| `bg-primary/10` | Fondos de íconos o badges de acción |

---

## Componentes y Patrones

### Superficie glassmorphic estándar
```tsx
className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] border border-outline-variant/20 shadow-sm"
```

### Separador interno entre ítems de lista
```tsx
className="border-b border-outline-variant/15"
```

### Fondo Aurora + Noise (nivel página)
```tsx
{/* Noise overlay */}
<div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
{/* Blobs de color */}
<div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
  <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
  <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
</div>
```

### Ícono de acción circular con color
```tsx
<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0" aria-hidden="true">
  <PlusCircle size={17} strokeWidth={2.5} />
</div>
```
Colores por acción: `bg-primary` (crear), `bg-orange-500` (trabajos), `bg-blue-500` (clientes), `bg-violet-500` (agenda).

---

## Convención de Headers (Mobile y Navegación)

Para evitar inconsistencias ("a veces fondo blanco, a veces no"), todos los headers deben seguir estrictamente el patrón de navegación de iOS (Apple Clean):

### 1. Pantallas Principales (Root Tabs)
Aplica a páginas base como Dashboard, Clientes (Lista), Tareas (Resumen general), etc.
- **Estilo**: Título grande estático (`text-[34px] font-bold`), alineado a la izquierda.
- **Fondo**: Totalmente transparente. Se debe ver el *Aurora + Noise* de fondo. **Nunca** usar fondos sólidos o glassmorphism envolviendo el título.
- **Espaciado**: Amplio arriba (`pt-14` en mobile) para respetar la safe-area.
- **Subtítulos**: Prohibidos en mobile. "Directo al grano".

### 2. Vistas de Detalle y Sub-rutas (Detail Views)
Aplica a pantallas de segundo nivel como "Ver Cliente", "Tareas de Alta Prioridad", "Formulario de Creación".
- **Estilo**: Barra de navegación compacta y pegajosa (Sticky Nav Bar).
- **Comportamiento**: `sticky top-0 z-50` para que quede fija al hacer scroll.
- **Fondo**: Glassmorphism puro (`bg-surface/70 backdrop-blur-xl border-b border-outline-variant/20`).
- **Elementos**: Flecha "Atrás" a la izquierda, título compacto (opcional) en el centro, y acciones secundarias (ej. Guardar/Editar) a la derecha.

---

## Convención de Container y Responsive (29/06/2026)

### Container desktop
- **Max-width**: `max-w-[1400px]` — más amplio que `max-w-6xl` (1152px) para aprovechar pantallas anchas.
- **Padding responsivo**: `px-4 md:px-8 lg:px-10 xl:px-16` — crece con el breakpoint.
- **Patrón**: `max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 xl:px-16`.
- **Aplica a**: todas las páginas principales (Dashboard, Agenda, etc.).

### Estrategia por resolución

| Rango | Estrategia |
|---|---|
| `< md` (mobile) | `px-4` — contenido full-width, sin restricción de ancho. Scroll horizontal para stats. |
| `md–lg` (tablet) | `px-8` — más respiro, columnas apiladas o 2-col compacta. |
| `lg–xl` (desktop pequeño) | `px-10` — grid de 2 columnas, sidebar visible. |
| `≥ xl` (desktop grande / ultrawide) | `px-16` — contenido se expande, sidebar más ancha, headers con acciones inline. |

### Antipatrón evitado
- ❌ `max-w-5xl` o `max-w-6xl` en desktop: comprime todo al centro, desperdicia espacio en pantallas ≥1440px.
- ❌ Padding fijo sin responsive: `px-4` en desktop se siente pegado a los bordes.
- ❌ `max-w-md mx-auto` en desktop: mobile-stretched.

---

## Dashboard Principal (`/`) — Estilo "Apple Clean" (definido el 29/06/2026)

### Decisión
Rediseño completo con inspiración **Apple iOS Settings / Notion** — mobile-first, limpio, sin glassmorphism exagerado. Jerarquía clara: saludo grande → métricas → contenido accionable.

### Características

**Mobile (< md):**
- Título `text-[34px] font-bold` a la izquierda, sin subtítulo. Directo al grano.
- **Stats en scroll horizontal** tipo scroll snap: tarjetas de `w-[200px]` con `snap-start`. El usuario descubre más deslizando.
- **Sin Quick Actions** — el BottomNav ya tiene toda la navegación.
- Orden del contenido: Saludo → Métricas → Próximas Visitas → Avisos → Actividad Reciente.
- **Lista estilo iOS Settings**: ítems en contenedor `rounded-[24px]` agrupado, separados por `border-outline-variant/15`, con chevrón a la derecha.

**Desktop (≥ md):**
- Container `max-w-[1400px]` con padding responsivo.
- **Header row**: título `text-[48px] lg:text-[56px]` a la izquierda + barra de acciones (solo íconos en `lg`, labels en `xl+`) a la derecha — rellena la fila horizontal.
- **Grid 12 columnas**: columna principal (7/12) con stats + alertas + actividad. Sidebar (5/12) con próximas visitas.
- El sidebar siempre renderiza (estado vacío elegante si no hay visitas).

### Antipatrón evitado
- ❌ Quick Actions redundantes en mobile cuando hay BottomNav.
- ❌ Sidebar colapsando a `null` cuando no hay datos → siempre mostrar estado vacío.

---

## Página Agenda (`/agenda`) — Calendar + Day Detail (29/06/2026)

### Decisión
Mismo patrón de container que Dashboard: `max-w-[1400px]` con padding responsivo. Layout de 2 columnas en desktop.

### Características

**Mobile (< lg):**
- Columnas apiladas verticalmente: Calendario → Filtros → Lista de visitas del día.
- Padding `px-4` estándar mobile.

**Desktop (≥ lg):**
- Container `max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 xl:px-16`.
- **Izquierda** (`lg:w-[480px]`): Calendario + Filtros.
- **Derecha** (`flex-1`): Lista de visitas del día seleccionado.
- El calendario mantiene ancho fijo para consistencia visual.

---

## Página Tareas (`/tareas`) — Master Detail con secciones

- Secciones por prioridad (Alta / Media / Baja), máximo 5 ítems por sección.
- Navegación a sub-vista dedicada con "Ver más" en vez de filtro inline.

---

## Accesibilidad (A11y) — Decisiones aplicadas el 29/06/2026

- **Íconos decorativos**: siempre `aria-hidden="true"` cuando hay texto de acompañamiento.
- **Links sobre botones**: nunca `<a><button>`. El `<Link>` lleva las clases directamente.
- **Jerarquía de headings**: H1 (título de página) → H2 (secciones). No saltar niveles.
- **Campos read-only**: `cursor-default select-none` en `<span>` o `<p>` que muestran datos sin onClick.
- **Touch targets**: mínimo 44×44px en mobile (los ítems de lista usan `p-4` = ~56px de altura).
