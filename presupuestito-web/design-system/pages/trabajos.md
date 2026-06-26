# Page Override: /trabajos

> Extiende MASTER.md. Solo documenta lo que difiere del master.

## Problema específico de esta página

La página de trabajos tiene el peor caso de "mobile-stretched en desktop":
- `p-6` en cada item → 24px vertical, parece card de hotel
- `w-14 h-14` en el ícono → sobredimensionado
- `text-lg` en el título del item → demasiado para lista densa
- `mb-10` entre header y lista → gap innecesario
- Header inline con `h1 text-4xl font-black` → no usa el componente `<Header>`
- Panel de filtros siempre oculto detrás de botón → en desktop debería ser inline

## Layout correcto para esta página

```
mobile:  Header sticky → main (mt-20, px-4, pb-28) → space-y-4
           ├── SearchBar (compacta)
           ├── ResultCount
           └── ListGroup con ListItems

desktop: TopNav sticky → main (md:mt-0, px-8, pb-12)
           ├── [row] SearchBar + FilterChips inline
           ├── ResultCount
           └── ListGroup con ListItems (max-w-3xl centrado)
```

## Filtros en desktop

En desktop, mostrar los clientes como chips inline en lugar del panel flotante:

```tsx
{/* Desktop: chips visibles */}
<div className="hidden md:flex items-center gap-2 flex-wrap">
  <FilterChip
    label="Todos"
    active={!selectedClientId}
    onClick={() => setSelectedClientId(null)}
  />
  {clients.map(c => (
    <FilterChip
      key={c.id}
      label={c.nombre}
      active={selectedClientId === c.id}
      onClick={() => setSelectedClientId(c.id)}
    />
  ))}
</div>

{/* Mobile: botón flotante */}
<button className="md:hidden ..."><Filter /></button>
```

## Tamaños correctos para items de esta lista

| Elemento        | Clase correcta                  |
|-----------------|---------------------------------|
| Container ícono | `w-10 h-10 rounded-xl`          |
| Ícono           | `w-5 h-5`                       |
| Título trabajo  | `text-sm font-semibold`         |
| Cliente         | `text-xs text-on-surface-variant/70` |
| Badge status    | `text-[10px] font-bold uppercase` |
| Padding item    | `py-3 px-4` (via ListItem)      |
