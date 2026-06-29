# Plan de Refactorizacion: Feature TRABAJOS

## 1. Diagnostico

### Inventario completo (30 archivos)

**Paginas Next.js (7):**
- `src/app/trabajos/page.tsx` (19 loc) — wrapper server con Suspense
- `src/app/trabajos/nuevo/page.tsx` (353 loc) — wizard paso a paso de creacion
- `src/app/trabajos/[id]/page.tsx` (17 loc) — deep-link wrapper server
- `src/app/trabajos/[id]/materiales/page.tsx` (80 loc) — vista dedicada materiales
- `src/app/trabajos/[id]/materiales/navigation.ts` (14 loc) — logica back-URL
- `src/app/trabajos/[id]/materiales/get-back-url.test.ts` (39 loc) — test de navigation.ts
- `src/app/trabajos/[id]/pagos/page.tsx` (65 loc) — vista dedicada pagos

**Componentes root (2):**
- `src/app/trabajos/components/job-list.tsx` (195 loc)
- `src/app/trabajos/components/trabajo-detail.tsx` (419 loc) — MONOLITO

**Componentes `[id]/components/` (14):**
- `job-header.tsx` (228) — cabecera con edicion in-place
- `job-status.tsx` (123) — selector de estado dropdown
- `progress-bar.tsx` (45) — barra de progreso tareas
- `task-list.tsx` (92) — lista paginada de tareas
- `task-item.tsx` (125) — item individual de tarea
- `task-form.tsx` (97) — formulario crear/editar tarea
- `task-detail-panel.tsx` (232) — panel detallado de tarea
- `task-photos.tsx` (270) — galeria de fotos por tarea
- `photo-upload.tsx` (127) — formulario subida de foto
- `material-form.tsx` (112) — formulario crear/editar material
- `material-item.tsx` (109) — item individual de material
- `material-list.tsx` (87) — lista paginada de materiales
- `payments-dashboard.tsx` (121) — dashboard de cobros
- `cobro-form.tsx` (127) — formulario crear/editar cobro

**Hooks (2 + 1 global):**
- `[id]/hooks/use-materials.ts` (59) — schema Zod + CRUD materiales
- `[id]/hooks/use-payments.ts` (122) — schema Zod + CRUD cobros + auto-paid
- `src/hooks/use-budget-pdf.tsx` (47) — generacion PDF presupuesto

### Dependencia externa critica

`src/app/tareas/[id]/page.tsx` importa `TaskDetailPanel` desde la feature de trabajos. Tras la migracion este import apuntara a `@/features/trabajos/components/tasks/task-detail-panel`.

### Causa raiz del monolito (419 lineas)

`trabajo-detail.tsx` concentra 7 responsabilidades en un solo componente React:

| Bloque de lineas | Responsabilidad | Lineas |
|---|---|---|
| 141-155 | Aurora background (noise overlay + blur blobs) | ~15 |
| 134-135, 157-167, 211-228 | Navegacion (MobilePageHeader + breadcrumb desktop) | ~35 |
| 39-52 | Sincronizacion estado edicion header con parent | ~14 |
| 171-179, 201-208 | Overlay mobile para TaskDetailPanel | ~15 |
| 232-277 | Cards link a materiales y pagos | ~46 |
| 284-380 | Sidebar presupuesto (totales + botones PDF + marcar pagado) | ~97 |
| 385-416 | Modal dialogo PDF (emitir vs guardar) | ~32 |
| 89-133 | Logica PDF (estado + handlers + transaccion) | ~45 |
| 54-69 | Deep-link de tarea via query param | ~16 |

---

## 2. Estructura Objetivo

```
src/features/trabajos/
  types.ts
  store.ts
  hooks/
    use-materials.ts
    use-payments.ts
    use-budget-pdf.ts
    use-job-detail.ts        ← NUEVO
    use-job-pdf-dialog.ts    ← NUEVO
  components/
    trabajo-detail.tsx        ← ORQUESTADOR LIVIANO
    job-list.tsx
    detail/
      aurora-background.tsx   ← NUEVO
      job-breadcrumb.tsx      ← NUEVO
      pdf-dialog.tsx          ← NUEVO
      sidebar-budget.tsx      ← NUEVO
      materials-card.tsx      ← NUEVO
      payments-card.tsx       ← NUEVO
      task-overlay.tsx        ← NUEVO
    job-header.tsx
    job-status.tsx
    progress-bar.tsx
    tasks/
      task-list.tsx
      task-item.tsx
      task-form.tsx
      task-detail-panel.tsx
      task-photos.tsx
      photo-upload.tsx
    materials/
      material-form.tsx
      material-item.tsx
      material-list.tsx
    payments/
      payments-dashboard.tsx
      cobro-form.tsx
```

Las paginas Next.js en `src/app/trabajos/` quedan como wrappers delgados.

---

## 3. Descomposicion de trabajo-detail.tsx

### 3.1 Componente `aurora-background.tsx` (~15 lineas JSX)

Extrae las lineas 141-155. Componente puro sin props dinamicas, solo `variant` opcional para light/dark.

```tsx
// Ejemplo de interfaz
interface AuroraBackgroundProps {
  className?: string;
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  // noise.svg overlay + 4 blur blobs
  // Mix-blend-overlay, pointer-events-none
}
```

### 3.2 Componente `job-breadcrumb.tsx` (~30 lineas)

Consolida la logica de back-URL (lineas 134-135) y el breadcrumb desktop (lineas 212-228). Tambien reemplaza el `MobilePageHeader` que estaba inline.

Props necesarias:
- `backLabel: string`
- `backDest: string`
- `onBack: () => void`
- `isEditing: boolean`
- `hasChanges: boolean`
- `onEditStart?: () => void`
- `onCancel: () => void`
- `onSave: () => void`

### 3.3 Componente `pdf-dialog.tsx` (~35 lineas)

Modal con las dos acciones de PDF. Props:
- `isOpen: boolean`
- `onClose: () => void`
- `onSaveOnly: () => void`
- `onEmit: () => void`

Extraido de las lineas 385-416.

### 3.4 Componente `sidebar-budget.tsx` (~95 lineas)

Panel sticky derecho. Absorbe las lineas 284-380. Props necesarias:
- `job: Job`
- `jobTasks: Task[]`
- `totalMateriales: number`
- `presupuestoTotal: number`
- `saldoPendiente: number`
- `hasItemsForBudget: boolean`
- `isGeneratingPdf: boolean`
- `pdfError: string | null`
- `onDownloadPDF: () => void`

Este componente encapsula el boton "Generar Presupuesto" (estado borrador), "Ver PDF" (estado presupuestado/pagado), y "Marcar como Pagado".

### 3.5 Componentes `materials-card.tsx` y `payments-card.tsx` (~25 lineas cada uno)

Las dos cards-link que muestran totales. Componentes simples de presentacion.

Props para MaterialsCard:
- `jobId: string`
- `totalMateriales: number`
- `cantidadItems: number`

Props para PaymentsCard:
- `jobId: string`
- `saldoPendiente: number`

### 3.6 Componente `task-overlay.tsx` (~15 lineas)

Wrapper mobile full-screen que contiene TaskDetailPanel. Props:
- `jobId: string`
- `taskId: string`
- `onBack: () => void`

### 3.7 Hook `use-job-detail.ts` (~55 lineas)

Consolida toda la logica de orquestacion que hoy esta en el cuerpo del componente:

```ts
interface UseJobDetailReturn {
  job: Job | null;
  client: Client | undefined;
  jobTasks: Task[];
  totalEstimado: number;
  totalMateriales: number;
  saldoPendiente: number;
  presupuestoTotal: number;
  hasTasksWithPrice: boolean;
  hasItemsForBudget: boolean;
  backLabel: string;
  backDest: string;
  router: ReturnType<typeof useRouter>;
  pushHistory: (path: string) => string;
  popHistory: (fallback: string) => string;
}

export function useJobDetail(id: string): UseJobDetailReturn;
```

Este hook reemplaza: lineas 35-37, 54-69, 71-88 del componente actual.

### 3.8 Hook `use-job-pdf-dialog.ts` (~50 lineas)

Agrupa el manejo de estado y efectos del PDF que hoy estan dispersos en lineas 38-43 y 89-133:

```ts
interface UseJobPdfDialogReturn {
  showPdfDialog: boolean;
  setShowPdfDialog: (v: boolean) => void;
  isGeneratingPdf: boolean;
  pdfError: string | null;
  handleDownloadPDF: () => void;
  handleEmitPresupuesto: () => void;
  handleGuardarPdf: () => void;
}

export function useJobPdfDialog(job: Job): UseJobPdfDialogReturn;
```

---

## 4. Tipos y Store

### 4.1 `types.ts`

No duplica tipos existentes. Re-exporta los que necesita y define tipos derivados:

```ts
export type { Job, JobStatus, Task, TaskPhoto, Material, Cobro } from "@/types";
export type { MaterialFormValues } from "./hooks/use-materials";
export type { CobroFormValues } from "./hooks/use-payments";

// Tipos nuevos derivados
export interface BudgetSummary {
  totalTareas: number;
  totalMateriales: number;
  presupuestoTotal: number;
  saldoPendiente: number;
}
```

### 4.2 `store.ts`

Selectores reutilizables que eliminan el patron repetido de `useDataStore` + `.filter`:

```ts
import { useDataStore } from "@/lib/store";

// Selectores memoizados
export const useJobById = (id: string) =>
  useDataStore(s => s.jobs.find(j => j.id === id));

export const useTasksByJob = (id: string) =>
  useDataStore(s => s.tasks.filter(t => t.trabajo_id === id));

// Wrappers tipados de acciones del store
export const useJobActions = () =>
  useDataStore(s => ({
    updateJob: s.updateJob,
    addJob: s.addJob,
    removeJob: s.removeJob,
  }));
```

---

## 5. Orden de Ejecucion Seguro

### Fase 1: Preparacion (sin romper nada)

| Paso | Accion | Riesgo |
|---|---|---|
| 1.1 | Crear `src/features/trabajos/` con subdirectorios vacios | Ninguno |
| 1.2 | Crear `types.ts` re-exportando desde `@/types` | Ninguno |
| 1.3 | Crear `store.ts` con selectores | Ninguno |

### Fase 2: Migracion de hooks (copia + actualizacion de imports)

| Paso | Accion | Notas |
|---|---|---|
| 2.1 | Copiar `use-materials.ts` a `features/trabajos/hooks/` | Actualizar imports internos |
| 2.2 | Copiar `use-payments.ts` a `features/trabajos/hooks/` | Actualizar imports internos |
| 2.3 | Copiar `use-budget-pdf.tsx` a `features/trabajos/hooks/` | Cambiar `@/lib/pdf/generate-budget` a import relativo |
| 2.4 | Verificar que tests existentes siguen pasando | `get-back-url.test.ts` no depende de hooks |

### Fase 3: Migracion de componentes atomicos (hojas del arbol)

Migrar de afuera hacia adentro, empezando por componentes sin dependencias internas:

| Paso | Componente | Dependencias internas |
|---|---|---|
| 3.1 | `progress-bar.tsx` | Solo `@/types` |
| 3.2 | `task-form.tsx` | Solo `@/lib/utils` |
| 3.3 | `photo-upload.tsx` | Solo `@/lib/utils` |
| 3.4 | `cobro-form.tsx` | `use-payments` (ya migrado) |
| 3.5 | `material-form.tsx` | `use-materials` (ya migrado) |
| 3.6 | `job-status.tsx` | Solo `@/lib/store` y `@/types` |
| 3.7 | `job-header.tsx` | `use-click-outside` (global, sin cambio) |
| 3.8 | `material-item.tsx` | `use-materials`, `material-form` |
| 3.9 | `task-item.tsx` | `task-form` |
| 3.10 | `material-list.tsx` | `use-materials`, `material-item`, `material-form` |
| 3.11 | `task-list.tsx` | `task-item`, `task-form` |
| 3.12 | `payments-dashboard.tsx` | `use-payments`, `cobro-form` |
| 3.13 | `task-photos.tsx` | `photo-upload` |
| 3.14 | `task-detail-panel.tsx` | `task-photos`, `use-click-outside` |

### Fase 4: Descomponer trabajo-detail.tsx

| Paso | Accion |
|---|---|
| 4.1 | Crear los 5 hooks nuevos (`use-job-detail`, `use-job-pdf-dialog`) y los 7 sub-componentes en `detail/` |
| 4.2 | Reescribir `trabajo-detail.tsx` como orquestador que compone los sub-componentes |
| 4.3 | Verificar que el componente resultante tiene ~120 lineas en vez de 419 |

### Fase 5: Migrar componentes root y job-list

| Paso | Accion |
|---|---|
| 5.1 | Migrar `job-list.tsx` a `features/trabajos/components/` |
| 5.2 | Actualizar imports en `job-list.tsx` para apuntar a la feature |

### Fase 6: Migrar las paginas como wrappers

| Paso | Accion |
|---|---|
| 6.1 | Actualizar `src/app/trabajos/page.tsx` para importar desde feature |
| 6.2 | Actualizar `src/app/trabajos/[id]/page.tsx` para importar desde feature |
| 6.3 | Actualizar `src/app/trabajos/[id]/materiales/page.tsx` para importar desde feature |
| 6.4 | Actualizar `src/app/trabajos/[id]/pagos/page.tsx` para importar desde feature |
| 6.5 | Actualizar `src/app/trabajos/nuevo/page.tsx` para importar desde feature |
| 6.6 | Actualizar `src/app/tareas/[id]/page.tsx` (consumidor externo de `TaskDetailPanel`) |

### Fase 7: Limpieza

| Paso | Accion |
|---|---|
| 7.1 | Eliminar `src/app/trabajos/[id]/components/` (14 archivos movidos) |
| 7.2 | Eliminar `src/app/trabajos/[id]/hooks/` (2 archivos movidos) |
| 7.3 | Eliminar `src/app/trabajos/components/` (2 archivos movidos) |
| 7.4 | Eliminar `src/hooks/use-budget-pdf.tsx` (movido a feature) |
| 7.5 | Mover test `get-back-url.test.ts` junto a su modulo en la feature |
| 7.6 | Ejecutar `npx tsc --noEmit` para verificar que no hay rotos de imports |
| 7.7 | Ejecutar tests existentes |

---

## 6. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Imports rotos tras reubicacion | Alto | Ejecutar `tsc --noEmit` despues de cada fase |
| `TaskDetailPanel` compartido con `/tareas` | Alto | Fase 6.6 actualiza el import externo ANTES de eliminar originales |
| `job-list.tsx` usa `document.querySelector` para comunicar con `JobHeader` | Medio | Mantener el patron existente en la migracion; refactorizar en fase posterior |
| Tests de navigation.ts | Bajo | El test importa desde ruta relativa; actualizar la ruta de import |
| `MaterialFormValues` y `CobroFormValues` viven en hooks | Bajo | Re-exportar desde `types.ts` para centralizar |

---

## 7. Metricas de Exito

| Metrica | Antes | Despues |
|---|---|---|
| Lineas en trabajo-detail.tsx | 419 | ~120 |
| Archivos en `[id]/components/` | 14 (carpeta dispersa) | 0 (eliminada) |
| Imports cruzados tipo `../[id]/hooks` | 5 | 0 |
| Hook global feature-specific | 1 en `src/hooks/` | 0 (dentro de feature) |
| Componente compartido con import largo | 1 (`@/app/trabajos/[id]/components/...`) | 1 (`@/features/trabajos/...`) pero mas corto y limpio |
