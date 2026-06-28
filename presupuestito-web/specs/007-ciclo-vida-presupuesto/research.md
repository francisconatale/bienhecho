# Research: Ciclo de Vida del Presupuesto

## Overview

No se identificaron marcadores [NEEDS CLARIFICATION] en el spec. Todas las decisiones
se tomaron con base en la discusión con el usuario y el contexto del proyecto.

## Decisiones confirmadas

### 1. Modelo de estados

| Decisión | Valor |
|----------|-------|
| **Elegido** | 3 estados: `borrador` → `presupuestado` → `pagado` |
| **Alternativas** | Mantener 5 estados actuales (rechazado: demasiada complejidad para flujo simple) |
| **Justificación** | El usuario quiere un ciclo simple: crear → presupuestar → cobrar. Los datos operativos (visitas, progreso) siguen existiendo internamente |

### 2. Diálogo post-generación de PDF

| Decisión | Valor |
|----------|-------|
| **Elegido** | Diálogo modal con 2 opciones: "Emitir presupuesto" y "Solo guardar PDF" |
| **Justificación** | Punto de decisión natural. El usuario decide si el presupuesto es formal (cambia estado) o solo una descarga. La agenda (organizar visitas) queda para otro scope |

### 3. Transición a pagado

| Decisión | Valor |
|----------|-------|
| **Elegido** | Manual (botón "Marcar como pagado") + sugerencia automática cuando cobros cubren el total |
| **Justificación** | El usuario debe confirmar explícitamente. La sugerencia automática es un helper, no una transición automática |

### 4. Migración de estados existentes

No aplica. Trabajamos con mocks, no hay datos legacy que migrar.
