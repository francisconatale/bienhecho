"use client";

export function NotesField() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <h2 className="px-5 pb-3 font-black text-[11px] text-on-surface-variant/50 uppercase tracking-[0.2em]">
        Notas del Presupuesto
      </h2>
      <div className="bg-surface-container-low dark:bg-white/5 rounded-[28px] border border-outline-variant/20 overflow-hidden focus-within:ring-4 focus-within:ring-primary/5 transition-all">
        <div className="p-5">
          <textarea
            className="w-full bg-transparent border-none p-0 focus:ring-0 font-body text-[14px] text-on-surface placeholder:text-on-surface-variant/30 resize-none min-h-[100px] leading-relaxed"
            placeholder="Escribe aquí aclaraciones, tiempos de entrega, validez de la oferta..."
            rows={4}
          />
        </div>
      </div>
      <div className="px-5 pt-3 flex items-start gap-2">
        <div className="w-1 h-1 rounded-full bg-primary mt-1.5 opacity-40 shrink-0" />
        <p className="text-[11px] font-bold text-on-surface-variant/60 leading-tight">
          Estas notas serán visibles en el documento PDF enviado al cliente.
        </p>
      </div>
    </section>
  );
}
