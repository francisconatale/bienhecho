
---

## Patrón: Master-Detail con Paginación Server-Side

**Problema conocido:** Al usar el componente `<MasterDetail>` junto con listas paginadas desde el servidor, si un usuario navega hacia un ítem específico a través de la URL (ej. `?id=UUID`) y dicho ítem no se encuentra en la página actual (por defecto la página 1), el componente `MasterDetail` no lo encontrará en su array de `items` y renderizará el panel de detalle en blanco (white screen).

**Solución obligatoria:**
1. El hook o componente que alimenta al `<MasterDetail>` (ej. `useClients`, `JobList`) **debe** implementar una query secundaria para obtener individualmente el ítem faltante si no está en la página actual:
   ```tsx
   const { data: missingItem } = useQuery({
     queryKey: ["item", selectedId],
     queryFn: () => service_getById(selectedId!),
     enabled: !!selectedId && !items.some(i => i.id === selectedId),
   });
   
   const selectedInPage = items.find((i) => i.id === selectedId) || null;
   const selected = selectedInPage || missingItem || null;
   ```
2. Pasar el ítem obtenido explícitamente al prop `selectedItem` del componente `<MasterDetail>`:
   ```tsx
   <MasterDetail
     selectedId={selectedId}
     selectedItem={selected} // <- Clave para forzar el render
     items={items}
     // ...
   />
   ```
