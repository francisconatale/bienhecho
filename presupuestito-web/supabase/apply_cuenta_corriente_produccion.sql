-- ============================================================================
-- APLICAR EN PRODUCCION - Supabase Dashboard > SQL Editor (o psql)
-- Proyecto: presupuestito (ref qxvphqwzgmeiipestjga)
--
-- Consolidado de las dos migraciones de cuenta corriente / totales:
--   1) 20260810100000_persistir_totales_cobros.sql  (columnas + triggers + backfill)
--   2) 20260810213500_triggers_cuenta_corriente.sql  (desglose granular por tarea/material)
--
-- Es idempotente: se puede ejecutar mas de una vez sin errores.
-- (los ADD CONSTRAINT de las FKs granulares llevan DROP previo para ello).
-- IMPORTANTE: no pasar por PowerShell/consola de Windows (corrompe el 'á' de
-- 'automático'); pegar desde el archivo en el SQL Editor o usar psql -f.
-- Generado el 2026-08-11.
-- ============================================================================
-- Persistir totales de cuentas a cobrar en trabajos
-- total_estimado, total_cobrado, saldo_pendiente mantenidos por triggers.
-- El frontend lee estas columnas, nunca las escribe.

-- 1. Columnas nuevas
alter table public.trabajos
  add column if not exists total_estimado numeric(10,2) not null default 0,
  add column if not exists total_cobrado  numeric(10,2) not null default 0,
  add column if not exists saldo_pendiente numeric(10,2) not null default 0;

-- 2. Drops de obsoletos (lógica absorbida en recalcular_trabajo_totales)
drop trigger if exists on_tarea_change_update_presupuesto on public.tareas;
drop trigger if exists on_cobro_insert_check_pagado on public.cobros;
drop function if exists public.update_trabajo_presupuesto();
drop function if exists public.check_trabajo_pagado();

-- 3. Funciones

-- Recalcula presupuesto, total_estimado, total_cobrado, saldo_pendiente
-- y auto-pasa a pagado cuando un trabajo presupuestado queda con saldo <= 0.
create or replace function public.recalcular_trabajo_totales()
returns trigger
language plpgsql
security definer
as $$
declare
  v_id uuid;
  v_presupuesto numeric(10,2);
  v_materiales numeric(10,2);
  v_cobrado numeric(10,2);
  v_estado public.job_status;
begin
  v_id := case when TG_OP = 'DELETE' then OLD.trabajo_id else NEW.trabajo_id end;
  if v_id is null then
    return coalesce(NEW, OLD);
  end if;

  select coalesce(sum(precio), 0) into v_presupuesto from public.tareas where trabajo_id = v_id;
  select coalesce(sum(subtotal), 0) into v_materiales from public.materiales where trabajo_id = v_id;
  select coalesce(sum(monto_cobrado), 0) into v_cobrado from public.cobros where trabajo_id = v_id;

  select estado into v_estado from public.trabajos where id = v_id;

  update public.trabajos set
    presupuesto = v_presupuesto,
    total_estimado = v_presupuesto + v_materiales,
    total_cobrado = v_cobrado,
    saldo_pendiente = (v_presupuesto + v_materiales) - v_cobrado,
    estado = case
      when v_estado = 'presupuestado'
       and (v_presupuesto + v_materiales) - v_cobrado <= 0
      then 'pagado'
      else estado
    end
  where id = v_id;

  return coalesce(NEW, OLD);
end;
$$;

-- La BD es autoridad del subtotal: cantidad x precio_unitario.
create or replace function public.sync_material_subtotal()
returns trigger
language plpgsql
as $$
begin
  NEW.subtotal := NEW.cantidad * NEW.precio_unitario;
  return NEW;
end;
$$;

-- Al actualizar un cobro, ajusta el abono automático de cuenta corriente.
create or replace function public.sync_abono_cobro_update()
returns trigger
language plpgsql
security definer
as $$
declare
  v_titulo text;
begin
  select titulo into v_titulo from public.trabajos where id = NEW.trabajo_id;
  update public.transacciones set
    monto = NEW.monto_cobrado,
    fecha = NEW.fecha_cobro,
    concepto = 'Cobro registrado: ' || coalesce(v_titulo, '')
  where referencia_cobro_id = NEW.id
    and tipo = 'abono'
    and origen = 'automático';
  return NEW;
end;
$$;

-- Al borrar un cobro, inserta un cargo de anulación (auditoría).
-- NOTA: referencia_cobro_id va NULL porque el cobro ya no existe al correr
-- el AFTER DELETE y la FK transacciones.referencia_cobro_id -> cobros.id
-- (ON DELETE SET NULL) haría fallar el insert referenciándolo. El abono
-- original se conserva como rastro; el saldo neto queda en cero.
create or replace function public.revertir_abono_cobro_delete()
returns trigger
language plpgsql
security definer
as $$
declare
  v_cliente_id uuid;
  v_titulo text;
begin
  select cliente_id, titulo into v_cliente_id, v_titulo
  from public.trabajos where id = OLD.trabajo_id;
  if v_cliente_id is null then
    return OLD;
  end if;

  insert into public.transacciones
    (user_id, cliente_id, tipo, monto, concepto, fecha,
     referencia_trabajo_id, origen)
  values
    (OLD.user_id, v_cliente_id, 'cargo', OLD.monto_cobrado,
     'Anulación de cobro: ' || v_titulo, current_date,
     OLD.trabajo_id, 'automático');
  return OLD;
end;
$$;

-- 4. Triggers

-- Transacciones de cuenta corriente (existentes en el dump, se aseguran acá)
create or replace trigger on_cobro_insert
after insert on public.cobros
for each row execute function public.emitir_transaccion_cobro();

create or replace trigger on_trabajo_estado_presupuestado
after update of estado on public.trabajos
for each row execute function public.emitir_transaccion_presupuesto();

-- Recálculo de totales
create or replace trigger on_tarea_change_recalcular
after insert or delete or update of precio, cantidad, precio_unitario on public.tareas
for each row execute function public.recalcular_trabajo_totales();

create or replace trigger on_material_subtotal_sync
before insert or update of cantidad, precio_unitario on public.materiales
for each row execute function public.sync_material_subtotal();

create or replace trigger on_material_change_recalcular
after insert or delete or update of cantidad, precio_unitario, subtotal on public.materiales
for each row execute function public.recalcular_trabajo_totales();

create or replace trigger on_cobro_change_recalcular
after insert or delete or update of monto_cobrado on public.cobros
for each row execute function public.recalcular_trabajo_totales();

-- Sincronización de cuenta corriente al editar/borrar un cobro
create or replace trigger on_cobro_update_sync_abono
after update of monto_cobrado, fecha_cobro on public.cobros
for each row execute function public.sync_abono_cobro_update();

create or replace trigger on_cobro_delete_revert
after delete on public.cobros
for each row execute function public.revertir_abono_cobro_delete();

-- 5. Backfill (UPDATE directo; no dispara los triggers de recálculo)
update public.trabajos t set
  presupuesto = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0),
  total_estimado = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0)
                 + coalesce((select sum(subtotal) from public.materiales where trabajo_id = t.id), 0),
  total_cobrado = coalesce((select sum(monto_cobrado) from public.cobros where trabajo_id = t.id), 0),
  saldo_pendiente = coalesce((select sum(precio) from public.tareas where trabajo_id = t.id), 0)
                  + coalesce((select sum(subtotal) from public.materiales where trabajo_id = t.id), 0)
                  - coalesce((select sum(monto_cobrado) from public.cobros where trabajo_id = t.id), 0);


-- T002: Alterar tabla transacciones para añadir referencias granulares
ALTER TABLE "public"."transacciones" ADD COLUMN IF NOT EXISTS "referencia_tarea_id" "uuid";
ALTER TABLE "public"."transacciones" ADD COLUMN IF NOT EXISTS "referencia_material_id" "uuid";

ALTER TABLE "public"."transacciones" DROP CONSTRAINT IF EXISTS "transacciones_referencia_tarea_id_fkey"; ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_referencia_tarea_id_fkey" FOREIGN KEY ("referencia_tarea_id") REFERENCES "public"."tareas"("id") ON DELETE SET NULL;
ALTER TABLE "public"."transacciones" DROP CONSTRAINT IF EXISTS "transacciones_referencia_material_id_fkey"; ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_referencia_material_id_fkey" FOREIGN KEY ("referencia_material_id") REFERENCES "public"."materiales"("id") ON DELETE SET NULL;

-- T008: Modificar foreign key de referencia_trabajo_id a CASCADE para que al borrar un trabajo se descuente borrando las transacciones
ALTER TABLE "public"."transacciones" DROP CONSTRAINT IF EXISTS "transacciones_referencia_trabajo_id_fkey";
ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_referencia_trabajo_id_fkey" FOREIGN KEY ("referencia_trabajo_id") REFERENCES "public"."trabajos"("id") ON DELETE CASCADE;

-- T003: Crear función para actualizar transacciones al modificar tareas (US1)
CREATE OR REPLACE FUNCTION "public"."on_tarea_change_update_transaccion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_estado public.job_status;
    v_user_id UUID;
    v_cliente_id UUID;
    v_diferencia DECIMAL(10,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = OLD.trabajo_id;
        
        IF v_estado = 'presupuestado' THEN
            -- Se eliminan las transacciones generadas por esta tarea
            DELETE FROM public.transacciones WHERE referencia_tarea_id = OLD.id;
            
            -- Si la tarea fue agregada ANTES de este sistema (legacy job sin transacciones por item), 
            -- borrar la transaccion individual no hará nada. Por lo tanto debemos hacer un abono compensatorio.
            -- Determinamos si había transacciones:
            IF NOT FOUND AND COALESCE(OLD.precio, 0) > 0 THEN
                INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
                VALUES (v_user_id, v_cliente_id, 'abono', OLD.precio, 'Descuento por eliminación de tarea: ' || OLD.descripcion, CURRENT_DATE, OLD.trabajo_id, 'automático');
            END IF;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = NEW.trabajo_id;
        
        IF v_estado = 'presupuestado' AND COALESCE(NEW.precio, 0) > 0 THEN
            INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
            VALUES (v_user_id, v_cliente_id, 'cargo', NEW.precio, 'Tarea agregada: ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.precio IS DISTINCT FROM NEW.precio THEN
            SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
            FROM public.trabajos WHERE id = NEW.trabajo_id;
            
            IF v_estado = 'presupuestado' THEN
                v_diferencia := COALESCE(NEW.precio, 0) - COALESCE(OLD.precio, 0);
                IF v_diferencia > 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'cargo', v_diferencia, 'Ajuste tarea (aumento): ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                ELSIF v_diferencia < 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'abono', ABS(v_diferencia), 'Ajuste tarea (rebaja): ' || NEW.descripcion, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;

-- T004: Crear el trigger para tareas (US1)
DROP TRIGGER IF EXISTS "on_tarea_change_update_transaccion_trigger" ON "public"."tareas";
CREATE TRIGGER "on_tarea_change_update_transaccion_trigger" 
    AFTER INSERT OR UPDATE OF "precio" OR DELETE ON "public"."tareas" 
    FOR EACH ROW EXECUTE FUNCTION "public"."on_tarea_change_update_transaccion"();

-- T005: Crear función para actualizar transacciones al modificar materiales (US2)
CREATE OR REPLACE FUNCTION "public"."on_material_change_update_transaccion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_estado public.job_status;
    v_user_id UUID;
    v_cliente_id UUID;
    v_diferencia DECIMAL(10,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = OLD.trabajo_id;
        
        IF v_estado = 'presupuestado' THEN
            DELETE FROM public.transacciones WHERE referencia_material_id = OLD.id;
            
            IF NOT FOUND AND COALESCE(OLD.subtotal, 0) > 0 THEN
                INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
                VALUES (v_user_id, v_cliente_id, 'abono', OLD.subtotal, 'Descuento por eliminación de material: ' || OLD.nombre_material, CURRENT_DATE, OLD.trabajo_id, 'automático');
            END IF;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'INSERT' THEN
        SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
        FROM public.trabajos WHERE id = NEW.trabajo_id;
        
        IF v_estado = 'presupuestado' AND COALESCE(NEW.subtotal, 0) > 0 THEN
            INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
            VALUES (v_user_id, v_cliente_id, 'cargo', NEW.subtotal, 'Material agregado: ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.subtotal IS DISTINCT FROM NEW.subtotal THEN
            SELECT estado, user_id, cliente_id INTO v_estado, v_user_id, v_cliente_id 
            FROM public.trabajos WHERE id = NEW.trabajo_id;
            
            IF v_estado = 'presupuestado' THEN
                v_diferencia := COALESCE(NEW.subtotal, 0) - COALESCE(OLD.subtotal, 0);
                IF v_diferencia > 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'cargo', v_diferencia, 'Ajuste material (aumento): ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                ELSIF v_diferencia < 0 THEN
                    INSERT INTO public.transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                    VALUES (v_user_id, v_cliente_id, 'abono', ABS(v_diferencia), 'Ajuste material (rebaja): ' || NEW.nombre_material, CURRENT_DATE, NEW.trabajo_id, NEW.id, 'automático');
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;

-- T006: Crear el trigger para materiales (US2)
DROP TRIGGER IF EXISTS "on_material_change_update_transaccion_trigger" ON "public"."materiales";
CREATE TRIGGER "on_material_change_update_transaccion_trigger" 
    AFTER INSERT OR UPDATE OF "subtotal" OR DELETE ON "public"."materiales" 
    FOR EACH ROW EXECUTE FUNCTION "public"."on_material_change_update_transaccion"();

-- T007: Modificar función de emisión de presupuesto para hacerlo granular (US3)
CREATE OR REPLACE FUNCTION "public"."emitir_transaccion_presupuesto"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    t_record RECORD;
    m_record RECORD;
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        -- Insertar transacciones por cada tarea
        FOR t_record IN SELECT * FROM public.tareas WHERE trabajo_id = NEW.id LOOP
            IF COALESCE(t_record.precio, 0) > 0 THEN
                INSERT INTO public.transacciones
                    (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_tarea_id, origen)
                VALUES
                    (NEW.user_id, NEW.cliente_id, 'cargo', t_record.precio,
                     'Tarea (Presupuesto): ' || t_record.descripcion, CURRENT_DATE, NEW.id, t_record.id, 'automático');
            END IF;
        END LOOP;

        -- Insertar transacciones por cada material
        FOR m_record IN SELECT * FROM public.materiales WHERE trabajo_id = NEW.id LOOP
            IF COALESCE(m_record.subtotal, 0) > 0 THEN
                INSERT INTO public.transacciones
                    (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_material_id, origen)
                VALUES
                    (NEW.user_id, NEW.cliente_id, 'cargo', m_record.subtotal,
                     'Material (Presupuesto): ' || m_record.nombre_material, CURRENT_DATE, NEW.id, m_record.id, 'automático');
            END IF;
        END LOOP;
        
        -- Nota: No insertamos el monto total genérico. Las tareas y materiales sumarán el total exacto.
        -- Los trabajos legacy ya pasaron por este trigger y tienen su registro anterior,
        -- por lo tanto no volverán a evaluarse en OLD.estado = 'borrador' AND NEW.estado = 'presupuestado'.
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- VERIFICACION POST-APLICACION
-- ============================================================================

-- 1) Las 3 columnas de totales deben existir
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'trabajos'
  AND column_name IN ('total_estimado','total_cobrado','saldo_pendiente')
ORDER BY 1;

-- 2) Referencias granulares en transacciones
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'transacciones'
  AND column_name IN ('referencia_tarea_id','referencia_material_id')
ORDER BY 1;

-- 3) Consistencia de totales: debe devolver 0 filas
SELECT t.id, t.titulo, t.total_estimado, t.total_cobrado, t.saldo_pendiente
FROM public.trabajos t
WHERE t.total_estimado <> (COALESCE((SELECT SUM(precio) FROM public.tareas WHERE trabajo_id=t.id),0)
                         + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0))
   OR t.saldo_pendiente <> (COALESCE((SELECT SUM(precio) FROM public.tareas WHERE trabajo_id=t.id),0)
                          + COALESCE((SELECT SUM(subtotal) FROM public.materiales WHERE trabajo_id=t.id),0)
                          - COALESCE((SELECT SUM(monto_cobrado) FROM public.cobros WHERE trabajo_id=t.id),0));