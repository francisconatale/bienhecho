export function TrabajoDetailSkeleton() {
  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-transparent">
      {/* Back button skeleton */}
      <div className="px-4 py-2.5">
        <div className="w-20 h-4 bg-outline-variant/10 rounded animate-pulse" />
      </div>

      <main className="flex-1 px-4 py-4 pb-28 md:px-8 md:py-6 md:pb-12 max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="w-48 h-5 bg-outline-variant/10 rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-64 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
            <div className="w-24 h-9 bg-outline-variant/10 rounded-lg animate-pulse" />
          </div>
          <div className="w-40 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-3 p-4 bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15">
          <div className="w-8 h-8 rounded-full bg-outline-variant/10 animate-pulse" />
          <div className="flex-1">
            <div className="w-24 h-3 bg-outline-variant/10 rounded animate-pulse mb-1.5" />
            <div className="w-16 h-5 bg-outline-variant/10 rounded animate-pulse" />
          </div>
          <div className="w-28 h-9 bg-outline-variant/10 rounded-lg animate-pulse" />
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-outline-variant/10 rounded-full animate-pulse" />

        {/* Tasks section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-32 h-5 bg-outline-variant/10 rounded animate-pulse" />
            <div className="w-24 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-outline-variant/15 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-3/4 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/2 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
                <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Materials / Payments quick view */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 p-5 shadow-sm">
              <div className="w-28 h-4 bg-outline-variant/10 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="flex-1 h-3 bg-outline-variant/10 rounded animate-pulse" />
                    <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
