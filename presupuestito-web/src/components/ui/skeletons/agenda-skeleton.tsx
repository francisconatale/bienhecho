export function AgendaSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden flex-1 flex flex-col px-4 pt-14 pb-28 space-y-6 w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="w-32 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-48 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/60 rounded-xl border border-outline-variant/15 p-3">
              <div className="w-10 h-3 bg-outline-variant/10 rounded animate-pulse mb-2" />
              <div className="w-8 h-6 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-surface/60 rounded-2xl border border-outline-variant/15 p-5 shadow-sm">
          {/* Calendar nav */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
            <div className="w-24 h-5 bg-outline-variant/10 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
              <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
            </div>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 bg-outline-variant/10 rounded animate-pulse" />
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square bg-outline-variant/8 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-24 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>

        {/* Visit list */}
        <div className="space-y-3">
          <div className="w-40 h-5 bg-outline-variant/10 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-surface/60 rounded-xl border border-outline-variant/15 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <main className="hidden md:block flex-1 pb-32 w-full pt-10 max-w-[1400px] mx-auto px-8 lg:px-10 xl:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="w-32 h-9 bg-outline-variant/10 rounded-xl animate-pulse" />
            <div className="w-48 h-4 bg-outline-variant/10 rounded animate-pulse" />
          </div>
          <div className="w-36 h-12 bg-primary/20 rounded-2xl animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface/60 rounded-xl border border-outline-variant/15 p-4">
              <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse mb-2" />
              <div className="w-12 h-7 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar skeleton */}
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="bg-surface/60 rounded-2xl border border-outline-variant/15 p-5 shadow-sm">
              {/* Calendar nav */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
                <div className="w-32 h-5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
                  <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
                </div>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="h-4 bg-outline-variant/10 rounded animate-pulse" />
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-outline-variant/8 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mt-4">
              <div className="flex-1 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
              <div className="w-32 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Visit list skeleton */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-40 h-5 bg-outline-variant/10 rounded animate-pulse" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-surface/60 rounded-xl border border-outline-variant/15 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
                </div>
                <div className="w-8 h-8 bg-outline-variant/10 rounded-lg animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Smart suggestions skeleton */}
        <div className="mt-6 bg-surface/60 rounded-2xl border border-outline-variant/15 p-5 shadow-sm">
          <div className="w-40 h-5 bg-outline-variant/10 rounded animate-pulse mb-4" />
          <div className="flex gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 h-20 bg-outline-variant/8 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
