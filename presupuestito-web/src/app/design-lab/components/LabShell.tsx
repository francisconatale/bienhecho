"use client";

interface Variant {
  id: string;
  label: string;
  rationale: string;
  children: React.ReactNode;
}

export function LabShell({ targetName, variants }: { targetName: string; variants: Variant[] }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black tracking-tight text-on-surface">
                Design Lab: {targetName}
              </h1>
              <p className="text-xs text-on-surface-variant/50 font-medium mt-0.5">
                Explorá 5 variantes y elegí tu favorita
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/30">
                {variants.length} variantes
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-min">
          {variants.map((v) => (
            <div
              key={v.id}
              data-variant={v.id}
              className="bg-surface rounded-[32px] border border-outline-variant/10 shadow-sm overflow-hidden"
            >
              {/* Variant header */}
              <div className="px-6 pt-5 pb-3 border-b border-outline-variant/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary font-black text-sm">
                    {v.id}
                  </span>
                </div>
                <h3 className="font-black text-sm text-on-surface mt-2">{v.label}</h3>
                <p className="text-xs text-on-surface-variant/50 font-medium mt-0.5 leading-relaxed">
                  {v.rationale}
                </p>
              </div>

              {/* Variant content */}
              <div className="p-6">{v.children}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
