"use client";

import { useState } from "react";

export function FeedbackOverlay({ targetName }: { targetName: string }) {
  const [active, setActive] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  if (!active) {
    return (
      <button 
        onClick={() => setActive(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
      >
        Añadir Feedback
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-2xl w-[350px]">
      <h3 className="font-bold text-lg mb-2 dark:text-white">Feedback: {targetName}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Escribí tus comentarios sobre las variantes. Podés copiar este texto luego para pegarlo en el chat.
      </p>
      
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Ej: Me gusta la Variant C para el layout, pero con los colores de la A..."
        className="w-full h-[150px] p-3 border border-gray-200 dark:border-zinc-800 rounded-lg mb-4 bg-gray-50 dark:bg-zinc-950 text-sm dark:text-white"
      />
      
      <div className="flex gap-2">
        <button 
          onClick={() => setActive(false)}
          className="flex-1 py-2 rounded-lg font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Cerrar
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(feedback);
            alert("Feedback copiado al portapapeles. Pegalo en la consola de Antigravity.");
          }}
          className="flex-1 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Copiar Feedback
        </button>
      </div>
    </div>
  );
}
