# Data Model: Persistir totales de cuentas a cobrar

**Feature**: `011-persistir-totales-cobros` | **Date**: 2026-08-10

## Cambio de modelo

### `trabajos` (columnas nuevas)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `total_estimado` | numeric(10,2) | no (default 0) | Suma de precios de tareas + subtotales de materiales. Fuente de verdad del total mostrado. |
| `total_cobrado` | numeric(10,2) | no (default 0) | Suma de `cobros.monto_cobrado` del trabajo. |
| `saldo_pendiente` | numeric(10,2) | no (default 0) | `total_estimado - total_cobrado`. Admite negativos (caso "A favor"). |

Todas son agregados mantenidos **únicamente** por triggers. El frontend las lee, no las escribe.

## Funciones y triggers

### 1. `recalcular_trabajo_totales()` — trigger function

Reemplaza a `update_trabajo_presupuesto()` y `check_trabajo_pagado()`.

```sql
CREATE OR REPLACE FUNCTION public.recalcular_trabajo_totales()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_id uuid;
  v_presupuesto numeric(10,2);
  v_materiales  numeric(10,2);
  v_cobrado     numeric(10,2);
  v_estado      public.job_status;
BEGIN
  v_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.trabajo_id ELSE NEW.trabajo_id END;
  IF v_id IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;

  SELECT COALESCE(SUM(precio), 0)     INTO v_presupuesto FROM public.tareas     WHERE trabajo_id = v_id;
  SELECT COALESCE(SUM(subtotal), 0)   INTO v_materiales  FROM public.materiales WHERE trabajo_id = v_id;
  SELECT COALESCE(SUM(monto_cobrado), 0) INTO v_cobrado  FROM public.cobros     WHERE trabajo_id = v_id;

  SELECT estado INTO v_estado FROM public.trabajos WHERE id = v_id;

  UPDATE public.trabajos SET
    presupuesto     = v_presupuesto,
    total_estimado  = v_presupuesto + v_materiales,
    total_cobrado   = v_cobrado,
    saldo_pendiente = (v_presupuesto + v_materiales) - v_cobrado,
    estado = CASE
      WHEN v_estado = 'presupuestado'
       AND (v_presupuesto + v_materiales) - v_cobrado <= 0
      THEN 'pagado' ELSE estado END
  WHERE id = v_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;
```

### 2. `sync_material_subtotal()` — trigger function (BD autoridad)

```sql
CREATE OR REPLACE FUNCTION public.sync_material_subtotal()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.subtotal := NEW.cantidad * NEW.precio_unitario;
  RETURN NEW;
END;
$$;
```

### 3. `sync_abono_cobro_update()` — trigger function

Al actualizar un cobro, ajusta el `abono` automático de cuenta corriente.

```sql
CREATE OR REPLACE FUNCTION public.sync_abono_cobro_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_titulo text;
BEGIN
  SELECT titulo INTO v_titulo FROM public.trabajos WHERE id = NEW.trabajo_id;
  UPDATE public.transacciones SET
    monto   = NEW.monto_cobrado,
    fecha   = NEW.fecha_cobro,
    concepto = 'Cobro registrado: ' || v_titulo
  WHERE referencia_cobro_id = NEW.id
    AND tipo = 'abono'
    AND origen = 'automático';
  RETURN NEW;
END;
$$;
```

### 4. `revertir_abono_cobro_delete()` — trigger function (auditoría)

Al borrar un cobro, inserta un `cargo` de anulación (el abono original se conserva como rastro).

> **NOTA de implementación**: `referencia_cobro_id` va NULL. Al correr el AFTER DELETE el cobro ya no
> existe y la FK `transacciones.referencia_cobro_id → cobros.id` (ON DELETE SET NULL) haría fallar el
> insert si se referenciara. El cargo queda trazable por `referencia_trabajo_id` y el concepto.

```sql
CREATE OR REPLACE FUNCTION public.revertir_abono_cobro_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_cliente_id uuid; v_titulo text;
BEGIN
  SELECT cliente_id, titulo INTO v_cliente_id, v_titulo FROM public.trabajos WHERE id = OLD.trabajo_id;
  IF v_cliente_id IS NULL THEN RETURN OLD; END IF;

  INSERT INTO public.transacciones
    (user_id, cliente_id, tipo, monto, concepto, fecha,
     referencia_trabajo_id, origen)
  VALUES
    (OLD.user_id, v_cliente_id, 'cargo', OLD.monto_cobrado,
     'Anulación de cobro: ' || v_titulo, CURRENT_DATE,
     OLD.trabajo_id, 'automático');
  RETURN OLD;
END;
$$;
```

### Tabla de triggers

| Trigger | Tabla | Momento / Evento | Función |
|---------|-------|------------------|---------|
| `on_tarea_change_recalcular` | `tareas` | AFTER INSERT OR DELETE OR UPDATE OF `precio, cantidad, precio_unitario` | `recalcular_trabajo_totales` |
| `on_material_subtotal_sync` | `materiales` | BEFORE INSERT OR UPDATE OF `cantidad, precio_unitario` | `sync_material_subtotal` |
| `on_material_change_recalcular` | `materiales` | AFTER INSERT OR DELETE OR UPDATE OF `cantidad, precio_unitario, subtotal` | `recalcular_trabajo_totales` |
| `on_cobro_change_recalcular` | `cobros` | AFTER INSERT OR DELETE OR UPDATE OF `monto_cobrado` | `recalcular_trabajo_totales` |
| `on_cobro_insert` *(existente)* | `cobros` | AFTER INSERT | `emitir_transaccion_cobro` |
| `on_cobro_update_sync_abono` | `cobros` | AFTER UPDATE OF `monto_cobrado, fecha_cobro` | `sync_abono_cobro_update` |
| `on_cobro_delete_revert` | `cobros` | AFTER DELETE | `revertir_abono_cobro_delete` |
| `on_trabajo_estado_presupuestado` *(existente)* | `trabajos` | AFTER UPDATE OF `estado` | `emitir_transaccion_presupuesto` |

**Eliminados** (reemplazados): `on_tarea_change_update_presupuesto` + `update_trabajo_presupuesto()`, `on_cobro_insert_check_pagado` + `check_trabajo_pagado()`.

## Backfill

```sql
UPDATE public.trabajos t SET
  presupuesto     = COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id = t.id), 0),
  total_estimado  = COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id = t.id), 0)
                  + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id = t.id), 0),
  total_cobrado   = COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id = t.id), 0),
  saldo_pendiente = COALESCE((SELECT SUM(precio)   FROM public.tareas     WHERE trabajo_id = t.id), 0)
                  + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id = t.id), 0)
                  - COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id = t.id), 0);
```

> El backfill es un `UPDATE` directo sobre `trabajos`; no dispara los triggers de recálculo (que viven en `tareas`/`materiales`/`cobros`).

## Frontend (contrato de datos)

El tipo `Job` en `src/types/index.ts` debe exponer los campos nuevos:

```ts
interface Job {
  // ...existentes
  presupuesto: number;
  total_estimado: number;
  total_cobrado: number;
  saldo_pendiente: number;
}
```

Consumidores:
- `use-payments`: `presupuestoTotal = job.total_estimado`, `totalCobrado = job.total_cobrado`, `saldoPendiente = job.saldo_pendiente`.
- `trabajo-detail`: sidebar usa `job.total_estimado`; desglose tareas/materiales en vivo solo para display.
- `client-detail-pane`: usa `job.total_estimado` / `job.saldo_pendiente`; elimina el recálculo de `jobMetrics`.
