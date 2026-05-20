"use client";

export function NotesField() {
  return (
    <section>
      <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
        Notas
      </h2>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-4">
          <textarea
            className="w-full bg-transparent border-none p-0 focus:ring-0 font-body text-on-surface placeholder:text-outline resize-none"
            placeholder="Notas adicionales para el presupuesto..."
            rows={4}
          />
        </div>
      </div>
      <p className="px-4 pt-2 text-[11px] text-on-surface-variant leading-tight">
        Estas notas aparecerán en el PDF final del presupuesto.
      </p>
    </section>
  );
}
