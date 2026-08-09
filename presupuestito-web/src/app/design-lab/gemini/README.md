# Gemini Chat — Asistente de Presupuestos

Módulo autocontenido del chat dentro de `src/app/design-lab/gemini/`.

Interpreta mensajes en lenguaje natural, los convierte en tareas de un presupuesto
(`tasks_snapshot`), pregunta los datos que faltan (cantidad/precio), soporta
**aumentos de cantidad** sobre tareas ya registradas, **elimina** tareas por
pedido, responde **consultas** sin tocar datos y termina volcando todo a un
**trabajo** real (`trabajos` → `tareas`).

- **Frontend:** `page.tsx` → `components/chat-view.tsx`
- **Backend:** server actions en `actions.ts` (Next.js "use server").
- **LLM:** `gemma-4-26b-a4b-it` vía Gemini API, con `responseSchema` y `thinkingConfig.thinkingLevel: "minimal"` (el razonamiento de gemma filtra preámbulos y pelea con la salida estructurada — ver `actions.ts`).
- **Datos:** Postgres (Supabase local).

---

## 1. Componentes del módulo

| Ruta | Qué hace | A quién le habla |
|---|---|---|
| `page.tsx` | Renderiza el lab (página de la ruta). | `components/chat-view.tsx` |
| `components/chat-view.tsx` | Layout de 2 columnas + sesión del usuario (obtiene el userId, exige login). | `chat-interface`, `task-list`, `task-load-panel` |
| `components/chat-interface.tsx` | Input + burbujas del chat. Envía cada mensaje y pinta la respuesta. | `../actions` (`generateChatResponse`) y `hooks/use-chat-tasks` |
| `components/task-list.tsx` | Muestra las tareas detectadas y resalta la que está en aclaración. | `hooks/use-chat-tasks` (solo lee estado) |
| `components/task-load-panel.tsx` | Volca las tareas del chat a un trabajo (crea el trabajo si no hay). | `../actions` (`loadChatTasksIntoJob`), `hooks/use-chat-tasks`, `@/actions/clients.actions` |
| `hooks/use-chat-tasks.ts` | Store zustand (cliente): mensajes, tareas, paso activo, conversación, loading. | lo consumen los 3 componentes |
| `types/chat.ts` | **Contratos** compartidos cliente ↔ servidor ↔ LLM (`LLMResponse`, `BackendResponse`, `WorkItem`, ...). | todo el módulo |
| `actions.ts` | **Orquestador** (server): conversación → paso activo → flujo → LLM → persistencia → estado final. Exporta `generateChatResponse` y `loadChatTasksIntoJob`. | `lib/chat-flow-strategy`, `services/*`, Supabase, Gemini |
| `lib/chat-flow-strategy.ts` | **Estrategia por flujo**: define el enum `CHAT_FLOWS`, los prompts (`prompt`) y la persistencia (`run`) de cada flujo, más helpers (`enqueueStep`, `resolveStep`, `failOrRetryStep`, `sanitizeRespuesta`, `chatSystemInstruction`). | `actions.ts`, `services/chat-tasks.service`, LLM |
| `services/chat-tasks.service.ts` | **Toda** las queries a `tasks_snapshot` (sync, update, removeByDescription, list*, findNextIncomplete) + helpers `normalizeDescription`, `missingFieldsOf`, `isIncomplete`. | `actions.ts`, `lib/chat-flow-strategy.ts` |
| `services/chat-load.service.ts` | `loadTasksIntoJob`: crea/vincula el trabajo y copia `tasks_snapshot` → `tareas` (dedupe por descripción normalizada). | `actions.ts` |

---

## 2. Diagrama de arquitectura (UML ASCII)

```
                        +------------------------------------------------------+
                        |                    components/ (cliente)             |
                        |                                                       |
                        |   page.tsx ──► chat-view.tsx (layout + auth)         |
                        |                        |                              |
                        |        +---------------+--------------+               |
                        |        v                              v               |
                        |  +---------------+             +--------------------+  |
                        |  | chat-interface|             |  task-list         |  |
                        |  |  (entrada)    |             |  (tareas + step)   |  |
                        |  +-------+-------+             +----------+---------+  |
                        |          |          +--------------------+             |
                        |          |          |   task-load-panel |             |
                        |          |          +---------+----------+             |
                        +----------+--------------------+------------------------+
                                   │                    │
            generateChatResponse(  │                    │  loadChatTasksIntoJob(...)
            messages, userId,      │                    │
            conversationId)        │                    │
                                   ▼                    ▼
        +--------------------------------------------------------------+
        |                     actions.ts  ("use server")               |
        |  · crea/recupera la conversación                             |
        |  · lee el único pending_step PENDING (FR-004/FR-008)         |
        |  · resolveFlow(step_type) ──► FLOW_STRATEGIES[flujo]         |
        |  · strategy.prompt(...) ──► Gemini (JSON validado)           |
        |  · strategy.run(...) ──► persistencia                         |
        |  · si quedó algo incompleto: encola el siguiente paso         |
        +-----+-------------------------------+------------------------+
              │                               │
              │ uses                          │ uses
              ▼                               ▼
  +-----------------------+          +-----------------------------+
  | lib/chat-flow-        |          | services/chat-tasks.service |
  | strategy.ts           |          | sync · update · list*       |
  | CHAT_FLOWS            |          | findNextIncomplete          |
  | prompt + run por flujo|          +-------------+---------------+
  | enqueue/failOrRetry   |                        │
  +-----------------------+                        ▼
                                     +-----------------------------+
                                     | services/chat-load.service  |
                                     | loadTasksIntoJob            |
                                     +-------------+---------------+
                                                   │
                                                   ▼
                                   +------------------------------+
                                   |   Supabase (Postgres)        |
                                   |  conversations               |
                                   |  pending_steps               |
                                   |  tasks_snapshot              |
                                   |  trabajos · tareas           |
                                   +------------------------------+

  Retorno al cliente:
  chat-interface ◄── BackendResponse ── actions.ts ──► hooks/use-chat-tasks
                                                         │
                                     updateFromBackend() │ re-render
                                                         ▼
                              chat-interface (burbuja) · task-list (tareas)
                              task-load-panel (conversation vinculada)
```

---

## 3. Cómo se hablan (secuencia de un turno)

Flujo de un turno normal con tarea nueva (los flujos `CLARIFY_*` son iguales,
cambiando solo el prompt y el `run` de la estrategia). `messages` solo se usa
para tomar el último mensaje del usuario: **el historial completo no se envía
al LLM**, el store del cliente lo conserva únicamente para pintar las burbujas.

```
  Browser            actions.ts          strategy (lib)        Gemini               Supabase
     │  generateChatResponse(messages,   │                     │                       │
     │  userId, conversationId?)         │                     │                       │
     │──────────────────────────────────►│                     │                       │
     │                                  │ insert/select conversation                │ conversations
     │                                  │──────────────────────────────────────────────────────►
     │                                  │ select pending_step PENDING (limit 1)               │
     │                                  │──────────────────────────────────────────────────────►
     │                                  │ resolveFlow(step_type)                                │
     │                                  │───► FLOW_STRATEGIES[flujo] .prompt                    │
     │                                  │  buildRegisteredContext(tasks)                        │
     │                                  │  prompt(latestMessage, missing, desc)                 │
     │                                  │───────────────────────────────────►                    │
     │                                  │  generateContent(prompt)                                │
     │                                  │───────────────────────────────────►                    │
     │                                  │◄──────────────── LLMResponse JSON ───────────────────│
     │                                  │  sanitizeRespuesta()                                  │
     │                                  │  strategy.run({supabase, parsedJSON, activeStep})     │
     │                                  │          │ update/sync tasks_snapshot                  │
     │                                  │          │ enqueue/resolve/fail pending_steps         │
     │                                  │          ▼                                  │
     │                                  │       (se aplica según flujo)                 │
     │                                  │──────────────────────────────────────────────────────►
     │                                  │ si status "completed": findNextIncomplete()          │
     │                                  │            ──► enqueueStep(CLARIFY_DATOS)            │
     │                                  │ listAll + nextActiveStep + conversationRow           │
     │                                  │──────────────────────────────────────────────────────►
     │◄── BackendResponse ──────────────│                     │                       │
     │  updateFromBackend() ──► store ──► re-render (burbujas, tareas, panel)                  │
```

### Caso especial: pedir crear una tarea nueva durante una aclaración

Si hay un paso pendiente (A en foco) y el mismo mensaje además pide crear una
tarea B, B **se apila**: el `run` del flujo activo la crea como `PENDING`
(incompleta) y `findNextIncomplete()` la toma después de resolver A (cola FIFO
por `created_at`, una a la vez — FR-004/FR-008).

```
  Browser            actions.ts          strategy.run (lib)         Supabase
     │  "2 a $100000, y sumá una cocina"                              │
     │─────────────────────────────────────────────────────────────► │
      │                                  │ data = [A (completa),           │
      │                                  │         "cocina" (nueva)]        │
     │                                  │ sync() crea "cocina" (PENDING)
     │                                  │──────────────────────────────────────────► tasks_snapshot
     │                                  │ update(A) → completa → RESOLVED            │
     │                                  │──────────────────────────────────────────► pending_steps
     │                                  │ findNextIncomplete() → "cocina"            │
     │                                  │ enqueueStep(CLARIFY_DATOS)                  │
     │◄── status "pending" ─────────────│──────────────────────────────────────────► pending_steps
```

Dónde está contemplado explícitamente:

- `lib/chat-flow-strategy.ts` — run `CLARIFY_DATOS`: `sync(parsedJSON.data)` procesa **todos** los items, completa la de foco y **crea/apila** las nuevas.
- `lib/chat-flow-strategy.ts` — run `CLARIFY_ADICIONAL`: excluye el item de la tarea en foco y sincroniza el resto, apilando las nuevas.
- `actions.ts` — post-común: si el turno quedó `completed`, `findNextIncomplete()` toma la primera incompleta apilada y encola su `CLARIFY_DATOS`.

> Nota: hoy los prompts de clarificación le piden a la IA declarar el intent y
> devolver items extra si el usuario menciona otras tareas; el apilamiento de
> tareas nuevas depende de que la IA los emita.

### Caso: resolver OTRA petición durante una aclaración

El `run` ya no asume que `data[0]` es la tarea en foco: la identifica por
descripción normalizada con `focusWorkItem`. Si el usuario resuelve otra tarea
("en la task 2 seteame el precio en 2000"):

- Los items de `data` que **no** coinciden con la tarea en foco van al `sync` (match por
  descripción exacta) → la task 2 se actualiza **sin pisar** lo que ya tenía
  (solo cambia `precio`, conserva `quantity`).
- La tarea en foco solo se completa si el usuario le dio datos. Si no, su paso
  queda `PENDING` **sin aumentar `attempts`** (no fue un intento fallido de
  resolverla) y el próximo turno vuelve a preguntar por ella.

```
[CLARIFY_DATOS]  "en la task 2 seteame el precio en 2000"
   ├─ focusItem? (descripción = task en foco)  ──no──► sync(data de task 2)
   │                                                  paso en foco sigue PENDING
   │                                                  (attempts intacto)
   └─ sí ──► update tarea en foco con lo que dio ──► RESOLVED / failOrRetry
```

Dónde está contemplado:

- `lib/chat-flow-strategy.ts` (`focusWorkItem`) — localiza la tarea en foco por descripción normalizada en lugar de asumir `data[0]`.
- `lib/chat-flow-strategy.ts` — runs de `CLARIFY_DATOS` y `CLARIFY_ADICIONAL`: si no hay `focusItem` (intent `QUERY_TASK`/`UNKNOWN`/`DELETE_TASK`), resuelven según el intent sin tocar el paso en foco (borran si es DELETE, responden sin escribir si es consulta).

---

## 4. Los flujos

El flujo se resuelve desde el `step_type` del único `pending_step` activo
(`resolveFlow`). Cualquier tipo no soportado cae a `FRESH`.

### Contrato LLM → backend (esquema intent/data)

El modelo responde siempre un JSON validado estricto (`assertLLMResponse` en
`actions.ts`, sin rescates): `gemini-2.5-flash` impone el `responseSchema` a
nivel API (structured output nativo) y además el parse valida cada campo.
Declara la **intención** del turno y el backend ejecuta según el flujo activo.

```json
{
  "intent": "CREATE_TASK | UPDATE_TASK | DELETE_TASK | QUERY_TASK | UNKNOWN",
  "respuesta": "string",
  "status": "completed | pending",
  "data": [
    {
      "description": "string",
      "quantity": "number | null",
      "precio": "number | null",
      "add": "boolean | null"
    }
  ],
  "missing": ["string"],
  "confidence": "number (0 a 1)"
}
```

| Intent | Qué significa | Qué hace el `run` |
|---|---|---|
| `CREATE_TASK` | Tarea nueva (no registrada) | `sync` la inserta; si queda incompleta encola `CLARIFY_DATOS` |
| `UPDATE_TASK` | Se refiere a una registrada (descripción exacta): completar cantidad/precio o sumar unidades (`add: true`) | `sync`/`update` mergea; los aumentos con cantidad se resuelven al instante |
| `DELETE_TASK` | Quiere eliminar una registrada | `removeByDescription` (match exacto); los `pending_steps` asociados caen por CASCADE |
| `QUERY_TASK` | Pregunta sobre el estado/lista | No escribe en la base, solo responde |
| `UNKNOWN` | No se entiende qué quiere | No escribe en la base; `missing` + pregunta aclaratoria |

| Flujo (`CHAT_FLOWS`) | Se dispara con | Cuándo ocurre | Qué le pide el `prompt` al LLM | Qué hace el `run` |
|---|---|---|---|---|
| `FRESH` → `"fresh"` | sin paso activo | turno normal (nueva petición) | Declarar el `intent` (CREATE/UPDATE/DELETE/QUERY/UNKNOWN) y armar `data`: (1) `CREATE_TASK` → tarea nueva con datos dados; (2) `UPDATE_TASK` → tarea registrada por descripción exacta (con `add: true` si suma unidades); (3) `DELETE_TASK` → descripción exacta de la que se elimina; (4) `QUERY_TASK`/`UNKNOWN` → `data` vacío. Si algo queda sin dato → `status pending`, `missing`, una única pregunta | Ramifica por `intent`: DELETE borra; QUERY/UNKNOWN no escribe; CREATE/UPDATE sincronizan (aumentos con cantidad se resuelven al instante, aumentos sin cantidad encolan `CLARIFY_CANTIDAD_ADICIONAL`, tarea incompleta encola `CLARIFY_DATOS`) |
| `CLARIFY_DATOS` → `"clarify"` | `CLARIFY_DATOS` | el usuario respondió la pregunta por cantidad/precio que faltaba | Declarar `UPDATE_TASK` y completar **solo** lo que el usuario dio (description exacta + quantity/precio); `DELETE_TASK` si pide borrar; `QUERY_TASK`/`UNKNOWN` con `data` vacío si es consulta; `completed` si queda todo definido | Rellena sin pisar con `null` lo ya definido, `update` la tarea; DELETE borra y resuelve el paso; QUERY/UNKNOWN deja el paso `PENDING` sin gastar intentos; `sync` además **apila** las tareas nuevas que la IA devuelva como items extra; `resolveStep` o `failOrRetryStep` (máx 3 intentos) |
| `CLARIFY_ADICIONAL` → `"additive"` | `CLARIFY_CANTIDAD_ADICIONAL` | el usuario respondió **cuánto sumar** a una tarea registrada | Declarar `UPDATE_TASK` con `quantity` = SOLO el adicional a sumar (o `pending` si no dio número) | `quantity = existente + adicional`, `update`; excluye la tarea en foco del sync y **apila** las nuevas que devuelva; `resolveStep` o `failOrRetryStep` |

### Máquina de estados (cómo avanza el chat)

Cada turno pertenece a un estado (flujo) según el único `pending_step` activo.
La **IA** decide las transiciones (interpreta la intención y devuelve
`intent`/`status`/`data`), el **backend** las ejecuta (el `run` persiste y
resuelve/encola). El estado nunca vive en la memoria del modelo: se relee de
Postgres en cada turno.

```
  [FRESH]  (sin paso activo)
     ├─ intent CREATE: tarea nueva COMPLETA ────► sync ──────────────────────────► "completed"
     ├─ intent CREATE: tarea nueva INCOMPLETA ──► sync + enqueue CLARIFY_DATOS ──► "pending"
     ├─ intent UPDATE: aumento CON cantidad ────► suma + mensaje con números ────► "completed"
     ├─ intent UPDATE: aumento SIN cantidad ────► enqueue CLARIFY_CANTIDAD_ADICIONAL ──► "pending"
     ├─ intent DELETE ──────────────────────────► removeByDescription (CASCADE) ─► "completed"
     └─ intent QUERY/UNKNOWN ───────────────────► solo responde ─────────────────► sin cambios

  [CLARIFY_DATOS]  (faltaba cantidad/precio de la tarea en foco)
     ├─ intent UPDATE: todo definido ──► update + RESOLVED ──► ¿otra incompleta?
     │                                    ├─ sí ──► enqueue CLARIFY_DATOS ──► "pending"
     │                                    └─ no ──► "completed"
     ├─ intent UPDATE: falta algo ──► attempts+1 ──┬─ <3 ──► PENDING (repregunta, "pending")
     │                                              └─ =3 ──► FAILED (sigue sin el dato, "pending")
     ├─ intent DELETE ──► removeByDescription + RESOLVED ──► "completed"
     └─ intent QUERY/UNKNOWN ──► sin escribir; paso en foco sigue PENDING (attempts intacto)

  [CLARIFY_ADICIONAL]  (cuánto sumar a la tarea en foco)
     ├─ dio cantidad ──► quantity = existente + adicional ──► RESOLVED ──► ¿otra incompleta?
     │                                                            ├─ sí ──► enqueue CLARIFY_DATOS
     │                                                            └─ no ──► "completed"
     ├─ no dio ──► attempts+1 ──┬─ <3 ──► PENDING (repregunta)
     │                           └─ =3 ──► FAILED
     └─ intent DELETE ──► removeByDescription + RESOLVED
```

| Desde | Condición (lo que detecta el turno) | Acción del `run` | Resultado |
|---|---|---|---|
| FRESH | intent CREATE: tarea completa (quantity + precio) | `sync` | `completed` |
| FRESH | intent CREATE: tarea incompleta | `sync` + `enqueueStep(CLARIFY_DATOS)` | `pending` |
| FRESH | intent UPDATE: aumento con cantidad | suma + mensaje con números reales | `completed` |
| FRESH | intent UPDATE: aumento sin cantidad | `enqueueStep(CLARIFY_CANTIDAD_ADICIONAL)` | `pending` |
| FRESH | intent DELETE | `removeByDescription` (CASCADE limpia `pending_steps`) | `completed` |
| FRESH | intent QUERY/UNKNOWN | no escribe; solo responde | sin cambios |
| CLARIFY_DATOS | intent UPDATE: quedó todo definido | `update` + `resolveStep` → ¿siguiente incompleta? | `pending` o `completed` |
| CLARIFY_DATOS | intent UPDATE: sigue faltando algo | `update` + `failOrRetryStep` | `pending` (repregunta) o `FAILED` |
| CLARIFY_DATOS | intent DELETE | `removeByDescription` + `resolveStep` | `completed` |
| CLARIFY_DATOS | intent QUERY/UNKNOWN (resolvió OTRA) | `sync` de las otras; paso en foco sigue `PENDING` sin gastar intentos | `pending` |
| CLARIFY_ADICIONAL | dio la cantidad | `update` (suma) + `resolveStep` → ¿siguiente incompleta? | `pending` o `completed` |
| CLARIFY_ADICIONAL | no dio la cantidad | `failOrRetryStep` | `pending` (repregunta) o `FAILED` |
| CLARIFY_ADICIONAL | intent DELETE | `removeByDescription` + `resolveStep` | `completed` |
| CLARIFY_ADICIONAL | intent QUERY/UNKNOWN (resolvió OTRA) | `sync` de las otras; paso en foco sigue `PENDING` sin gastar intentos | `pending` |

### Ciclo completo (ejemplo real)

```
Turno 1  "Instalación de TV de 55 pulgadas"      ──► FRESH: crea task PENDING, encola CLARIFY_DATOS
Turno 2  "2 unidades a $100000"                  ──► CLARIFY_DATOS: completa, RESOLVED
Turno 3  "Sumame 3 más"                          ──► FRESH: aditivo con cantidad → 2+3=5 al instante
Turno 4  "Sumame a instalación de TV" (sin nº)   ──► FRESH: aditivo sin cantidad → encola CLARIFY_CANTIDAD_ADICIONAL
Turno 5  "3"                                     ──► CLARIFY_ADICIONAL: 5+3=8, RESOLVED
```

---

## 5. Tablas de la base de datos

| Tabla | Rol en el chat |
|---|---|
| `conversations` | Sesión de chat del usuario (`status`, `cliente_id`, `trabajo_id` — se vincula al volcar). |
| `pending_steps` | Cola de aclaraciones: `step_type`, `status` (`PENDING`/`RESOLVED`/`FAILED`), `attempts`. **Solo hay un `PENDING` a la vez** (FR-004/FR-008). |
| `tasks_snapshot` | Snapshot de las tareas del chat (`description`, `quantity`, `precio`, `status` derivado). Es el "borrador" de la conversación. |
| `trabajos` | Trabajo de destino (creado o reutilizado por `loadTasksIntoJob`). |
| `tareas` | Tareas **reales** del trabajo (destino final del volcado; las que no tienen precio se cargan como descriptivas). |

---

## 6. Reglas clave

- **Sin historial de mensajes** (FR-006): la memoria del chat es el estado (`tasks_snapshot` + `pending_step`), no los textos previos. Cada prompt se construye desde cero: `latestMessage` + `buildRegisteredContext` (+ contexto de la tarea en foco si hay aclaración). El `history` de Gemini no se usa.
- **Una tarea a la vez** (FR-004/FR-008): `actions.ts` toma el primer `pending_step` `PENDING`; si hay aclaración solo se enruta el contexto de esa tarea.
- **Merge por descripción normalizada exacta** (FR-007): quién decide que es "la misma tarea" es la IA (usa el contexto de `buildRegisteredContext` con la descripción exacta); el backend valida con `trim().toLowerCase()`.
- **Aumentos**: `add: true` → con cantidad se suma y resuelve en el turno; sin cantidad queda pendiente y se encola `CLARIFY_CANTIDAD_ADICIONAL`.
- **Tarea en foco por descripción, no por orden**: el `run` identifica el item de la tarea en foco con `focusWorkItem` (match normalizado) y resuelve las demás por `sync`; si el usuario atiende otra petición (intent `QUERY_TASK`/`UNKNOWN`/`DELETE_TASK`), el paso de la en foco queda `PENDING` sin gastar intentos (o se resuelve si borró).
- **Máximo 3 intentos** (FR-005/US3): `MAX_CLARIFICATION_ATTEMPTS`; al superarlo el paso pasa a `FAILED` y se sigue con la tarea sin ese dato.
- **`status` derivado**: `COMPLETED` solo si `quantity` y `precio` están definidos.
- **No pisar con `null`**: en los flujos de clarificación se rellena solo lo que el usuario aportó.
- **Respuesta limpia**: `sanitizeRespuesta` corta en la primera repetición de frase y limita a 600 caracteres.

---

## 7. Patrones de referencia

El diseño sigue patrones establecidos en la industria y la literatura de LLMs:

| Patrón | En qué consiste | Dónde está acá |
|---|---|---|
| **Slot Filling + Dialogue State Tracking (DST)** | El "intent frame" define slots (`cantidad`, `precio`); el DST persiste qué slots faltan y dispara las preguntas de relleno en diálogo multi-turno. | `pending_steps` = dialog state persistido; `missingFieldsOf` = slot tracking; `CLARIFY_DATOS` rellena slots sin pisar lo ya dado. |
| **Agent-as-State-Machine (FSM / StateFlow)** | El agente es una máquina de estados: el código posee el estado y las transiciones; el LLM opera dentro del estado. Cada turno es un checkpoint reanudable. | `resolveFlow(step_type)` = transición; estados `PENDING`/`RESOLVED`/`FAILED` + `attempts`; todo releído de Postgres en cada turno. |
| **"Code owns state, LLM owns language"** (control surfaces) | El LLM nunca decide si "ya recolectó todo" o "debo ejecutar": el código valida, persiste y dispara. El LLM solo interpreta y genera texto. | Separación `strategy.prompt` (LLM) / `strategy.run` (backend); el `status` final lo decide el backend, no el LLM. |
| **Progressive disclosure** | Una sola pregunta a la vez, sin adelantar pasos futuros. | Una tarea a la vez (FR-004/FR-008) + prompts que exigen UNA pregunta corta. |
| **Cola FIFO de trabajo** | Las unidades de trabajo esperan en orden y se procesan de a una. | Tareas incompletas en `tasks_snapshot` + `findNextIncomplete` por `created_at`. |

Referencias:
- [Slot Filling & DST — Inferensys](https://inferensys.com/glossary/answer-engine-architecture/conversational-context-management/slot-filling)
- [Zero-shot Slot Filling in the Age of LLMs (arxiv 2406.08848)](https://arxiv.org/html/2406.08848v1)
- [Slot Filling Pattern — CXAS SCRAPI (Google)](https://googlecloudplatform.github.io/cxas-scrapi/latest/patterns/slot-filling)
- [FSM y Statecharts para orquestación de agentes — Zylos](https://zylos.ai/research/2026-04-02-finite-state-machines-statecharts-ai-agent-orchestration/)
