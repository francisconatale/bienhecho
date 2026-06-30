-- Fix triggers for transacciones to include user_id
-- Run this in the Supabase SQL Editor

CREATE OR REPLACE FUNCTION emitir_transaccion_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'borrador' AND NEW.estado = 'presupuestado' THEN
        INSERT INTO transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, origen)
        VALUES (
            NEW.user_id,
            NEW.cliente_id, 
            'cargo', 
            NEW.presupuesto, 
            'Emisión de presupuesto: ' || NEW.titulo, 
            CURRENT_DATE, 
            NEW.id, 
            'automático'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION emitir_transaccion_cobro()
RETURNS TRIGGER AS $$
DECLARE
    v_cliente_id UUID;
    v_trabajo_titulo TEXT;
    v_user_id UUID;
BEGIN
    SELECT cliente_id, titulo, user_id INTO v_cliente_id, v_trabajo_titulo, v_user_id
    FROM trabajos WHERE id = NEW.trabajo_id;

    INSERT INTO transacciones (user_id, cliente_id, tipo, monto, concepto, fecha, referencia_trabajo_id, referencia_cobro_id, origen)
    VALUES (
        v_user_id,
        v_cliente_id, 
        'abono', 
        NEW.monto_cobrado, 
        'Cobro registrado: ' || v_trabajo_titulo, 
        NEW.fecha_cobro, 
        NEW.trabajo_id, 
        NEW.id, 
        'automático'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
