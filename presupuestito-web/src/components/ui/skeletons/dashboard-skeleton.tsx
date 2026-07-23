export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Cargando dashboard">
      <span className="sr-only">Cargando...</span>
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col px-4 pt-14 pb-28 space-y-5">
        <div className="pt-4">
          <div className="w-64 h-9 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>
        <SkeletonStatCards />
        <SkeletonVisits />
        <SkeletonActivity />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex flex-col px-10 xl:px-16 pt-12 pb-16 gap-8 w-full max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-6 pt-4">
          <div className="w-80 h-14 bg-outline-variant/10 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-28 h-12 bg-outline-variant/10 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            <SkeletonStatCards row />
            <SkeletonActivity />
          </div>
          <div className="col-span-12 lg:col-span-5">
            <SkeletonVisits />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonStatCards({ row = false }: { row?: boolean }) {
  return (
    <div className={row ? "flex gap-4" : "grid grid-cols-2 gap-3"}>
      {[1, 2].map((i) => (
        <div
          key={i}
          className={`${row ? "flex-1" : ""} bg-primary/8 dark:bg-primary/10 backdrop-blur-xl rounded-xl border border-primary/20 shadow-sm p-4`}
        >
          <div className="w-20 h-3 bg-primary/15 rounded animate-pulse mb-3" />
          <div className="w-16 h-8 bg-primary/15 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function SkeletonVisits() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="w-36 h-3 bg-outline-variant/10 rounded animate-pulse" />
      </div>
      <div className="flex flex-col bg-surface rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/10 last:border-0">
            <div className="w-7 h-7 rounded-full bg-outline-variant/10 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="w-3/4 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-1/2 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
            </div>
            <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonActivity() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="w-32 h-3 bg-outline-variant/10 rounded animate-pulse" />
      </div>
      <div className="flex flex-col bg-surface/60 backdrop-blur-2xl rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 md:p-5 border-b border-outline-variant/5 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-outline-variant/10 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="w-2/3 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-1/3 h-2.5 bg-outline-variant/10 rounded animate-pulse" />
            </div>
            <div className="w-14 h-4 bg-outline-variant/10 rounded animate-pulse" />
          </div>
        ))}
        <div className="p-4 md:p-5 border-t border-outline-variant/10 bg-surface/20">
          <div className="flex items-center justify-between">
            <div className="w-24 h-3 bg-outline-variant/10 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-outline-variant/10 animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-outline-variant/10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
