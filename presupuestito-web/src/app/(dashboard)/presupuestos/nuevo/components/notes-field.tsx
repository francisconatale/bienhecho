"use client";

export function NotesField() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-400">
      <h2 className="px-4 pb-2 font-black text-[10px] text-on-surface-variant/50 uppercase tracking-widest">
        Notas
      </h2>
      <div className="bg-surface-container-low dark:bg-white/5 rounded-[20px] border border-outline-variant/20 overflow-hidden focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <div className="p-4">
          <textarea
            className="w-full bg-transparent border-none p-0 focus:ring-0 font-body text-[13px] text-on-surface placeholder:text-on-surface-variant/30 resize-none min-h-[60px] leading-relaxed"
            placeholder="Aclaraciones, tiempos de entrega..."
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}
