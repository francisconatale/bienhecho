export function CuentaCorrienteSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-transparent">
      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-5xl mx-auto w-full space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="w-56 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-72 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 p-4">
              <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse mb-2" />
              <div className="w-20 h-7 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Transactions list */}
        <div className="bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant/10">
            <div className="w-36 h-5 bg-outline-variant/10 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b border-outline-variant/5 last:border-0">
              <div className="w-10 h-10 rounded-full bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="w-20 h-5 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
