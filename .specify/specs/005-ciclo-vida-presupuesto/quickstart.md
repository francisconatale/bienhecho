# Quickstart: Ciclo de Vida del Presupuesto

> Guía de validación rápida para verificar que la funcionalidad funciona end-to-end.

## Prerequisitos

- Proyecto corriendo: `npm run dev`
- Sin datos previos requeridos (se pueden crear desde cero)

## Escenario 1: Trabajo arranca como borrador

1. Ir a `/trabajos/nuevo`
2. Completar formulario con datos mínimos (título, cliente, dirección, presupuesto)
3. Guardar
4. **Esperado**: El trabajo aparece en la lista con estado "borrador" (badge azul)
5. Abrir detalle → el badge muestra "Borrador"

## Escenario 2: Generar presupuesto y emitir

1. Desde un trabajo en "borrador", hacer clic en "Generar presupuesto"
2. **Esperado**: Se genera el PDF y aparece un diálogo modal
3. El diálogo tiene 2 opciones visibles: "Emitir presupuesto" y "Solo guardar PDF"
4. Seleccionar "Emitir presupuesto"
5. **Esperado**: El trabajo cambia a estado "presupuestado" (badge ámbar)

## Escenario 3: Generar presupuesto y solo guardar PDF

1. Desde un trabajo en "borrador", hacer clic en "Generar presupuesto"
2. En el diálogo, seleccionar "Solo guardar PDF"
3. **Esperado**: El PDF se descarga pero el trabajo SIGUE en estado "borrador"

## Escenario 4: Cancelar diálogo post-PDF

1. Desde un trabajo en "borrador", generar presupuesto
2. En el diálogo, cerrar sin seleccionar opción (clic fuera / X / Escape)
3. **Esperado**: El trabajo SIGUE en estado "borrador". No cambió a presupuestado

## Escenario 5: Marcar trabajo como pagado

1. Desde un trabajo en "presupuestado", hacer clic en "Marcar como pagado"
2. **Esperado**: El estado cambia a "pagado" (badge verde), aunque los cobros no cubran el total

## Escenario 6: Pago único → automático a pagado

1. Tener un trabajo en "presupuestado" con presupuesto = $1000
2. Registrar un cobro de $1000
3. **Esperado**: El trabajo cambia automáticamente a "pagado" (badge verde) sin intervención del usuario

## Escenario 7: Trabajo pagado no permite generar presupuesto

1. Tener un trabajo en estado "pagado"
2. El botón "Generar presupuesto" debe estar deshabilitado o no visible
3. **Esperado**: Mensaje claro: "No se puede generar un presupuesto para un trabajo cerrado"

## Escenario 8: Pago en dos cuotas → automático al completar

1. Tener un trabajo en "presupuestado" con presupuesto = $1000
2. Registrar un cobro de $600 → el trabajo sigue en "presupuestado"
3. Registrar un cobro de $400 → suma total cubierta
4. **Esperado**: El trabajo pasa automáticamente a "pagado" sin preguntar

## Comandos de referencia

```bash
# Iniciar servidor
npm run dev

# Lint
npm run lint
```

## Referencias

- [Spec](./spec.md)
- [Data Model](./data-model.md)
- [Store Interface](./contracts/store-interface.md)
