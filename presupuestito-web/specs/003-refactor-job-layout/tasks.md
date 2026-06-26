# Tareas: Refactor de Layout

- [ ] Definir con el usuario si prefiere mover Materiales y Pagos a sub-rutas `/trabajos/[id]/materiales` y `/trabajos/[id]/pagos`, o si prefiere dejarlos en el `page.tsx` pero rediseñados visualmente para lucir idénticos al listado de Tareas.
- [ ] En caso de sub-rutas, crear los directorios y `page.tsx` correspondientes.
- [ ] Mover los componentes complejos (Dashboards y Forms) a las sub-rutas.
- [ ] Crear componentes de tipo "Summary Card" o "Listas Simplificadas" para colocar en el `page.tsx` principal. Estos componentes solo mostrarían el total de ítems, el saldo/monto, y un botón "Ver / Editar" que navega a la sub-ruta.
- [ ] Si se opta por mantener in-place, refactorizar `PaymentsDashboard` para ser visualmente una simple lista colapsable o integrada limpiamente.
- [ ] Ajustar estilos usando Glassmorphism (`bg-surface/40 dark:bg-surface/10 backdrop-blur-xl`) para los ítems resumen en el layout principal.
