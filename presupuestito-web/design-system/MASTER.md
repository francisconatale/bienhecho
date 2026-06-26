# Presupuestito — Design System MASTER

> Fuente de verdad global. Toda página y componente debe respetar estas reglas.
> Última actualización: 2026-06-26

---

## 1. El Problema Raíz: Mobile-Stretched en Desktop

### Qué está pasando
El proyecto usa un layout **single-column `max-w-4xl mx-auto`** en todas las páginas.
En mobile (375–768px) esto se ve bien porque la columna ocupa casi todo el ancho.
En desktop (1024px+) la misma columna queda flotando en el centro con enormes márgenes
vacíos a los lados, y los componentes internos se estiran horizontalmente para llenar esa columna.

### Diagnóstico visual
```
Mobile 375px:   [====== card ======]                     ← bien
Desktop 1440px: [       ] [== card estirado ==] [       ] ← mal
```

Los items de lista con `p-6` se ven normales en mobile.
En desktop ese mismo `p-6` parece un hotel de lujo.

---

## 2. Arquitectura de Layout

### 2.1 Estructura del RootLayout actual
```
body (flex flex-col min-h-screen)
├── TopNav        (sticky h-16, solo md:flex)
├── content-wrap  (flex-1 flex flex-col)
│   └── {children}
└── BottomNav     (fixed bottom, solo mobile md:hidden)
```

### 2.2 Contenedor de Página — Regla por tipo

**Listas (Trabajos, Tareas, Agenda):**
```tsx
<main className="flex-1 px-4 py-6 pb-28 space-y-4
                 md:px-8 md:py-8 md:pb-12 md:space-y-5
                 max-w-3xl mx-auto w-full mt-20 md:mt-0">
```

**Formularios (Nuevo Trabajo, Nuevo Presupuesto):**
```tsx
<main className="flex-1 px-4 py-6 pb-28
                 md:px-8 md:py-8 md:pb-12
                 max-w-xl md:max-w-2xl mx-auto w-full mt-20 md:mt-0">
```

**Dashboard:**
```tsx
<main className="flex-1 px-4 py-6 pb-28
                 md:px-8 md:py-8 md:pb-12
                 max-w-5xl mx-auto w-full mt-20 md:mt-0">
```

### 2.3 Desktop: Two-Column para Master-Detail

Para páginas con **lista + panel de detalle** (ej: Clientes):
```tsx
<div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6 items-start">
  <aside>   {/* Lista — columna fija izquierda */}   </aside>
  <section> {/* Detalle — columna flexible derecha */} </section>
</div>
```

### 2.4 Desktop: Grid para Dashboard

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* cards de métricas */}
</div>
```

---

## 3. Spacing y Densidad

### 3.1 Escala de Spacing (regla estricta)

| Contexto                        | Propiedad | Valor correcto    | ❌ Evitar          |
|---------------------------------|-----------|-------------------|--------------------|
| Item de lista (padding vertical)| `py`      | `py-3` (12px)     | `py-5`, `py-6`     |
| Item de lista (padding lateral) | `px`      | `px-4` o `px-5`  | `px-6`, `px-8`     |
| Gap entre secciones             | `space-y` | `space-y-4`       | `space-y-8`, `space-y-10` |
| Header → primer card            | `mb`      | `mb-4` o `mb-5`  | `mb-8`, `mb-10`    |
| Padding interno de card         | `p`       | `p-4` o `p-5`    | `p-6`, `p-8`       |
| Padding de main (mobile)        | `px`      | `px-4`            | `px-8` en mobile   |
| Padding de main (desktop)       | `md:px`   | `md:px-8`         | `md:px-16`         |

### 3.2 Iconos en Listas

| Contexto                          | Container  | Ícono          |
|-----------------------------------|------------|----------------|
| Lista densa (muchos items)        | `w-9 h-9`  | `w-4 h-4`      |
| Lista estándar (`ListItem`)       | `w-11 h-11`| `w-5 h-5`      |
| Card decorativa aislada           | `w-12 h-12`| `w-6 h-6`      |
| ❌ Demasiado grande para listas   | `w-14 h-14`| `w-7 h-7`      |

### 3.3 Tipografía por Contexto

```
Título de página (h1):   text-2xl md:text-3xl font-bold tracking-tight
Subtítulo / descripción: text-sm text-on-surface-variant
Nombre en lista:         text-sm font-semibold   ← NO text-lg en listas
Metadata en lista:       text-xs text-on-surface-variant/60
Badge / status:          text-[10px] font-bold uppercase tracking-wide
```

### 3.4 Border Radius por Contexto

```
rounded-[32px]  → cards hero, modales grandes, filter panels flotantes
rounded-2xl     → listas de items (ListGroup), search bars
rounded-xl      → botones, badges, inputs, filter chips
rounded-lg      → íconos en lista, avatares pequeños
```

---

## 4. Antipatrones — Catálogo Completo

### ❌ AP-01: Main genérico sin adaptación desktop

```tsx
// MAL — mismo max-w en todos los breakpoints, pt-10 no estándar
<main className="flex-1 pb-32 w-full pt-10 transition-all max-w-4xl mx-auto px-4 md:px-8">

// BIEN
<main className="flex-1 px-4 py-6 pb-28 space-y-4
                 md:px-8 md:py-8 md:pb-12
                 max-w-3xl mx-auto w-full mt-20 md:mt-0">
```

### ❌ AP-02: Items de lista con padding de card

```tsx
// MAL — p-6 en cada fila: parece un hotel en desktop
<Link className="flex items-center justify-between p-6 ...">

// BIEN — usar ListItem del sistema que ya tiene py-4 px-5
<ListItem href={`/trabajos/${job.id}`} title={job.titulo} ... />
```

### ❌ AP-03: Header inline con h1 gigante y botón estirado

```tsx
// MAL
<div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
  <h1 className="text-4xl font-black">Trabajos</h1>
  <button className="px-6 py-3.5 font-black text-xs uppercase tracking-widest ...">
    Nuevo Trabajo
  </button>
</div>

// BIEN — usar componente Header con rightAction compacto
<Header
  title="Trabajos"
  rightAction={
    <Link href="/trabajos/nuevo">
      <button className="p-2 rounded-xl bg-primary/10 text-primary
                         hover:bg-primary/20 transition-colors cursor-pointer"
              type="button">
        <Plus className="w-5 h-5" strokeWidth={2.5} />
      </button>
    </Link>
  }
/>
```

### ❌ AP-04: Ícono container sobredimensionado en lista

```tsx
// MAL — w-14 h-14 con w-7 h-7 adentro
<div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
  <Briefcase className="w-7 h-7 text-primary" />
</div>

// BIEN — usar tamaño estándar de ListItem (ya lo hace solo)
// o si es manual: w-11 h-11 / w-5 h-5
```

### ❌ AP-05: Filtros siempre ocultos en panel flotante

```tsx
// MAL — en desktop el panel flotante es innecesario
<button onClick={() => setIsFilterOpen(!isFilterOpen)}>
  <Filter /> Filtros
</button>
{isFilterOpen && <div className="absolute ...">...</div>}

// BIEN — filtros inline en desktop, panel flotante solo en mobile
<div className="flex items-center gap-2 flex-wrap">
  {/* Visible siempre en desktop */}
  <div className="hidden md:flex items-center gap-2">
    {clients.map(c => <FilterChip key={c.id} client={c} ... />)}
  </div>
  {/* Solo en mobile */}
  <button className="md:hidden ..."><Filter /></button>
</div>
```

### ❌ AP-06: Nombre de item con text-lg en lista

```tsx
// MAL — text-lg en una lista densa se ve desproporcionado en desktop
<h3 className="font-bold text-lg text-on-surface truncate tracking-tight">
  {job.titulo}
</h3>

// BIEN
<span className="text-sm font-semibold text-on-surface truncate">
  {job.titulo}
</span>
```

### ❌ AP-07: rounded-[32px] en listas de items

```tsx
// MAL — radio excesivo para una lista
<div className="bg-surface rounded-[32px] border ... divide-y ...">

// BIEN
<ListGroup> {/* ya usa rounded-[24px] internamente */}
```

---

## 5. Componentes del Sistema — Cuándo Usar Cada Uno

### `<ListGroup>` + `<ListItem>` — Para listas estándar
Usar para listas de navegación secundarias o configuraciones.

```tsx
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";

<ListGroup>
  {jobs.map(job => (
    <ListItem
      key={job.id}
      href={`/trabajos/${job.id}`}
      icon={<Briefcase className="w-5 h-5" />}
      title={job.titulo}
      subtitle={client?.nombre}
      trailing={<StatusBadge status={job.estado} />}
    />
  ))}
</ListGroup>
```

**Excepción Premium:** Para listas principales (ej. Trabajos en dashboard, Tareas en detalle), abandonar `<ListGroup>` a favor de listas flotantes con `space-y-3` donde cada ítem sea una tarjeta independiente `backdrop-blur-2xl` (estilo Glassmorphism). Nunca usar markup de lista ad-hoc con `divide-y` custom.

### `<Header>` — Para encabezados genéricos y páginas simples

```tsx
import { Header } from "@/components/layout/header";

<Header
  title="Trabajos"
  rightAction={<NewJobButton />}
/>
<main className="... mt-20 md:mt-0">
  {/* mt-20 compensa el Header sticky en mobile */}
  {/* md:mt-0 porque en desktop el TopNav es el que ocupa espacio */}
</main>
```

**Excepción Premium:** En vistas principales (Clientes) y de detalle (Trabajo, Tarea), el `<Header />` genérico **solo** se muestra en mobile (`<div className="md:hidden"><Header /></div>`). En desktop, se oculta y la cabecera (breadcrumbs, título, acciones) se compone nativamente dentro del `<main>` para aprovechar layouts anchos sin estirarse.

---

## 6. Reglas Responsive por Tipo de Página

| Tipo de página       | Mobile                    | Desktop                              |
|----------------------|---------------------------|--------------------------------------|
| Lista simple         | columna única, items compactos | misma columna + `max-w-3xl` + filtros inline |
| Master-detail        | stack: lista → detalle    | grid `[340px_1fr]` lado a lado       |
| Formulario           | columna centrada `max-w-xl` | `max-w-2xl`, NO estirar              |
| Dashboard            | cards stack vertical      | grid 2–3 columnas                    |

---

## 7. La Regla de Oro: Densidad

> Si un componente ocupa **más del doble** del espacio que su contenido necesita, tiene demasiado padding.

### Test rápido para items de lista

1. Medir altura del texto + metadata internos → supongamos 36px
2. Medir altura del item con padding → debería ser ≤ 60px (`py-3` × 2 + 36px)
3. Si el item mide 80px+ para 36px de contenido → reducir padding

---

## 8. Checklist Pre-Entrega por Página

### Layout
- [ ] `<main>` usa `mt-20 md:mt-0` (compensa Header mobile, no desktop)
- [ ] `max-w` diferenciado: `max-w-3xl` listas, `max-w-2xl` forms, `max-w-5xl` dashboard
- [ ] Desktop no muestra columna angosta flotando con vacío a los lados
- [ ] Formularios NO se estiran a full-width en desktop

### Spacing
- [ ] Items de lista: `py-3` o `py-4` máximo
- [ ] Separación secciones: `space-y-4` o `space-y-5`
- [ ] Sin `mb-10` entre header y primer card
- [ ] Sin `text-4xl font-black` dentro de listas

### Componentes
- [ ] Listas usan `<ListGroup>` + `<ListItem>`
- [ ] Header usa `<Header />` component con `rightAction`
- [ ] Sin markup de lista ad-hoc con `p-6`

### Interacción
- [ ] `cursor-pointer` en todos los elementos clickeables
- [ ] Hover states con `transition-colors duration-150`
- [ ] Filtros visibles en desktop (no solo en panel flotante)

### Accesibilidad
- [ ] `type="button"` en todos los `<button>` no-submit
- [ ] Focus rings visibles
- [ ] `prefers-reduced-motion` respetado
