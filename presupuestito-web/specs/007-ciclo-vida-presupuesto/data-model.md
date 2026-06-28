# Data Model: Ciclo de Vida del Presupuesto

> Basado en el spec y `database_relations.md`. Cambios solo en el modelo de estados
> y tipos. La estructura de tablas permanece igual.

## Estado de Trabajo (`JobStatus`)

### Antes

```typescript
type JobStatus = "presupuestado" | "en_curso" | "listo_para_facturar" | "facturado" | "cobrado";
```

### Después

```typescript
type JobStatus = "borrador" | "presupuestado" | "pagado";
```

### Transiciones permitidas

```
BORRADOR ──(generar PDF y confirmar diálogo)──▶ PRESUPUESTADO
PRESUPUESTADO ──(marcar como pagado manual o por sugerencia)──▶ PAGADO
PAGADO ──(solo con confirmación explícita)──▶ PRESUPUESTADO
```

- `borrador` → `presupuestado`: Al generar PDF y elegir "Emitir presupuesto" en el diálogo
- `presupuestado` → `pagado`: Automático cuando `sum(cobros) >= total`, o manual con botón
- `pagado` es **terminal**. Cualquier modificación requiere advertencia y confirmación

### Reglas por estado

| Estado | ¿Editable? | ¿Generar PDF? | ¿Registrar cobros? | ¿Agregar tareas? |
|--------|-----------|---------------|-------------------|-------------------|
| `borrador` | Sí | Sí | No | Sí |
| `presupuestado` | Sí | Sí | Sí | Sí |
| `pagado` | Con advertencia | No | No | No |
