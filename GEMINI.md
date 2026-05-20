# Presupuestito — Reglas del Proyecto

Este archivo define los patrones, convenciones y decisiones de diseño del proyecto. Deben respetarse siempre al agregar o modificar código.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router) |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS v4 (`@theme` en `globals.css`) |
| Iconos | `lucide-react` — **nunca** usar Material Symbols ni ninguna otra librería de iconos |
| Estado global | Zustand |
| Fuente | Inter (cargada via `next/font/google`) |

---

## Estructura de Archivos

```
src/
├── app/
│   ├── layout.tsx              ← RootLayout global (fuente, metadata base, body)
│   ├── globals.css             ← @theme con todos los tokens de color y tipografía
│   ├── page.tsx                ← Página principal (Dashboard)
│   ├── (auth)/                 ← Grupo de rutas de autenticación (sin layout compartido)
│   ├── (dashboard)/            ← Grupo de rutas del dashboard (layout compartido si aplica)
│   │   ├── clientes/
│   │   │   └── page.tsx
│   │   └── presupuestos/
│   │       └── page.tsx
│   └── components/             ← Componentes específicos de una página o sección
│       ├── bottom-nav.tsx
│       ├── dashboard-header.tsx
│       ├── clients-header.tsx
│       ├── clients-content.tsx
│       └── ...
├── components/
│   ├── ui/                     ← Componentes genéricos reutilizables (botones, badges, inputs)
│   └── layout/                 ← Componentes de layout globales (si aplica)
├── types/                      ← Tipos e interfaces TypeScript globales
├── lib/                        ← Utilidades, helpers, clientes de API
└── mocks/                      ← Datos de prueba para desarrollo
```

---

## Composición de Páginas

Cada página **siempre** sigue esta estructura:

```tsx
// app/mi-ruta/page.tsx
import { MiHeader } from "../components/mi-header";
import { MiContent } from "../components/mi-content";
import { BottomNav } from "../components/bottom-nav";

export default function MiPage() {
  return (
    <>
      <MiHeader />
      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        <MiContent />
      </main>
      <BottomNav />
    </>
  );
}
```

### Reglas de composición de páginas:
- El `<main>` **siempre** tiene: `flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full`
  - `mt-20` compensa el header fijo
  - `pb-24` compensa el BottomNav fijo
  - `max-w-3xl mx-auto` centra el contenido en pantallas grandes
- El `page.tsx` **no contiene JSX de negocio**: solo ensambla Header + main + BottomNav
- Los metadatos (`metadata`) van en el `page.tsx` de cada ruta
- Usar `<>` (Fragment) como wrapper, nunca `<div>`

---

## Componentes de Header

Cada sección tiene su propio header que extiende el patrón de `DashboardHeader`:

```tsx
// Patrón base de header
export function MiHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
      {/* Botón izquierdo o spacer (div className="w-10") */}
      <h1 className="font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight">
        Título
      </h1>
      {/* Botón derecho (PlusCircle, etc.) */}
    </header>
  );
}
```

### Reglas de headers:
- Siempre `fixed top-0 left-0 w-full z-50`
- Siempre `bg-surface/80 backdrop-blur-md border-b border-outline-variant/10`
- El título usa exactamente: `font-headline-large-mobile text-headline-large-mobile text-primary flex-1 text-center font-bold tracking-tight`
- Si no hay botón izquierdo, poner `<div className="w-10" />` como spacer para mantener el título centrado
- Iconos de acción: tamaño `w-8 h-8`, `strokeWidth={1.5}`, color `text-primary`, con `hover:bg-surface-variant` y `-mr-2`/`-ml-2` para alineación

---

## BottomNav

El `BottomNav` es un **Client Component** que usa `usePathname()` para detectar la ruta activa.

```tsx
"use client";
import { usePathname } from "next/navigation";
```

- Siempre `fixed bottom-0 left-0 w-full z-50`
- Siempre `bg-surface/90 backdrop-blur-lg border-t border-outline-variant/10 rounded-t-[24px]`
- Item activo: `text-primary` con fondo `bg-primary/10` en el icono
- Item inactivo: `text-on-surface-variant/60 hover:text-on-surface`
- Labels: `text-[10px] font-bold uppercase tracking-tighter`

---

## Listas e Items (patrón List)

Para listas de entidades (clientes, presupuestos, etc.) usar este patrón:

```tsx
// Contenedor de la lista
<div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
  {items.map((item) => <ItemRow key={item.id} {...item} />)}
</div>

// Cada fila
<button className="w-full flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0 hover:bg-surface-variant/30 transition-colors text-left group">
  {/* Avatar/Inicial */}
  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
    {item.name.charAt(0)}
  </div>
  {/* Texto principal + subtexto */}
  <div className="flex-1 min-w-0">
    <h4 className="font-semibold text-on-surface truncate">{item.name}</h4>
    <p className="text-xs text-on-surface-variant truncate">{item.subtitle}</p>
  </div>
  {/* Badge de estado + chevron */}
  <div className="flex items-center gap-2 shrink-0">
    <StatusBadge status={item.status} />
    <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
  </div>
</button>
```

---

## Tokens de Color y Tipografía

**No usar colores arbitrarios.** Solo usar los tokens definidos en `globals.css`:

### Colores clave:
| Token | Uso |
|---|---|
| `text-primary` | Títulos, acciones principales, texto destacado |
| `text-on-surface` | Texto de cuerpo sobre fondos claros |
| `text-on-surface-variant` | Texto secundario, labels, metadatos |
| `bg-surface` | Fondo de cards y listas |
| `bg-surface-variant` | Hover states |
| `border-outline-variant/10` | Bordes sutiles entre items |
| `border-outline-variant/30` | Bordes de cards |
| `text-success-dark bg-success/10` | Badge "Activo" |
| `text-on-error-container bg-error-container` | Badge "Pendiente" |
| `text-on-surface-variant bg-surface-container-highest` | Badge "Inactivo/Borrador" |

### Tipografía:
| Clase | Uso |
|---|---|
| `font-headline-large-mobile text-headline-large-mobile` | Título principal de header (28px/700) |
| `font-semibold text-on-surface` | Nombre de entidad en lista |
| `text-xs text-on-surface-variant` | Subtexto de lista |
| `text-[10px] font-bold uppercase tracking-wider` | Badge de estado |
| `text-xs font-bold text-on-surface-variant uppercase tracking-widest` | Section label |

---

## Iconos

- Librería exclusiva: **`lucide-react`**
- Tamaño estándar en listas/botones: `w-5 h-5` o `w-6 h-6`
- Tamaño en headers: `w-8 h-8`
- `strokeWidth` en headers: `1.5`; en listas/acciones: `2` o `2.5`
- **Nunca** usar `<span className="material-symbols-outlined">`

---

## Client vs Server Components

- `page.tsx` → **Server Component** por defecto (puede exportar `metadata`)
- Componentes con `useState`, `useEffect`, `usePathname`, handlers → agregar `"use client"` al inicio
- Mantener los Server Components lo más arriba posible en el árbol para maximizar el SSR

---

## Convenciones de Nombres

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos de componentes | `kebab-case.tsx` | `clients-content.tsx` |
| Exports de componentes | `PascalCase` | `ClientsContent` |
| Interfaces/Types | `PascalCase` con sufijo descriptivo | `ClientRowProps`, `ClientStatus` |
| Constantes de datos mock | `UPPER_SNAKE_CASE` | `CLIENTS`, `STATUS_CONFIG` |
| Rutas (carpetas) | `kebab-case` en español | `clientes/`, `presupuestos/` |

---

## Commits

Usar el comando `gcommit` (disponible globalmente) para generar commits con mensajes en formato **Conventional Commits** usando Gemini Flash.

- `gcommit` → un commit por archivo modificado
- `gcommit -iq` → modo inteligente: agrupa archivos relacionados en un solo commit
