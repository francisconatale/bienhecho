<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/004-paginacion-universal/spec.md
<!-- SPECKIT END -->

## Regla: TODO.md

El archivo `TODO.md` en la raíz del proyecto es la lista de tareas e ideas
del usuario. Cuando el usuario pida "procesar el TODO" o "ver las tareas
pendientes", leer ese archivo y trabajar sobre los ítems del Backlog.

**Formato de ítems:**
```
- [ ] Descripción de la tarea
- [ ] (Prioridad alta) Descripción urgente
```

Cuando un íterm se complete, moverlo a la sección "Completados" y marcar `[x]`.

**NUNCA** borrar ítems completados sin que el usuario lo pida.

## Regla: database_relations.md

Antes de implementar CUALQUIER cambio en el frontend que toque datos
del backend (CRUD, consultas, joins, estados, flujos), DEBES:

1. Leer `database_relations.md` en la raíz del proyecto.
2. Respetar estrictamente la estructura, nombres de campos,
   tipos, relaciones y reglas de negocio definidas ahí.
3. Si el cambio implica modificar la base de datos, primero
   actualizar `database_relations.md` y luego aplicar la migración.

**NUNCA** inferir nombres de tablas, campos o relaciones de memoria.
**SIEMPRE** consultar el archivo.

## Regla: Frontend y Decisiones de Diseño

**Condición de activación:** ESTA REGLA SOLO APLICA cuando estemos hablando de frontend y se estén tomando decisiones de diseño, UI/UX, layouts o estilos.

Antes de implementar cambios bajo estas condiciones, DEBES:

1. Leer `DESIGN_MEMORY.md` en la raíz del proyecto.
2. Respetar los patrones, componentes del sistema, tokens de color,
   reglas de spacing y decisiones de diseño documentadas ahí.
3. Para el design system completo, leer `design-system/MASTER.md`.
4. Para reglas de spacing y densidad, leer obligatoriamente `src/SPACING-GUIDELINES.md`.
5. Para decisiones de peso, tamaño y jerarquía de información, leer `jerarquia-visual.md` en la raíz del proyecto. Estas reglas de densidad son mandatorias.
6. **Identidad de Páginas Principales y Vistas de Detalle**: En páginas principales de entidades (como Clientes) y vistas de detalle (Trabajos, Tareas), se **DEBE** usar el patrón "Premium (Aurora + Glassmorphism)":
   - **Fondo Aurora + Noise**: Incorporar el overlay de `noise.svg` (mix-blend-overlay) y contenedores `absolute pointer-events-none` con manchas radiales difuminadas para dar profundidad, en lugar de un fondo sólido.
   - **Header Dividido por Breakpoint**: El `<Header />` genérico **solo** se renderiza en mobile (`<div className="md:hidden"><Header ... /></div>`). En desktop, se oculta y en su lugar la navegación (breadcrumbs, buscador) y las acciones se componen nativamente dentro del `<main>`, usando layouts anchos sin estirarse.
   - **Superficies Glassmorphic**: En lugar de contenedores sólidos (`bg-surface`), los paneles usan `bg-surface/30 dark:bg-surface/10 backdrop-blur-2xl rounded-[28px]` con bordes y sombras coloreadas sutiles.
   - **Composición de Layout**: **NUNCA** envolver la página entera en un componente cliente monolítico (anti-patrón `content.tsx`). El layout principal (`grid`, master-detail, breadcrumbs) se arma directamente en el `page.tsx`, importando componentes atómicos o funcionales pequeños.

Al terminar una sesión de desarrollo donde se tomó alguna decisión
de diseño relevante, **agregar una entrada en el log cronológico**
de `DESIGN_MEMORY.md` con fecha y descripción de la decisión.

**Antipatrón principal a evitar:** "Mobile-Stretched en Desktop".
Ver sección específica en `DESIGN_MEMORY.md` y `design-system/MASTER.md`.

## Regla: Design Lab Route
Cuando se use la skill `design-lab` en Next.js, asegurar siempre de crear los archivos del lab de manera que el acceso en el navegador sea mediante la ruta `/design-lab` (ej: `src/app/design-lab/page.tsx`), NO `__design_lab`.

## Regla: Edición In-Place (Stripe-like)
Para la edición de detalles de entidades principales (como cabeceras de Trabajo, Cliente, etc.), **evitar** los formularios modales o componentes pesados que rompan la jerarquía visual de la página.
- **Patrón a seguir:** Modo de visualización "read-only" de forma predeterminada con un disparador (ej. ícono de lápiz en hover). Al activar la edición, transformar los campos de texto directamente en `inputs` de forma in-place (estilo "Stripe", border-bottom sutil) manteniendo exactamente la misma disposición y espaciado.

## Regla: Redesign & Estética Premium (Actualizado)
En todas las nuevas implementaciones o refactors visuales, se debe abandonar el diseño "plano" o genérico ("AI-look") a favor de una interfaz profunda, táctil y asimétrica:
1. **Superficies (Glassmorphism):** Evitar las tarjetas sólidas (`bg-surface`). Utilizar fondos translúcidos (`bg-surface/30`), `backdrop-blur-xl` o `2xl`, y sombras coloreadas en lugar de sombras negras genéricas.
2. **Listas y Agrupación:** Evitar el componente estricto genérico `<ListGroup>` con `divide-y` si la lista requiere destacar. Preferir listas flotantes con espaciado (`space-y-3` o `4`) donde cada ítem tenga su propia tarjeta Glassmorphic e ingrese con animaciones escalonadas (`staggered entry`).
3. **Motion y Físicas:** Todo elemento interactivo (botones, checkboxes) debe responder con transformaciones reales (ej. `active:scale-95`, `hover:-translate-y-0.5`). 
4. **Texturas:** Para evitar la esterilidad digital, utilizar overlays de ruido (`noise.svg` con `mix-blend-overlay` al 3% - 6% de opacidad) en páginas de detalle o fondos extensos.

## Regla: Commits al Finalizar Tareas
Al dar por finalizada la asistencia en una tarea o flujo de trabajo solicitado por el usuario, DEBES preguntar explícitamente si desea que ejecutes un commit con los cambios realizados.
No debes commitear automáticamente; siempre espera la confirmación del usuario para evitar registrar código con el que no esté conforme. Si el usuario aprueba, crea el commit describiendo de forma clara (siguiendo Conventional Commits) el trabajo que completaste en esa sesión.
