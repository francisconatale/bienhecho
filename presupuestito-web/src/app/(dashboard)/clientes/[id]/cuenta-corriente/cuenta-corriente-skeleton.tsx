"use client";

export function CuentaCorrienteSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-transparent">
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>
      <main className="relative z-10 flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-[1400px] mx-auto w-full space-y-6">
        <div className="space-y-2">
          <div className="w-56 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 p-4">
              <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse mb-2" />
              <div className="w-20 h-7 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
