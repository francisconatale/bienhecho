# Spacing, Densidad & Responsive Guidelines

> Para el design system completo ver `/design-system/MASTER.md`.
> Este archivo es el checklist rápido de referencia.

---

## El Problema Principal: Mobile-Stretched en Desktop

El layout en desktop es la misma columna angosta de mobile, centrada en 1440px.
Esto hace que items con `p-6` parezcan tarjetas de hotel y haya vacío a los lados.

**Regla**: `max-w` debe ser diferente por breakpoint. Siempre usar `md:` variants.

---

- **Listas Flotantes (Premium):** Para listas importantes (ej. tareas de un trabajo), abandonar el `divide-y`. En su lugar, usar `space-y-3` o `space-y-4` donde cada `<ListItem>` o tarjeta de ítem tenga su propio fondo Glassmorphic (`backdrop-blur`) y sombras coloreadas sutiles.
- **Listas Compactas (Estándar):** Si se utiliza `<ListGroup>`, mantener un `padding-y` máximo de 12–16px por ítem (`py-3` o `py-4`) y separar con `divide-y`.
- **Íconos en lista**: máximo `w-11 h-11` container, `w-5 h-5` ícono.
- **Títulos en lista**: `text-sm font-semibold`.
- **Metadata**: `text-xs`. Badges: `text-[10px]`.

---

## Layout de `<main>` por Tipo de Página

| Tipo           | Clases base                                                      |
|----------------|------------------------------------------------------------------|
| Lista simple   | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-3xl mx-auto w-full mt-20 md:mt-0` |
| Formulario     | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full mt-20 md:mt-0` |
| Dashboard Wide | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-7xl mx-auto w-full mt-20 md:mt-0` |
| Detalle Tarea  | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full mt-20 md:mt-0` |

- `mt-20` compensa el Header sticky en mobile.
- `md:mt-0` porque en desktop el TopNav ya ocupa su espacio.
- `pb-28` compensa el BottomNav fijo en mobile.
- `md:pb-12` en desktop no hay BottomNav.

---

## Gap entre Secciones

- Separación header → primer card: `mb-4` o `mb-5`. Nunca `mb-8` o `mb-10`.
- Gap entre secciones: `space-y-4`. Nunca `space-y-8` o `space-y-10`.

---

## Header de Página (Listas y genéricas)

- Usar siempre el componente `<Header title="..." rightAction={...} />`.
- No crear `<h1>` inline dentro del `<main>`.
- El botón en `rightAction` debe ser compacto (ícono solo, o ícono + label corto).
- Nunca un botón ancho con `font-black text-xs uppercase tracking-widest`.

---

## Layout de Vistas de Detalle (Trabajos / Tareas)

Para las páginas de detalle complejas (donde hay información crítica, layouts anchos o Bento Grids), se sigue un patrón mixto "Aurora + Breadcrumb":

1. **Fondo Aurora + Noise**: Usar el contenedor `absolute pointer-events-none` con gradientes radiales e incorporar un layer fijo de textura (`noise.svg` con `mix-blend-overlay` opacity baja) para mantener la identidad premium.
2. **Glassmorphism**: Las tarjetas laterales (como el Total Estimado o Barra de Progreso) abandonan los fondos sólidos. Utilizan `bg-surface/30` (o similar), `backdrop-blur-2xl` y contornos iluminados en lugar de cajas sólidas.
3. **Header Dividido por Breakpoint**:
   - **Mobile (`md:hidden`)**: `<Header />` flotante tradicional.
   - **Desktop (`hidden md:flex`)**: Breadcrumb nativo contextual (ej. `<- Volver a [Nombre]`) integrado como cabecera del `<main>`, con los botones de acción flotando a la derecha.

---

## Filtros en Desktop

- En mobile: panel flotante con botón `<Filter />` es aceptable.
- En desktop: mostrar filtros como chips inline, siempre visibles.
- Usar `hidden md:flex` para chips de desktop, `md:hidden` para botón de mobile.

---

## Border Radius

```
rounded-[32px]  → modales grandes, filter panels flotantes (mobile)
rounded-2xl     → ListGroup, search bars, filter panels
rounded-xl      → botones, badges, inputs
rounded-lg      → íconos en lista, avatares pequeños
```

---

## La Regla de Oro

> Si un componente ocupa **más del doble** del espacio que su contenido necesita, tiene demasiado padding.

Ejemplo: texto de 36px de alto + `py-3` (12px×2) = 60px total → correcto.
Si el item mide 90px para 36px de contenido → reducir padding.
