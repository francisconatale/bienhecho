# Specification: Navigation State Refactor (Session Storage)

## 1. Context and Problem
Currently, the application relies on URL query parameters to maintain navigation state across deep views. For example, when navigating from a Client to a Job, and then to a Task, the URL accumulates parameters like `?from=/clientes&clienteId=123&jobId=456`.
This approach has several drawbacks:
- URLs become excessively long and difficult to read.
- Sharing a URL might unintentionally share a specific back-navigation state that doesn't apply to the recipient.
- Managing and appending these parameters at every `<Link>` or `router.push()` is error-prone and scales poorly as the application grows.

## 2. Proposed Solution
We will extract the "where did I come from" logic out of the URL parameters and move it to a client-side storage mechanism using `sessionStorage`. 

### Option A: Custom Hook + SessionStorage (Recomendado)
Create a simple utility hook (`useNavigationHistory`) that reads/writes to `sessionStorage`.
- **Set state before navigating**: Before routing to a detail page, we save the current context (e.g., `currentPath` and `selectedId`) in `sessionStorage` under a specific key.
- **Read state when clicking 'Volver'**: The "Volver" button will query `sessionStorage` to determine the correct URL to return to. If no state is found, it defaults to a safe fallback (e.g., `/trabajos`).

### Option B: Zustand Navigation Store (con persistencia)
Since the project already uses Zustand, we can create a `useNavigationStore` with the `persist` middleware configured to use `sessionStorage`.
- The store would maintain a registry of "return paths" for specific entities.
- **Pros**: Reactive, easily accessible from any component without parsing JSON manually.
- **Cons**: Might be slight overkill for simple back-links, but very clean.

## 3. Implementation Plan

1. **Create the Storage Utility / Store**:
   - Create `src/hooks/use-navigation-history.ts` or `src/lib/navigation-store.ts`.
2. **Update Origin Components (Master Lists)**:
   - In `TaskItem`, `ClientList`, and `JobList`, replace the cumbersome URL construction in `<Link>` tags with a simple `/trabajos/123/tareas/456`.
   - Add an `onClick` handler that saves the current context to the session storage before the Next.js navigation happens.
3. **Update Detail Components (The 'Volver' Buttons)**:
   - In `TareaDetailPage`, `TrabajoDetail`, and generic mobile headers, modify the `backHref` logic.
   - Instead of reading `searchParams.get('from')`, they will read from the session storage to construct the "Volver" link or execute a `router.push()`.
4. **Cleanup**:
   - Remove `from`, `clienteId`, and `jobId` from the `useSearchParams` across all detail pages.

## 4. Discussion / Feedback Required
- ¿Preferís que armemos un **Zustand Store** (Opción B) dedicado a esto, o simplemente un **Custom Hook** (Opción A) que lea y escriba en el `sessionStorage` directamente?
- ¿Querés que guardemos el historial como un **Stack** (una pila tipo historial del navegador) o que simplemente guardemos el **"último punto de entrada"** principal?
