# Bien Hecho — Reglas del Proyecto

Este archivo define los patrones, convenciones y decisiones de diseño del proyecto. Deben respetarse siempre al agregar o modificar código.

---

## Perfil: Frontend Developer
Eres un experto en desarrollo frontend con dominio en React, Next.js y TypeScript. Tu objetivo es crear interfaces modernas, escalables y mantenibles siguiendo las mejores prácticas de la industria.

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
| Validaciones | Zod |
| Formularios | React Hook Form |

---

## Arquitectura de Componentes

1. **Diseño Atómico**:
   - **Atoms**: Componentes básicos (botones, inputs, badges) en `components/ui/`.
   - **Molecules/Organisms**: Composiciones más complejas.
2. **Colocación por Features (Feature-Based)**:
   - Los componentes específicos de una página residen en `./components` relativo a la página.
   - Los componentes globales reutilizables residen en `src/components/`.
3. **Composición Declarativa**:
   - Las páginas (`page.tsx`) deben ser puramente declarativas, enfocadas solo en la composición de componentes.
   - Extraer la lógica compleja a **Custom Hooks**.

---

## Estructura de Archivos

```
src/
├── app/
│   ├── layout.tsx              ← RootLayout global
│   ├── globals.css             ← @theme con tokens
│   ├── (dashboard)/
│   │   ├── clientes/
│   │   │   ├── page.tsx        ← Declarativo, solo composición
│   │   │   ├── hooks/          ← Lógica de la feature
│   │   │   │   └── use-clients.ts
│   │   │   └── components/     ← Componentes específicos
│   │   │       └── client-list.tsx
│   └── components/             ← Global UI components
│       ├── ui/                 ← Shadcn/Atomic components
│       └── layout/             ← Header, BottomNav, etc.
├── hooks/                      ← Global hooks
├── lib/                        ← Utils, API clients
└── types/                      ← TS Interfaces
```

---

## Custom Hooks Pattern

Los hooks personalizados deben:
- Retener toda la lógica de negocio y gestión de estado.
- Retornar objetos o arrays de configuración/datos, **NUNCA JSX**.
- Ser testeables de forma independiente.

```typescript
// Ejemplo: src/app/clientes/hooks/use-clients.ts
export function useClients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de fetching...

  return { clients, isLoading }; // Retorna datos, no UI
}
```

---

## Reglas de Componentes

1. **Single Responsibility**: Un componente debe hacer una sola cosa.
2. **Tamaño**: Si un componente supera las 200 líneas, debe ser dividido.
3. **Prop Drilling**: Evitar pasar props a través de muchos niveles; usar Context o Zustand si es necesario.
4. **Interfaces**: Definir siempre la interfaz de Props al inicio del archivo.
5. **No Duplicación**: Si un bloque de JSX se repite, extraerlo a un componente o usar un `map` con un objeto de configuración.

---

## Composición de Páginas

Cada página debe estructurarse de forma declarativa:

```tsx
// app/mi-ruta/page.tsx
import { MiContent } from "./components/mi-content";

export default function MiPage() {
  return (
    <div className="relative w-full min-h-screen">
      <main className="relative flex-1 px-4 py-6 space-y-6 pb-24 max-w-7xl mx-auto w-full">
        <MiContent />
      </main>
    </div>
  );
}
```

### Reglas de composición:
- Usar un contenedor principal `<main>` que permita contenido flexible y defina el espacio de abajo (`pb-24`) para evitar solapamiento con la navegación inferior.
- Metadatos siempre en el `page.tsx` de cada ruta.

---

## Anti-patrón: NO usar `content.tsx` como wrapper monolítico

**Decisión**: No crear un archivo `content.tsx` genérico que agrupe todo el contenido de una página. Es un indirection innecesaria que no aporta valor.

**❌ Incorrecto — wrapper vacío:**
```tsx
// page.tsx
import { NuevoPresupuestoContent } from "./components/content";

<main ...>
  <NuevoPresupuestoContent /> {/* ¿Qué hay adentro? Hay que ir a verlo */}
</main>
```

**✅ Correcto — composición directa de componentes con responsabilidad única:**
```tsx
// page.tsx
import { ClientSelector } from "./components/client-selector";
import { ConceptList } from "./components/concept-list";
import { TotalsSummary } from "./components/totals-summary";
import { NotesField } from "./components/notes-field";

<main ...>
  <ClientSelector />       {/* Sección: selector de cliente */}
  <ConceptList />          {/* Sección: lista de conceptos */}
  <TotalsSummary ... />    {/* Sección: subtotal/iva/total */}
  <NotesField />           {/* Sección: notas del presupuesto */}
</main>
```

### Estructura de componentes por feature:
```
mi-ruta/
├── page.tsx                  ← composición pura (Header + main + BottomNav)
└── components/
    ├── client-selector.tsx   ← organism: sección con su lógica propia
    ├── concept-item.tsx      ← atom: fila reutilizable
    ├── concept-list.tsx      ← organism: lista + botón añadir
    ├── totals-summary.tsx    ← molecule: acepta props de cálculo
    └── notes-field.tsx       ← atom: campo de texto
```

### Beneficios:
- La página es legible y autodocumentada.
- Cada componente tiene **responsabilidad única**.
- Los átomos son directamente reutilizables.
- Los datos se pasan como props, listos para conectar a un hook.

---

## Estados de Carga (Loading States)
Usar componentes centralizados:
- `<LoadingScreen />` para cargas de página completa.
- `<LoadingSpinner />` para cargas parciales o inline.
- **Evitar** crear JSX de carga personalizado ad-hoc.

---

## Formularios y Validación
- **React Hook Form** para la gestión del formulario.
- **Zod** para los esquemas de validación.
- Extraer campos de formulario a componentes reutilizables.
- Mantener la lógica de envío en custom hooks.

---

## Listas e Items (Generic Components)

Para mantener la consistencia en el diseño de listas, se utilizan los componentes genéricos en `src/components/ui/`.

```tsx
// Ejemplo de uso
import { ListGroup } from "@/components/ui/list-group";
import { ListItem } from "@/components/ui/list-item";

<ListGroup>
  {items.map((item) => (
    <ListItem
      key={item.id}
      icon={item.name.charAt(0)}
      title={item.name}
      subtitle={item.category}
      onClick={() => handleSelect(item)}
      trailing={<StatusBadge status={item.status} />}
    />
  ))}
</ListGroup>
```

### Reglas de Listas:
- **`ListGroup`**: Contenedor decorativo que maneja bordes, radio (`rounded-2xl`) y sombras.
- **`ListItem`**: Componente atómico para cada fila.
  - Acepta `icon`, `title`, `subtitle`, `trailing`, `onClick` y `href`.
  - Si tiene `onClick` o `href`, muestra automáticamente un chevron de navegación.
  - El "action" (onClick/href) se pasa como prop para hacerlo genérico y reutilizable.

---

## Tokens de Color y Tipografía (Tailwind v4)

**No usar colores arbitrarios.** Solo tokens de `globals.css`:

| Token | Uso |
|---|---|
| `text-primary` | Títulos, acciones, destacados |
| `text-on-surface` | Cuerpo sobre fondo claro |
| `text-on-surface-variant` | Secundario, labels, metadatos |
| `bg-surface` | Fondo de cards y listas |
| `border-outline-variant/10` | Bordes sutiles |

### Tipografía sugerida:
- `font-headline-large-mobile` para títulos principales.
- `font-semibold` para nombres de entidad.
- `text-xs` para subtextos.

---

## Iconos (Lucide React)
- Tamaño estándar: `w-5 h-5` o `w-6 h-6`.
- Tamaño en headers: `w-8 h-8`.
- `strokeWidth`: `1.5` en headers; `2` o `2.5` en acciones.

---

## Commits
Usar `gcommit` para mensajes en formato **Conventional Commits**.
- `gcommit` → uno por archivo.
- `gcommit -iq` → agrupar archivos relacionados.

---

## Interacciones de Botones (Loading States)
**Regla**: Toda acción de un botón que requiera procesamiento (ej. guardar, enviar), excepto abrir modales, **DEBE** mostrar un estado de carga (un spinner girando o texto "Procesando...") dentro del mismo botón. Este estado finaliza cuando ocurre el `onSuccess` o al terminar la promesa. No bloquear la UI general si no es estrictamente necesario, el feedback se concentra en el botón.
