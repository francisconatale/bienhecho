# Store Interface Contract: Dashboard Operativo

El `DataState` (Zustand store) ahora incluye soporte nativo para los nuevos campos en `Task` y `Material`.

## Updates to Task Model
```typescript
interface Task {
  // ... existing fields
  prioridad?: "alta" | "media" | "baja";
  fecha_vencimiento?: string;
}
```

## Updates to Material Model
```typescript
interface Material {
  // ... existing fields
  comprado: boolean;
}
```

## Hooks a utilizar en la UI
Los componentes del dashboard interactuarán con el store utilizando los selectores y actions existentes:
- `useDataStore(state => state.tasks)`
- `useDataStore(state => state.jobs)`
- `useDataStore(state => state.materiales)`
- `useDataStore(state => state.updateTask)`
- `useDataStore(state => state.updateMaterial)`
