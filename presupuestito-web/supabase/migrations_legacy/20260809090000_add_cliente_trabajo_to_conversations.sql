-- Asociar cada conversación con un cliente y un trabajo del sistema.
-- La "persona" ya está cubierta por `conversations.user_id` (usuario logueado).
-- Las tareas detectadas en la conversación pertenecen al trabajo vinculado
-- (`conversations.trabajo_id`), evitando marcar cada `task` individualmente.

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS trabajo_id UUID REFERENCES public.trabajos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_cliente_id ON conversations(cliente_id);
CREATE INDEX IF NOT EXISTS idx_conversations_trabajo_id ON conversations(trabajo_id);
