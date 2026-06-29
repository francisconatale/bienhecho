<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/009-dashboard-operativo-tareas/plan.md

Design artifacts (Phase 1) available at:
- specs/009-dashboard-operativo-tareas/research.md (Phase 0)
- specs/009-dashboard-operativo-tareas/data-model.md (Phase 1)
- specs/009-dashboard-operativo-tareas/contracts/store-interface.md (Phase 1)
- specs/009-dashboard-operativo-tareas/quickstart.md (Phase 1)
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

## Regla: Cursor en Campos Read-Only
Cuando agregues un campo que muestra datos en modo **solo lectura** (un `<span>`, `<p>`, `<div>` sin `onClick` ni `href`), DEBES agregar `cursor-default select-none` para evitar que el navegador muestre el cursor de texto (`text`) o de interacción fantasma.

**Bueno (read-only):**
```tsx
<span className="text-sm font-semibold text-on-surface cursor-default select-none">
  {client.telefono}
</span>
```

**Malo (cursor raro):**
```tsx
<span className="text-sm font-semibold text-on-surface">
  {client.telefono}
</span>
```

Elementos **interactivos** (botones, links, `onClick`) usan `cursor-pointer` explícito.
`<button>` y `<a>` ya tienen `cursor: pointer` por defecto en navegadores, pero en `<div>` con `onClick` hay que agregarlo.

## Regla: Auto-Commit en Flujo Spec Kit
Cuando estés trabajando dentro del flujo speckit (specify → plan → tasks → implement), los hooks `after_specify`, `after_plan`, `after_tasks` y `after_implement` ejecutan auto-commits automáticos con mensaje `chore(save): auto-save after <step>`. Esto preserva AGENTS.md y otros archivos de contexto cuando la ventana de contexto se pierde.
No preguntes por estos commits, son automáticos. Solo aplica la regla de preguntar para commits manuales fuera del flujo speckit.

## Regla: Layout Master-Detail (Desktop vs Mobile)
Para páginas como Clientes o vistas duales (lista interactiva + detalle):
- **Desktop:** Conservar la estructura "Master-Detail" tipo app. El panel de la lista debe quedar anclado a la izquierda ocupando toda la altura (usualmente con `grid-cols-[360px_1fr]` y `min-h-0`), sin que el scroll sea de toda la página. La lista en este formato se mantiene contigua (ítems con borde inferior).
- **Mobile (Raíz de la lista):** 
  - Se debe utilizar el componente `<PageHeader />` para el título principal, envolviéndolo en un contenedor solo visible en mobile. 
  - La lista abandona el formato contiguo para usar **separación entre ítems** (ej. `space-y-3`), renderizando cada elemento como una **Card flotante e independiente** con estilo Premium (Aurora + Glassmorphism).
- **Mobile (Vista de Detalle):** Cuando se selecciona un ítem para visualizar o editar (pasando al Detail Pane), se DEBE **ocultar completamente** el `<PageHeader />` y cualquier barra de búsqueda superior general (`hidden` condicional en mobile). La vista de detalle debe ocupar el 100% de la pantalla (full-screen inmersivo) con un botón de "Volver" dedicado.

## Regla: Documentación Post-Implement (.specify)
Al finalizar la etapa `implement` del flujo `.specify` (es decir, en el post-implement), **es estrictamente obligatorio** agregar la documentación de los cambios realizados al archivo principal de documentación (`/home/francisco/Software/presupuestito/index.html`). 
Debes actualizar las secciones relevantes (base de datos, arquitectura, flujos o definiciones) antes de dar por terminada la tarea para asegurar que el HTML de referencia nunca quede desactualizado con respecto al código.

## Regla: Subtablas para Enumerados (Enums) en Documentación
Al documentar modelos de datos o bases de datos (tanto en `database_relations.md` como en `index.html`), **SIEMPRE** que un campo represente un conjunto de valores limitados (enumerado, estado, tipo, prioridad, etc.), debes:
1. Declarar su tipo como `enum` (ej. `<span class="badge badge-type">enum</span>`) en lugar de usar tipos genéricos como `string`.
2. Crear inmediatamente debajo de la tabla principal una **subtabla dedicada** (ej. `<h4>Enum: Nombre del Campo</h4>`) detallando en columnas cada valor posible y su descripción semántica de negocio.
Nunca documentes los valores de un enumerado simplemente como un texto o lista suelta si no es el formato preexistente; haz siempre la subtabla.
