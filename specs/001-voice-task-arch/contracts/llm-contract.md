# Contracts: LLM Parser

## LLM Output Schema (Structured Outputs)

El modelo de lenguaje está configurado mediante `responseSchema` (usando `@google/generative-ai`) para retornar estrictamente el siguiente formato JSON.

**Ejemplo de Tarea Incompleta (Status: Pending)**
```json
{
  "respuesta": "¿Cuántas Coca Colas necesitas cargar y a qué precio unitario?",
  "status": "pending",
  "workItems": [
    {
      "description": "Coca Cola",
      "quantity": null,
      "precio": null
    }
  ],
  "missing": [
    "quantity",
    "precio"
  ]
}
```

**Ejemplo de Tarea Completa (Status: Completed)**
```json
{
  "respuesta": "Perfecto, he registrado 2 Coca Colas a $1500 c/u.",
  "status": "completed",
  "workItems": [
    {
      "description": "Coca Cola",
      "quantity": 2,
      "precio": 1500
    }
  ],
  "missing": []
}
```

**Ejemplo de Aumento de Cantidad (add)**
```json
{
  "respuesta": "Listo, sumo 3 a las 2 que ya tenías.",
  "status": "completed",
  "workItems": [
    {
      "description": "Instalación de TV",
      "quantity": 3,
      "add": true
    }
  ],
  "missing": []
}
```

Si el usuario pidió el aumento **sin** decir la cantidad, `quantity` va en `null` y `status` en `pending` (el backend encola `CLARIFY_CANTIDAD_ADICIONAL` y vuelve a preguntar cuántas agregar).

### Propiedades
- **`respuesta`** (String): El texto amigable que el asistente le muestra al usuario (e.g. haciendo la pregunta concreta si falta información).
- **`status`** (String - Enum): `completed` si la tarea tiene `quantity` y `precio` definidos, o `pending` si el usuario debe aclarar alguno.
- **`workItems`** (Array): Lista de los items detectados. Cada item requiere `description` (String) y opcionalmente `quantity` (Number) y `precio` (Number, precio unitario). `add` (Boolean) marca un AUMENTO de cantidad a una tarea ya registrada (misma descripción exacta); `quantity` es SOLO la cantidad adicional a sumar.
- **`missing`** (Array): Lista de strings que indica cuáles son los campos que aún faltan completar (para uso interno del backend).



Para cada tarea deberia hacerse por separado lo siguiente


conversacion{ tareas: [
                  tarea: {id: 1, descripcion: "toma corrientes", cantidad: 1, }
                  tarea2: {id: 2, descripcion: "cortar luz", cantidad: null,}
          ]
          pending_steps: [(CLARIFY_CANTIDAD, id: 2 )]
}


