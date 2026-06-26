"use client";

export function NotesField() {
  return (
    <section>
      <label className="text-xs font-medium text-on-surface-variant mb-1.5 block">Notas</label>
      <textarea
        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg px-3 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        rows={2}
        placeholder="Aclaraciones, tiempos de entrega..."
      />
    </section>
  );
}
