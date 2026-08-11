-- 1. Crear tabla 'conversations'
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Crear tabla 'tasks' (representa cada work_item / trabajo extraído)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC, -- nullable
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Crear tabla 'pending_steps' (cola de aclaraciones manejada por el backend)
CREATE TABLE pending_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    step_type TEXT NOT NULL, -- Ej: 'CLARIFY_CANTIDAD'
    status TEXT NOT NULL DEFAULT 'PENDING',
    attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices recomendados para acceso rápido
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_tasks_conversation_id ON tasks(conversation_id);
CREATE INDEX idx_pending_steps_conversation_id ON pending_steps(conversation_id);
CREATE INDEX idx_pending_steps_task_id ON pending_steps(task_id);

-- 4. RLS multi-tenancy: cada usuario solo accede a lo suyo
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_sus_conversaciones" ON conversations
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "usuarios_sus_chat_tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = tasks.conversation_id
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = tasks.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "usuarios_sus_pending_steps" ON pending_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = pending_steps.conversation_id
      AND conversations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = pending_steps.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

GRANT ALL ON TABLE conversations TO anon, authenticated, service_role;
GRANT ALL ON TABLE tasks TO anon, authenticated, service_role;
GRANT ALL ON TABLE pending_steps TO anon, authenticated, service_role;
