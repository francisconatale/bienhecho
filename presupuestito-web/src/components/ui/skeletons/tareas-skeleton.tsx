export function TareasSkeleton() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-10 space-y-6">
        <TareasSkeletonContent />
      </main>
    </>
  );
}

export function TareasSkeletonContent() {
  return (
    <>
      {/* Header */}
      <div className="hidden md:flex items-center justify-between pb-6">
        <div className="flex items-center gap-5">
          <div className="space-y-2">
            <div className="w-48 h-8 bg-outline-variant/10 rounded-xl animate-pulse" />
            <div className="w-64 h-4 bg-outline-variant/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-20 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden pt-10">
        <div className="w-48 h-8 bg-outline-variant/10 rounded-xl animate-pulse" />
        <div className="w-56 h-4 bg-outline-variant/10 rounded animate-pulse mt-2" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-9 bg-outline-variant/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>

      {/* Task groups */}
      <div className="space-y-6">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-32 h-4 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-6 h-5 bg-outline-variant/10 rounded-full animate-pulse" />
            </div>
            {[1, 2, 3].map((task) => (
              <div
                key={task}
                className="flex items-center gap-3 p-4 bg-surface/60 backdrop-blur-xl rounded-xl border border-outline-variant/15 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full border-2 border-outline-variant/15 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-3/4 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-1/2 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
                </div>
                <div className="w-5 h-5 bg-outline-variant/10 rounded animate-pulse shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
