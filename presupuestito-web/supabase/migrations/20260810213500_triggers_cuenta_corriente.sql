-- T002: Alterar tabla transacciones para añadir referencias granulares
ALTER TABLE "public"."transacciones" ADD COLUMN IF NOT EXISTS "referencia_tarea_id" "uuid";
ALTER TABLE "public"."transacciones" ADD COLUMN IF NOT EXISTS "referencia_material_id" "uuid";

ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_referencia_tarea_id_fkey" FOREIGN KEY ("referencia_tarea_id") REFERENCES "public"."tareas"("id") ON DELETE SET NULL;
ALTER TABLE "public"."transacciones" ADD CONSTRAINT "transacciones_referencia_material_id_fkey" FOREIGN KEY ("referencia_material_id") REFERENCES "public"."materiales"("id") ON DELETE SET NULL;

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
