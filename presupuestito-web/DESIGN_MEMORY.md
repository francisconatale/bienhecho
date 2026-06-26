# DESIGN_MEMORY.md
# Presupuestito — Frontend Development Memory

> Este archivo es memoria viva. Actualizarlo cada vez que se aprende algo
> nuevo sobre el proyecto, se resuelve un problema de diseño, o se decide
> un patrón. Nunca borrar entradas — solo agregar o corregir.
>
> Para el design system completo → `design-system/MASTER.md`
> Para spacing específico → `src/SPACING-GUIDELINES.md`

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript strict |
| Estilos | Tailwind CSS v4 (`@theme` en `globals.css`) |
| Iconos | `lucide-react` — solo esta librería, nada más |
| Estado global | Zustand (`useDataStore()`) |
| Fuente | Inter via `next/font/google` |
| Validaciones | Zod |
| Formularios | React Hook Form |

---

## Brand

- **Tono:** limpio, profesional, accesible, eficiente
- **Color primario:** `#3D8B6E` sage green (dark: `#6ECFB0`)
- **Evitar:** layouts saturados, cards apiladas sin respirar, look desactualizado
- **Modo oscuro:** OLED pure black (`#000000` de fondo), superficies en `#0D1F14`

---

## Componentes del Sistema — Siempre Usar Estos

### `<Header />` — Todo encabezado de página
```tsx
import { Header } from "@/components/layout/header";

<Header
  title="Trabajos"
  rightAction={<IconButton />}   // ícono compacto, no botón ancho
  leftAction={<BackButton />}    // opcional
/>
```
- El `rightAction` debe ser **compacto**: ícono solo o ícono + label corto (`px-3 py-2`)
- Nunca un botón ancho con `font-black uppercase tracking-widest` como `rightAction`
- **Excepción en Vistas Premium:** En páginas de detalle y principales con layout ancho, el `<Header />` se debe ocultar en desktop (`<div className="md:hidden"><Header /></div>`) y componer los breadcrumbs/acciones directamente en el layout del `<main>`.

### `<ListGroup>` + `<ListItem>` — Toda lista navegable
```tsx
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";

<ListGroup>
  {items.map(item => (
    <ListItem
      key={item.id}
      href={`/ruta/${item.id}`}
      icon={<Icon className="w-5 h-5" />}
      title={item.nombre}
      subtitle={item.subtitulo}
      trailing={<Badge />}
    />
  ))}
</ListGroup>
```
- **Nunca** crear markup de lista ad-hoc con `divide-y` + `p-6` custom

### `<LoadingScreen />` y `<LoadingSpinner />`
- `<LoadingScreen />` para cargas de página completa
- `<LoadingSpinner />` para cargas parciales inline
- **Nunca** JSX de carga ad-hoc

---

## Patrones de Página — Plantilla Exacta

```tsx
// app/mi-ruta/page.tsx
import { Header } from "@/components/layout/header";
import { MiContent } from "./components/mi-content";

export default function MiPage() {
  return (
    <>
      <Header title="Mi Título" />
      <main className="flex-1 px-4 py-6 space-y-4 mt-20 pb-28
                       md:px-8 md:py-8 md:pb-12 md:mt-0
                       max-w-3xl mx-auto w-full">
        <MiContent />
      </main>
    </>
  );
}
```

**Reglas del `<main>`:**
| Clase | Por qué |
|---|---|
| `mt-20` | Compensa Header sticky en mobile |
| `md:mt-0` | En desktop el TopNav ya ocupa su espacio |
| `pb-28` | Compensa BottomNav fijo en mobile |
| `md:pb-12` | En desktop no hay BottomNav |
| `max-w-3xl` | Listas. Usar `max-w-2xl` para forms, `max-w-5xl` para dashboard |
| `md:px-8` | Desktop respira más |

---

## El Anti-patrón Principal: Mobile-Stretched en Desktop

**Síntoma:** en desktop todo se ve como mobile pero estirado. Cards gigantes, botones largos, mucho vacío a los lados.

**Causa:** usar el mismo `max-w-4xl mx-auto` en todos los breakpoints sin adaptar la densidad interna.

**Regla:**
- `max-w` diferente por breakpoint: más ancho en desktop
- Densidad de items de lista **no cambia** con el ancho — sigue siendo compacta
- Filtros y acciones se **expanden** en desktop (chips inline en lugar de panel flotante)

---

## Spacing — Reglas Rápidas

| Qué | Valor correcto | ❌ Nunca |
|---|---|---|
| `py` en item de lista | `py-3` o `py-4` | `py-5`, `py-6` |
| `px` en item de lista | `px-4` o `px-5` | `px-6`, `px-8` |
| Gap entre secciones | `space-y-4` | `space-y-8`, `space-y-10` |
| Header → primer card | `mb-4` | `mb-8`, `mb-10` |
| Padding de card | `p-4` o `p-5` | `p-6`, `p-8` |
| Ícono container en lista | `w-11 h-11` max | `w-14 h-14` |
| Ícono en lista | `w-5 h-5` | `w-7 h-7` |
| Título en lista | `text-sm font-semibold` | `text-lg font-bold` |

---

## Border Radius

```
rounded-[32px]  → modales grandes, filter panels flotantes mobile
rounded-2xl     → ListGroup, search bars
rounded-xl      → botones, badges, inputs, filter chips
rounded-lg      → íconos en lista, avatares pequeños
```

---

## Tipografía

| Contexto | Clases |
|---|---|
| H1 de página | `text-2xl md:text-3xl font-bold tracking-tight` |
| Subtítulo / descripción | `text-sm text-on-surface-variant` |
| Nombre en lista | `text-sm font-semibold` |
| Metadata | `text-xs text-on-surface-variant/60` |
| Labels de formulario | `text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/40` |
| Badges / status | `text-[10px] font-bold uppercase tracking-wide` |

---

## Iconos (Lucide React)

| Contexto | Tamaño | strokeWidth |
|---|---|---|
| En listas / acciones | `w-5 h-5` | `2` |
| En headers `rightAction` | `w-5 h-5` | `2.5` |
| Decorativos en cards | `w-6 h-6` | `1.5` |
| En botones de formulario | `w-4 h-4` | `2.5` |

---

## Filtros Responsive

- **Mobile:** botón con ícono `<Filter />` que abre panel flotante `absolute`
- **Desktop:** chips inline siempre visibles

```tsx
{/* Visible en desktop */}
<div className="hidden md:flex items-center gap-2 flex-wrap">
  {opciones.map(o => <FilterChip key={o.id} ... />)}
</div>

{/* Solo mobile */}
<button className="md:hidden ..."><Filter /></button>
```

---

## Tokens de Color (solo usar estos)

| Token | Uso |
|---|---|
| `text-primary` | Títulos, acciones, destacados |
| `text-on-surface` | Cuerpo sobre fondo claro |
| `text-on-surface-variant` | Secundario, labels, metadata |
| `bg-surface` | Fondo de cards y listas |
| `border-outline-variant/10` | Bordes sutiles internos |
| `border-outline-variant/30` | Bordes de inputs y cards |
| `bg-primary/10` | Fondo suave de ícono activo |

**Nunca** usar colores arbitrarios ni hex directos en clases Tailwind.

---

## Interacción

- `cursor-pointer` en **todos** los elementos clickeables
- `transition-colors duration-150` como mínimo en hovers
- `active:scale-95` solo en botones de acción principales (CTA)
- `focus:ring-4 focus:ring-primary/10 focus:outline-none` en inputs

---

## Formularios

- React Hook Form para gestión de estado del form
- Zod para esquemas de validación
- Campos en componentes reutilizables
- Lógica de submit en custom hooks, no en el componente
- Labels **siempre** con `htmlFor` o wrapping explícito

---

## Estado y Data

- Estado global: Zustand via `useDataStore()`
- Tipos: en `src/types/index.ts` — **siempre** alineados con `database_relations.md`
- Nunca inferir nombres de campos/tablas de memoria — consultar `database_relations.md`
- Data actualmente en-memory (Zustand), migración a DB pendiente

---

## Decisiones Tomadas (log cronológico)

### 2026-06-26
- **Problema:** Páginas se veían bien en mobile pero estiradas en desktop
- **Causa:** `max-w-4xl mx-auto` sin adaptar densidad interna ni breakpoints
- **Decisión:** `max-w` diferenciado por tipo de página + `md:` variants en padding/spacing
- **Antipatrón documentado:** "Mobile-Stretched en Desktop" → ver `design-system/MASTER.md`
- **Filtros:** en desktop mostrar chips inline (`hidden md:flex`), panel flotante solo en mobile
- **Iconos en lista:** máximo `w-11 h-11` container — `w-14 h-14` es demasiado
- **Títulos en lista:** `text-sm font-semibold` — `text-lg` es demasiado para listas densas

### 2026-06-26 (Job Header)
- **Problema:** La edición del Job Header abría un formulario que rompía la jerarquía visual de la página y se sentía pesado.
- **Decisión:** Se implementó un estilo sutil "tipo Stripe" (Variante F del Design Lab). La información se muestra en read-only manteniendo su jerarquía original. Solo al hacer clic en el ícono del lápiz (que aparece on hover) los textos se transforman en inputs inplace (border-b `outline-variant/30`) minimizando el layout shift y manteniendo el diseño limpio.

### 2026-06-26 (Job Header - Refactor Inline)
- **Problema:** En la vista de detalle de Trabajos, el `job-header.tsx` presentaba múltiples tarjetas pequeñas (cards con `bg-on-surface/5` para dirección, fechas, presupuesto) generando mucho ruido visual ("muchas cards") y un layout poco cohesivo.
- **Decisión:** Se unificaron los metadatos de la cabecera en una estructura inline simple. Se eliminó por completo el estilo de tarjeta del componente principal y se posicionaron los elementos de edición (Stripe-like) para que no rompan el layout al editar. Se removió un componente `JobStatusSelector` redundante que ya aparecía en el header nativo/breadcrumb.

### 2026-06-26 (Identidad Premium y Header Dividido)
- **Problema:** Al aplicar refactors genéricos de layout (`<Header />` visible y `<main>` genérico) en componentes monolíticos complejos como la vista de Clientes o Detalles, se rompía el diseño premium del proyecto y se forzaba un layout encajonado.
- **Decisión:** Se definió explícitamente el patrón "Premium (Aurora + Glassmorphism)" para vistas principales de entidades. En estas vistas, el `<Header />` móvil se oculta en desktop (`md:hidden`) y el layout se compone directamente en la página con breadcrumbs nativos, fondos de ruido, manchas radiales y tarjetas laterales `backdrop-blur-2xl`. Se prohíbe el uso de componentes monolíticos tipo `content.tsx` o `ClientList.tsx` que oculten la estructura general de la página.

### 2026-06-26 (Layout Master-Detail y Header Mobile)
- **Problema:** Los rediseños tendían a romper el layout Master-Detail (panel izquierdo + detalle) en desktop al intentar adaptarlo, y omitían el `<PageHeader />` en mobile a favor de componentes ad-hoc más compactos.
- **Decisión:** Mantener siempre el layout Master-Detail en desktop (panel anclado a la izquierda, altura completa sin scroll global). Para móvil, es obligatorio mostrar el `<PageHeader />` nativo (mediante `md:hidden`) en la vista de lista principal para mantener la consistencia del sistema de diseño, adaptando las acciones y filtros alrededor de él.

---

*Actualizar este archivo en cada sesión de desarrollo. Una entrada en el log por decisión relevante.*
