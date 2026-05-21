## Design Review: Flujo de Nuevo Presupuesto

### Fortalezas ✅
- **Flujo Simplificado:** La división en dos pasos (Cliente → Detalles) reduce la carga cognitiva, permitiendo que el usuario se enfoque en una tarea a la vez.
- **Divulgación Progresiva:** Los selectores de cliente, proyecto y trabajo se despliegan solo cuando es necesario, manteniendo la interfaz limpia.
- **Retroalimentación Táctica:** El uso de escalas en botones y micro-animaciones (animate-in) mejora la percepción de calidad y respuesta del sistema.
- **Consistencia de Datos:** La implementación de Cantidad x Precio Unitario se alinea con el modelo mental de los profesionales de oficio (electricistas, plomeros, etc.).

### Problemas de Usabilidad 🔴
1. **Riesgo de Superposición en Header** (Severidad: Menor)
   - **Qué:** El título de la página está posicionado de forma absoluta al centro.
   - **Impacto:** En dispositivos móviles muy angostos, el título podría colisionar con los botones de "Cancelar" o "Guardar".
   - **Recomendación:** Usar un layout flexible (flexbox) para el header o truncar el título si el espacio es insuficiente.

2. **Navegación de Cancelación Abrupta** (Severidad: Menor)
   - **Qué:** El botón "Cancelar" lleva directamente a la raíz (`/`).
   - **Impacto:** Si el usuario inició el flujo desde una pantalla de cliente o proyecto específica, pierde el contexto de retorno esperado.
   - **Recomendación:** Implementar una navegación basada en historial o preguntar al usuario si desea descartar los cambios.

### Preocupaciones de Accesibilidad 🟠
1. **Contraste de Labels Secundarios**
   - **WCAG Criterion:** 1.4.3 Contrast (Minimum).
   - **Estado:** Los labels en mayúsculas con tracking ancho usan `text-on-surface-variant`. Es necesario verificar que cumplan con el ratio 4.5:1, especialmente en modo oscuro.

### Oportunidades de Mejora 🟡
1. **Previsualización del PDF:** Actualmente el usuario completa los datos pero no ve una representación visual de cómo quedará el presupuesto hasta que finaliza. Agregar una "Vista Previa" rápida aumentaría la confianza antes de guardar.
2. **Estilo Visual vs. Perfil de Usuario:** El "Aurora Background" es elegante pero quizás demasiado "techy". Un diseño más sólido y orientado a la "herramienta" (tipo bento grid o con bordes más definidos) podría resonar mejor con el orgullo del oficio manual.

---
*Revisión realizada aplicando la skill ux-designer y ui-ux-pro-max.*
