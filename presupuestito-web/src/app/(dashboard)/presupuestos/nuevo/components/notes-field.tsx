"use client";

export function NotesField() {
  return (
    <section>
      <label className="text-xs md:text-sm font-medium text-on-surface-variant mb-1.5 md:mb-2 block">Notas</label>
      <textarea
        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg md:rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm text-on-surface placeholder:text-on-surface-variant/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        rows={2}
        placeholder="Aclaraciones, tiempos de entrega..."
      />
    </section>
  );
}
