export function MaterialesSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-transparent">
      {/* Back button */}
      <div className="px-4 py-2.5">
        <div className="w-20 h-4 bg-outline-variant/10 rounded animate-pulse" />
      </div>

      <main className="relative flex-1 px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-12 max-w-4xl mx-auto w-full space-y-6">
        {/* Desktop breadcrumb */}
        <div className="hidden md:flex items-center gap-2 mb-4">
          <div className="w-40 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="w-44 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-64 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        {/* Add material form */}
        <div className="bg-surface/60  rounded-xl border border-outline-variant/15 p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1 h-10 bg-outline-variant/10 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-outline-variant/10 rounded-lg animate-pulse" />
            <div className="w-24 h-10 bg-outline-variant/10 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Materials list */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-surface/60  rounded-xl border border-outline-variant/15 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
              </div>
              <div className="text-right space-y-1.5">
                <div className="w-16 h-3.5 bg-outline-variant/10 rounded animate-pulse ml-auto" />
                <div className="w-12 h-2.5 bg-outline-variant/10 rounded animate-pulse ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
