-- Create task_photos table if it doesn't exist
CREATE TABLE IF NOT EXISTS task_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  url TEXT NOT NULL,
  descripcion TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on task_photos if not already enabled
ALTER TABLE task_photos ENABLE ROW LEVEL SECURITY;

-- Ensure policy exists
DROP POLICY IF EXISTS "usuarios_sus_photos" ON task_photos;
CREATE POLICY "usuarios_sus_photos" ON task_photos
  FOR ALL USING (user_id = auth.uid());

-- Create "task-photos" bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-photos', 'task-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS para el bucket task-photos
-- Solo usuarios autenticados pueden subir fotos
CREATE POLICY "Usuarios pueden subir fotos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'task-photos' AND auth.uid() = owner);

-- Usuarios autenticados pueden ver sus propias fotos
CREATE POLICY "Usuarios pueden ver sus propias fotos" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);

-- Usuarios autenticados pueden actualizar sus propias fotos
CREATE POLICY "Usuarios pueden actualizar sus fotos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);

-- Usuarios autenticados pueden eliminar sus propias fotos
CREATE POLICY "Usuarios pueden borrar sus fotos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'task-photos' AND auth.uid() = owner);
