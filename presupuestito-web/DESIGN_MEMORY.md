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
- Título grande a la izquierda + tarjetas de stats alineadas a la derecha en la misma fila.
- **Barra de acciones horizontal**: 4 ítems en fila con `divide-x divide-outline-variant/15`, mismo contenedor glassmorphic, sin chevrón.
- **Grid 12 columnas**: columna principal (8/12) con alertas + actividad. Sidebar (4/12) con próximas visitas.
- El sidebar siempre renderiza (estado vacío elegante si no hay visitas).

### Antipatrón evitado
- ❌ "Mobile-stretched en desktop": no usar `max-w-md mx-auto` en desktop.
- ❌ Quick Actions redundantes en mobile cuando hay BottomNav.
- ❌ Sidebar colapsando a `null` cuando no hay datos → siempre mostrar estado vacío.

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
