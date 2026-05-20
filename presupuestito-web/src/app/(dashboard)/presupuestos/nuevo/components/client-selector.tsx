"use client";

import { User, ChevronRight } from "lucide-react";

export function ClientSelector() {
  return (
    <section>
      <h2 className="px-4 pb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
        Cliente
      </h2>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <User className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-on-surface">Seleccionar Cliente</span>
          </div>
          <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}
