# Spacing, Densidad & Responsive Guidelines

> Para el design system completo ver `/design-system/MASTER.md`.
> Este archivo es el checklist rápido de referencia.

---

## El Problema Principal: Mobile-Stretched en Desktop

El layout en desktop es la misma columna angosta de mobile, centrada en 1440px.
Esto hace que items con `p-6` parezcan tarjetas de hotel y haya vacío a los lados.

**Regla**: `max-w` debe ser diferente por breakpoint. Siempre usar `md:` variants.

---

## Listas (Trabajos, Tareas, Clientes, etc.)

- **padding-y máximo 12–16px** por item → `py-3` o `py-4`. Nunca `py-5`, `py-6`.
- **Separar items con `divide-y`**, no con gap grande entre elementos.
- **Íconos en lista**: máximo `w-11 h-11` container, `w-5 h-5` ícono. Nunca `w-14 h-14`.
- **Títulos en lista**: `text-sm font-semibold`. Nunca `text-lg` o `text-xl`.
- **Metadata**: `text-xs`. Badges: `text-[10px]`.
- Usar siempre `<ListGroup>` + `<ListItem>`. No markup ad-hoc con `p-6`.

---

## Layout de `<main>` por Tipo de Página

| Tipo           | Clases base                                                      |
|----------------|------------------------------------------------------------------|
| Lista simple   | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-3xl mx-auto w-full mt-20 md:mt-0` |
| Formulario     | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-xl md:max-w-2xl mx-auto w-full mt-20 md:mt-0` |
| Dashboard      | `px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-5xl mx-auto w-full mt-20 md:mt-0` |

- `mt-20` compensa el Header sticky en mobile.
- `md:mt-0` porque en desktop el TopNav ya ocupa su espacio.
- `pb-28` compensa el BottomNav fijo en mobile.
- `md:pb-12` en desktop no hay BottomNav.

---

## Gap entre Secciones

- Separación header → primer card: `mb-4` o `mb-5`. Nunca `mb-8` o `mb-10`.
- Gap entre secciones: `space-y-4`. Nunca `space-y-8` o `space-y-10`.

---

## Header de Página

- Usar siempre el componente `<Header title="..." rightAction={...} />`.
- No crear `<h1>` inline dentro del `<main>`.
- El botón en `rightAction` debe ser compacto (ícono solo, o ícono + label corto).
- Nunca un botón ancho con `font-black text-xs uppercase tracking-widest`.

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
