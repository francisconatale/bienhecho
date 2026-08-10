# Quickstart: Persistir totales de cuentas a cobrar

**Feature**: `011-persistir-totales-cobros` | **Date**: 2026-08-10

Guía de validación end-to-end. Detalles de datos en [data-model.md](data-model.md) y decisiones en [research.md](research.md).

## Prerrequisitos

- Repo: `presupuestito-web/`
- Supabase CLI configurado y base local/remota accesible (`supabase status` o credenciales en `.env.local`)
- App corriendo: `npm run dev`

## 1. Aplicar la migración

```bash
supabase db push    # aplica supabase/migrations/20260810100000_persistir_totales_cobros.sql
```

## 2. Validar backfill y columnas

```sql
-- Todos los trabajos deben tener total_estimado = presupuesto + materiales,
-- y saldo_pendiente = total_estimado - total_cobrado
SELECT
  t.id, t.presupuesto, t.total_estimado, t.total_cobrado, t.saldo_pendiente,
  COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id = t.id),0) AS suma_tareas,
  COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id = t.id),0) AS suma_materiales,
  COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id = t.id),0) AS suma_cobros
FROM public.trabajos t
WHERE t.total_estimado <> (COALESCE((SELECT SUM(precio) FROM public.tareas WHERE trabajo_id=t.id),0)
                         + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0))
   OR t.saldo_pendiente <> (COALESCE((SELECT SUM(precio) FROM public.tareas WHERE trabajo_id=t.id),0)
                          + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0)
                          - COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id=t.id),0));
-- Resultado esperado: 0 filas
```

## 3. Escenario: sin recálculo en runtime (US1)

1. Abrir un trabajo en `/trabajos/[id]` y la vista `?view=pagos`.
2. Anotar total estimado, total cobrado y saldo pendiente.
3. Recargar la página (sin tocar datos).
4. **Esperado**: los tres montos quedan idénticos y la sidebar coincide con el panel Cuentas a Cobrar.

## 4. Escenario: cambios de tareas y materiales (US2)

1. En un trabajo `presupuestado`, editar el precio de una tarea.
2. **Esperado**: `trabajos.total_estimado` y `saldo_pendiente` se actualizan (verificar en SQL o en la UI tras refetch).
3. Agregar un material con `cantidad=2` y `precio_unitario=500`.
4. **Esperado**: `materiales.subtotal` queda `1000` (trigger BEFORE) y `total_estimado` sube 1000.

## 5. Escenario: auto-paso a pagado (US2/US3)

1. En un trabajo `presupuestado` con saldo S, registrar cobros hasta cubrir S.
2. **Esperado**: `trabajos.saldo_pendiente = 0` y `estado = 'pagado'` automáticamente.

## 6. Escenario: edición de cobro (US3)

1. Registrar un cobro de $100 y anotar el `id` del abono en `transacciones`.
2. Editar el cobro a $150.
3. **Esperado**: el `abono` con `referencia_cobro_id = <id>` pasa a monto 150 y `trabajos.total_cobrado` queda consistente.

## 7. Escenario: borrado de cobro con auditoría (US3)

```sql
-- Antes de borrar
SELECT tipo, monto, concepto FROM public.transacciones
WHERE referencia_cobro_id = '<cobro_id>' ORDER BY created_at;
```

1. Eliminar el cobro desde la UI (panel Cuentas a Cobrar).
2. **Esperado**:
   - `trabajos.total_cobrado` baja el monto eliminado.
   - En `transacciones` quedan el `abono` original + un `cargo` con concepto `Anulación de cobro: <título>` y el mismo monto (saldo neto sin cambio).

## 8. Verificación de consistencia del frontend (US4)

1. Abrir el mismo trabajo desde `/trabajos/[id]` y desde el detalle de cliente.
2. **Esperado**: total estimado y "Debe X" coinciden en ambas vistas.

## Resultado esperado global

- Cero filas inconsistentes en la query del paso 2.
- Sin divergencia entre sidebar / Cuentas a Cobrar / detalle de cliente.
- Cuenta corriente neta consistente tras editar/borrar cobros.
