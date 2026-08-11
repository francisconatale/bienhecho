# Data Model: Arquitectura de Interpretación por Chat

## Supabase Entities (Database Tables)

Dado que el backend orquestará el flujo y servirá una tarea a la vez, es fundamental persistir el estado de la conversación y sus tareas en la base de datos (o temporalmente en memoria del servidor/Redis si es efímero).

### `conversations`
Representa la sesión de chat global. Se vincula a un cliente y un trabajo del sistema.
- `id` (uuid, PK)
- `created_at` (timestamptz)
- `status` (text, e.g., 'IN_PROGRESS', 'COMPLETED')
- `user_id` (uuid, FK, referenciando a `auth.users`) — la "persona"
- `cliente_id` (uuid, FK, nullable, `→ clientes.id`)
- `trabajo_id` (uuid, FK, nullable, `→ trabajos.id`) — las tareas de la conversación pertenecen a este trabajo

### `tasks_snapshot` (o `work_items`)
Cada ítem o trabajo detectado durante la conversación.
- `id` (uuid, PK)
- `conversation_id` (uuid, FK, referenciando a `conversations`)
- `description` (text)
- `quantity` (numeric, nullable)
- `precio` (numeric, nullable) — precio unitario
- `status` (text, e.g., 'PENDING', 'COMPLETED')
- `created_at` (timestamptz)

### `pending_steps` (Cola de aclaraciones manejada por el Backend)
Esta tabla permite que el backend sepa exactamente qué falta preguntar.
- `id` (uuid, PK)
- `conversation_id` (uuid, FK)
- `task_id` (uuid, FK)
- `step_type` (text, e.g., 'CLARIFY_DATOS', 'CLARIFY_CANTIDAD_ADICIONAL')
- `status` (text, e.g., 'PENDING', 'RESOLVED', 'FAILED')

---

## Backend Orchestration (Server Actions / API)

El backend es el único responsable de determinar qué tarea está activa y qué se le debe preguntar al usuario. La Server Action hará lo siguiente:

1. **Recibe** el mensaje del usuario y el ID de la conversación.
2. **LLM**: Envía la información al LLM para extraer `workItems` y `missing`.
3. **Sincroniza BD**: Guarda o actualiza las `tasks_snapshot` y encola los `pending_steps` correspondientes.
4. **Sirve una a la vez**: Revisa la cola de `pending_steps` de la base de datos, toma el primero que esté 'PENDING', e instruye al LLM (o responde directamente) con la pregunta concreta para **esa única tarea**.

### API Response Contract (Backend -> Frontend)

El frontend se vuelve "tonto" y solo renderiza lo que el backend le dice que está activo.

```typescript
interface BackendResponse {
  respuesta: string; // Lo que dice el asistente
  status: 'completed' | 'pending';
  
  // El backend envía TODAS las tareas para que el frontend las muestre
  tareas: {
    id: string;
    descripcion: string;
    cantidad: number | null;
    precio: number | null;
  }[];

  // El backend decide cuál es la única tarea que está en foco ahora mismo
  active_pending_step: {
    tarea_id: string;
    type: string; // ej: 'CLARIFY_DATOS', 'CLARIFY_CANTIDAD_ADICIONAL'
  } | null;

  // Vínculo de la conversación con el sistema (cliente / trabajo)
  conversation: {
    id: string;
    cliente_id: string | null;
    trabajo_id: string | null;
  };
}
```

## Application State Models (Zustand)

El estado de Zustand en el frontend simplemente refleja la respuesta del backend. Ya no tiene que deducir qué falta.

### `ConversationState` (Zustand)
```typescript
interface ConversationState {
  messages: Message[];
  tareas: Tarea[];
  active_pending_step: PendingStep | null; // El frontend solo mira esto para saber qué resaltar
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Tarea {
  id: string;
  descripcion: string;
  cantidad: number | null;
  precio: number | null;
}

interface PendingStep {
  type: string;
  tarea_id: string;
}
```
