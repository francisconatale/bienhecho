-- ==============================================================================
-- Seeder para pruebas de estrés de Bien Hecho
-- Genera datos masivos: Clientes, Trabajos, Tareas, Materiales y Cobros.
-- ==============================================================================

DO $$
DECLARE
    v_user_id UUID;
    v_cliente_id UUID;
    v_trabajo_id UUID;
    v_tarea_id UUID;
    v_material_id UUID;
    
    i INT;
    j INT;
    k INT;
    m INT;
    c INT;
    
    v_target_estado INT;
    v_precio DECIMAL;
    v_cantidad DECIMAL;
    v_subtotal DECIMAL;
    v_total_trabajo DECIMAL;
    
    v_nombres TEXT[] := ARRAY['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Elena', 'Pedro', 'Laura', 'Miguel', 'Sofía'];
    v_apellidos TEXT[] := ARRAY['Gómez', 'Rodríguez', 'López', 'Martínez', 'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Torres'];
    v_tareas_desc TEXT[] := ARRAY['Pintura pared', 'Instalación eléctrica', 'Reparación de caño', 'Colocación de cerámicos', 'Armado de mueble', 'Limpieza profunda', 'Revisión de aire acondicionado', 'Cambio de cerradura', 'Impermeabilización', 'Mantenimiento general'];
    v_materiales_desc TEXT[] := ARRAY['Lata de pintura', 'Cable 2.5mm', 'Caño PVC', 'Bolsa de cemento', 'Tornillos', 'Pegamento', 'Gas refrigerante', 'Cerradura de seguridad', 'Membrana asfáltica', 'Kit de herramientas'];
BEGIN
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'No se encontraron usuarios en auth.users. Registrate en la app primero.';
        RETURN;
    END IF;

    -- ==========================================
    -- GENERACIÓN DE CLIENTES (100 clientes)
    -- ==========================================
    FOR i IN 1..100 LOOP
        v_cliente_id := gen_random_uuid();
        
        INSERT INTO public.clientes (id, user_id, nombre, telefono, email, direccion, notas)
        VALUES (
            v_cliente_id,
            v_user_id,
            v_nombres[1 + (random() * 9)::int] || ' ' || v_apellidos[1 + (random() * 9)::int],
            '11' || trunc(random() * 90000000 + 10000000)::text,
            'cliente' || i || '_' || trunc(random() * 10000) || '@gmail.com',
            'Calle Falsa ' || trunc(random() * 10000),
            'Cliente generado por seeder para pruebas de estrés.'
        );

        -- ==========================================
        -- GENERACIÓN DE TRABAJOS (1 a 15 por cliente)
        -- ==========================================
        FOR j IN 1..(1 + trunc(random() * 14)) LOOP
            v_trabajo_id := gen_random_uuid();
            v_target_estado := trunc(random() * 3); -- 0: borrador, 1: presupuestado, 2: pagado
            v_total_trabajo := 0;

            -- 1. Insertar siempre como borrador primero para que las tareas/materiales no generen transacciones sueltas aún
            INSERT INTO public.trabajos (id, user_id, cliente_id, titulo, direccion, descripcion, estado, fecha_inicio, fecha_fin_estimada)
            VALUES (
                v_trabajo_id,
                v_user_id,
                v_cliente_id,
                'Trabajo ' || j || ' - ' || v_tareas_desc[1 + (random() * 9)::int],
                'Dirección Obra ' || trunc(random() * 10000),
                'Descripción detallada del trabajo ' || j || ' para el cliente.',
                'borrador',
                CURRENT_DATE - (trunc(random() * 30) || ' days')::interval,
                CURRENT_DATE + (trunc(random() * 30) || ' days')::interval
            );

            -- 2. TAREAS
            FOR k IN 1..(1 + trunc(random() * 7)) LOOP
                v_tarea_id := gen_random_uuid();
                v_precio := trunc(random() * 50000 + 5000);
                v_cantidad := 1;
                
                INSERT INTO public.tareas (id, user_id, trabajo_id, descripcion, precio_unitario, cantidad, precio, completada, prioridad, orden)
                VALUES (
                    v_tarea_id,
                    v_user_id,
                    v_trabajo_id,
                    v_tareas_desc[1 + (random() * 9)::int],
                    v_precio,
                    v_cantidad,
                    v_precio * v_cantidad,
                    (random() > 0.5),
                    CASE trunc(random() * 3) WHEN 0 THEN 'alta'::task_priority WHEN 1 THEN 'media'::task_priority ELSE 'baja'::task_priority END,
                    k
                );
                v_total_trabajo := v_total_trabajo + (v_precio * v_cantidad);
            END LOOP;

            -- 3. MATERIALES
            FOR m IN 1..(trunc(random() * 6)) LOOP
                v_material_id := gen_random_uuid();
                v_precio := trunc(random() * 10000 + 1000);
                v_cantidad := 1 + trunc(random() * 10);
                v_subtotal := v_precio * v_cantidad;
                
                INSERT INTO public.materiales (id, user_id, trabajo_id, nombre_material, cantidad, precio_unitario, subtotal, comprado)
                VALUES (
                    v_material_id,
                    v_user_id,
                    v_trabajo_id,
                    v_materiales_desc[1 + (random() * 9)::int],
                    v_cantidad,
                    v_precio,
                    v_subtotal,
                    (random() > 0.5)
                );
                v_total_trabajo := v_total_trabajo + v_subtotal;
            END LOOP;

            -- 4. Transicionar estado para disparar los triggers correctamente
            IF v_target_estado >= 1 THEN
                -- Pasar a presupuestado dispara emitir_transaccion_presupuesto generando los "cargo"
                UPDATE public.trabajos SET estado = 'presupuestado' WHERE id = v_trabajo_id;
            END IF;

            -- 5. COBROS
            IF v_target_estado = 1 THEN
                -- Presupuestado pero con pago parcial
                INSERT INTO public.cobros (user_id, trabajo_id, monto_cobrado, fecha_cobro, forma_pago, notas)
                VALUES (
                    v_user_id,
                    v_trabajo_id,
                    trunc(v_total_trabajo * 0.3), -- Cobra el 30%
                    CURRENT_DATE - (trunc(random() * 10) || ' days')::interval,
                    CASE trunc(random() * 3) WHEN 0 THEN 'Efectivo' WHEN 1 THEN 'Transferencia' ELSE 'Mercado Pago' END,
                    'Adelanto'
                );
            ELSIF v_target_estado = 2 THEN
                -- Pagado (Cobrar el 100% pasará automáticamente el estado a 'pagado' vía trigger)
                INSERT INTO public.cobros (user_id, trabajo_id, monto_cobrado, fecha_cobro, forma_pago, notas)
                VALUES (
                    v_user_id,
                    v_trabajo_id,
                    v_total_trabajo,
                    CURRENT_DATE - (trunc(random() * 10) || ' days')::interval,
                    CASE trunc(random() * 3) WHEN 0 THEN 'Efectivo' WHEN 1 THEN 'Transferencia' ELSE 'Mercado Pago' END,
                    'Pago total'
                );
            END IF;
            
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Seeder completado exitosamente para el usuario %', v_user_id;
END $$;
