# Information Architecture: Nuevo Presupuesto

## Site Map

- Nuevo Presupuesto `/presupuestos/nuevo`
  - Paso 1: Configuración
    - Título del Documento
    - Selector de Cliente
    - Selector de Proyecto
  - Paso 2: Conceptos y Totales
    - Lista de Conceptos
    - Formulario de Concepto (Inline/Modal)
    - Resumen de Totales
    - Campo de Notas

## Navigation Model

- **Primary navigation**: Stepper (Step 1 / Step 2) with "Continuar" and "Volver" actions.
- **Secondary navigation**: Internal tabs or modals for adding clients/projects/concepts.
- **Utility navigation**: "Cancelar" (Return to root or previous context) and "Guardar" (Final action).
- **Mobile navigation**: Fixed bottom action bar for primary flow control.

## Content Hierarchy

### Paso 1: Configuración
1. **Título del Documento** -- Define el propósito inmediato del archivo.
2. **Cliente** -- Identifica el destinatario legal/comercial.
3. **Proyecto** -- Contexto opcional para agrupación.

### Paso 2: Conceptos y Totales
1. **Lista de Conceptos** -- El cuerpo principal y la razón de ser del documento.
2. **Totales Summary** -- El resultado financiero, debe ser siempre visible o fácilmente accesible.
3. **Notas** -- Información aclaratoria de baja prioridad.

## User Flows

### Crear Presupuesto
1. El usuario entra en `/presupuestos/nuevo`.
2. El usuario define el **Título** (Paso 1).
3. El usuario selecciona o crea un **Cliente** (Paso 1).
4. El usuario avanza al Paso 2.
5. El usuario añade uno o más **Conceptos** con cantidad y precio.
6. El usuario revisa los **Totales**.
7. El usuario añade **Notas** finales.
8. El usuario **Guarda** el presupuesto.

## Naming Conventions

| Concept | Label in UI | Notes |
|---------|-------------|-------|
| Document Title | Título | Corto y descriptivo |
| Recipient | Cliente | Término comercial estándar |
| Context | Campaña / Proyecto | Agrupador de trabajos |
| Line Item | Concepto | Ítem de cobro |
| Final amount | Total | Monto neto final |

## Component Reuse Map

| Component | Used on | Behavior |
|-----------|---------|----------|
| `BudgetIdentity` | Step 1 | Form containers for client/project |
| `ConceptList` | Step 2 | Scrollable list of items |
| `TotalsSummary` | Step 2 | Calculation display |
| `ActionBar` | Global Step | Fixed bottom navigation |
