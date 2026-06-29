-- =============================================
-- MULTI-TENANCY COMPLETO
-- Copiar y pegar en Supabase SQL Editor
-- =============================================

-- 1. Agregar user_id a todas las tablas
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE trabajos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE tareas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE visitas ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE cobros ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE materiales ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE task_photos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE transacciones ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_trabajos_user_id ON trabajos(user_id);
CREATE INDEX IF NOT EXISTS idx_tareas_user_id ON tareas(user_id);
CREATE INDEX IF NOT EXISTS idx_visitas_user_id ON visitas(user_id);
CREATE INDEX IF NOT EXISTS idx_cobros_user_id ON cobros(user_id);
CREATE INDEX IF NOT EXISTS idx_materiales_user_id ON materiales(user_id);
CREATE INDEX IF NOT EXISTS idx_task_photos_user_id ON task_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_user_id ON transacciones(user_id);

-- 3. Habilitar RLS en todas las tablas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobros ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE visita_tareas ENABLE ROW LEVEL SECURITY;

-- 4. Policies: cada usuario solo ve sus datos
DROP POLICY IF EXISTS "usuarios_sus_clientes" ON clientes;
CREATE POLICY "usuarios_sus_clientes" ON clientes
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_trabajos" ON trabajos;
CREATE POLICY "usuarios_sus_trabajos" ON trabajos
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_tareas" ON tareas;
CREATE POLICY "usuarios_sus_tareas" ON tareas
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_visitas" ON visitas;
CREATE POLICY "usuarios_sus_visitas" ON visitas
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_cobros" ON cobros;
CREATE POLICY "usuarios_sus_cobros" ON cobros
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_materiales" ON materiales;
CREATE POLICY "usuarios_sus_materiales" ON materiales
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_photos" ON task_photos;
CREATE POLICY "usuarios_sus_photos" ON task_photos
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "usuarios_sus_transacciones" ON transacciones;
CREATE POLICY "usuarios_sus_transacciones" ON transacciones
  FOR ALL USING (user_id = auth.uid());

-- Policy para visita_tareas (acceso indirecto via visitas)
DROP POLICY IF EXISTS "usuarios_visita_tareas" ON visita_tareas;
CREATE POLICY "usuarios_visita_tareas" ON visita_tareas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM visitas
      WHERE visitas.id = visita_tareas.visita_id
      AND visitas.user_id = auth.uid()
    )
  );
