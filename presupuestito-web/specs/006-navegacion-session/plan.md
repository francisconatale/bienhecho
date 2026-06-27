# Plan: Navigation State Refactor (Session Storage & Stack)

## 1. Storage Utility (Custom Hook)
Create a new file `src/hooks/use-navigation-history.ts`.
- **State**: A JSON array of strings stored in `sessionStorage` under the key `nav_stack`.
- **Functions**:
  - `pushHistory(url: string)`: Pushes the given URL to the top of the stack.
  - `popHistory(fallbackUrl: string)`: Removes the top URL from the stack and returns it. If the stack is empty, it returns the `fallbackUrl`.
  - `clearHistory()`: Empties the stack.

## 2. Refactoring the Navigation Triggers (Push)
Whenever we navigate "deeper" into the application (e.g., from a List to a Detail page), we must push the current URL (including its search params) to the stack.
- **`src/app/trabajos/[id]/components/task-item.tsx`**:
  - Change the `<Link>` that navigates to the Tarea detail.
  - Add an `onClick` handler that calls `pushHistory(window.location.pathname + window.location.search)`.
  - Simplify the `href` to just `/trabajos/${jobId}/tareas/${task.id}` (removing `?from=...`).

## 3. Refactoring the Back Buttons (Pop)
Whenever the user clicks "Volver", we must pop the stack and navigate to the returned URL.
- **`src/app/trabajos/[id]/tareas/[tareaId]/page.tsx`**:
  - Replace the static `backHref` generation.
  - Import `useRouter` and `useNavigationHistory`.
  - Define a generic fallback URL: `/trabajos?id=${id}`.
  - Pass a custom `onBack` function to `<MobilePageHeader>` that executes `const returnUrl = popHistory(fallback); router.push(returnUrl);`.
  - Add `&dir=back` to the popped URL if we still want to preserve the sliding animation.
- **`src/components/ui/mobile-page-header.tsx`**:
  - Ensure it supports an `onBackClick` callback. If provided, it uses a `<button>` to trigger the callback instead of a `<Link>` with `href`.

## 4. Cleanup
- Remove the unused query parameters (`from`, `clienteId`, `jobId`) from components that previously parsed them from `useSearchParams`.

## 5. Next Steps
Once this plan is approved, we will proceed with the implementation, starting with creating the hook and applying it to the Task views first to ensure the pattern works as expected.
