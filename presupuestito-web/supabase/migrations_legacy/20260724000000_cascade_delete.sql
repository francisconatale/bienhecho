DO $$
DECLARE
    rec RECORD;
BEGIN
    -- 1. TAREAS -> TRABAJOS (trabajo_id)
    FOR rec IN 
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'tareas' AND column_name = 'trabajo_id'
        AND constraint_name IN (SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE tareas DROP CONSTRAINT ' || rec.constraint_name;
    END LOOP;
    ALTER TABLE tareas ADD CONSTRAINT tareas_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE CASCADE;

    -- 2. VISITAS -> TRABAJOS (trabajo_id)
    FOR rec IN 
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'visitas' AND column_name = 'trabajo_id'
        AND constraint_name IN (SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE visitas DROP CONSTRAINT ' || rec.constraint_name;
    END LOOP;
    ALTER TABLE visitas ADD CONSTRAINT visitas_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE CASCADE;

    -- 3. MATERIALES -> TRABAJOS (trabajo_id)
    FOR rec IN 
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'materiales' AND column_name = 'trabajo_id'
        AND constraint_name IN (SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE materiales DROP CONSTRAINT ' || rec.constraint_name;
    END LOOP;
    ALTER TABLE materiales ADD CONSTRAINT materiales_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE CASCADE;

    -- 4. COBROS -> TRABAJOS (trabajo_id)
    -- Lo hacemos NULLable para que el cobro pueda sobrevivir sin el trabajo asociado
    ALTER TABLE cobros ALTER COLUMN trabajo_id DROP NOT NULL;
    FOR rec IN 
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'cobros' AND column_name = 'trabajo_id'
        AND constraint_name IN (SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE cobros DROP CONSTRAINT ' || rec.constraint_name;
    END LOOP;
    -- Usamos SET NULL para que el cobro quede huérfano pero no se borre
    ALTER TABLE cobros ADD CONSTRAINT cobros_trabajo_id_fkey FOREIGN KEY (trabajo_id) REFERENCES trabajos(id) ON DELETE SET NULL;

    -- 5. TRANSACCIONES -> TRABAJOS (referencia_trabajo_id)
    -- referencia_trabajo_id ya es nullable, le ponemos SET NULL
    FOR rec IN 
        SELECT constraint_name 
        FROM information_schema.key_column_usage 
        WHERE table_name = 'transacciones' AND column_name = 'referencia_trabajo_id'
        AND constraint_name IN (SELECT constraint_name FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY')
    LOOP
        EXECUTE 'ALTER TABLE transacciones DROP CONSTRAINT ' || rec.constraint_name;
    END LOOP;
    ALTER TABLE transacciones ADD CONSTRAINT transacciones_referencia_trabajo_id_fkey FOREIGN KEY (referencia_trabajo_id) REFERENCES trabajos(id) ON DELETE SET NULL;

END $$;
