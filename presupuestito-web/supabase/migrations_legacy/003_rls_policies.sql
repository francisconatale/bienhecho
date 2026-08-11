-- Enable RLS on all tables
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabajos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobros ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE visita_tareas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "usuarios_sus_clientes" ON clientes;
DROP POLICY IF EXISTS "usuarios_sus_trabajos" ON trabajos;
DROP POLICY IF EXISTS "usuarios_sus_tareas" ON tareas;
DROP POLICY IF EXISTS "usuarios_sus_visitas" ON visitas;
DROP POLICY IF EXISTS "usuarios_sus_cobros" ON cobros;
DROP POLICY IF EXISTS "usuarios_sus_materiales" ON materiales;
DROP POLICY IF EXISTS "usuarios_sus_photos" ON task_photos;
DROP POLICY IF EXISTS "usuarios_sus_transacciones" ON transacciones;
DROP POLICY IF EXISTS "usuarios_visita_tareas" ON visita_tareas;

-- Policies for clientes
CREATE POLICY "usuarios_sus_clientes" ON clientes
  FOR ALL USING (user_id = auth.uid());

-- Policies for trabajos
CREATE POLICY "usuarios_sus_trabajos" ON trabajos
  FOR ALL USING (user_id = auth.uid());

-- Policies for tareas
CREATE POLICY "usuarios_sus_tareas" ON tareas
  FOR ALL USING (user_id = auth.uid());

-- Policies for visitas
CREATE POLICY "usuarios_sus_visitas" ON visitas
  FOR ALL USING (user_id = auth.uid());

-- Policies for cobros
CREATE POLICY "usuarios_sus_cobros" ON cobros
  FOR ALL USING (user_id = auth.uid());

-- Policies for materiales
CREATE POLICY "usuarios_sus_materiales" ON materiales
  FOR ALL USING (user_id = auth.uid());

-- Policies for task_photos
CREATE POLICY "usuarios_sus_photos" ON task_photos
  FOR ALL USING (user_id = auth.uid());

-- Policies for transacciones
CREATE POLICY "usuarios_sus_transacciones" ON transacciones
  FOR ALL USING (user_id = auth.uid());

-- Policies for visita_tareas (access via visitas.user_id)
CREATE POLICY "usuarios_visita_tareas" ON visita_tareas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM visitas
      WHERE visitas.id = visita_tareas.visita_id
      AND visitas.user_id = auth.uid()
    )
  );
