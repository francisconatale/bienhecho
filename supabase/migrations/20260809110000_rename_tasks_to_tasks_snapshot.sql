-- Renombrar 'tasks' a 'tasks_snapshot' para reflejar que es el snapshot del chat.
-- Las FK (pending_steps.task_id), índices, policies y grants se mueven con la tabla automáticamente.
ALTER TABLE tasks RENAME TO tasks_snapshot;

ALTER TABLE tasks_snapshot RENAME CONSTRAINT tasks_pkey TO tasks_snapshot_pkey;
ALTER TABLE tasks_snapshot RENAME CONSTRAINT tasks_conversation_id_fkey TO tasks_snapshot_conversation_id_fkey;
ALTER INDEX idx_tasks_conversation_id RENAME TO idx_tasks_snapshot_conversation_id;

-- Renombrar la política para coherencia
ALTER POLICY "usuarios_sus_chat_tasks" ON tasks_snapshot RENAME TO "usuarios_sus_tasks_snapshot";
