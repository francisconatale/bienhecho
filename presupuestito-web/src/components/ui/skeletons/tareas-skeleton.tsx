export function TareasSkeleton() {
  return (
    <>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 md:px-8 lg:px-10 xl:px-16 py-6 md:py-10 space-y-6">
        <TareasSkeletonContent />
      </main>
    </>
  );
}

export function TareasSkeletonContent() {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between pb-6">
        <div className="space-y-2">
          <div className="w-48 h-8 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-64 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-20 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="w-20 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden mt-10">
        <div className="w-48 h-8 bg-outline-variant/10 rounded-xl animate-pulse" />
        <div className="w-56 h-4 bg-outline-variant/10 rounded animate-pulse mt-2" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        <div className="w-28 h-9 bg-outline-variant/10 rounded-2xl animate-pulse" />
        <div className="w-28 h-9 bg-outline-variant/10 rounded-2xl animate-pulse" />
      </div>

      {/* Task groups */}
      <div className="space-y-6">
        {["Urgentes", "Próximamente", "Sin Apuro"].map((_, groupIdx) => (
          <div key={groupIdx} className="space-y-0 divide-y divide-outline-variant/10">
            {/* Group header */}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="w-24 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-6 h-5 bg-outline-variant/10 rounded-full animate-pulse" />
            </div>
            {/* Items */}
            {[1, 2].map((_, itemIdx) => (
              <div
                key={itemIdx}
                className="flex items-center gap-4 px-4 py-3"
              >
                <div className="w-6 h-6 rounded-lg border-2 border-outline-variant/15 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="w-3/4 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-1/2 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="w-[30px] h-[30px] bg-outline-variant/10 rounded-full animate-pulse" />
                  <div className="w-[44px] h-[44px] bg-outline-variant/10 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
