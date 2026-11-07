export function TareaInfoSkeleton() {
  return (
    <div className="space-y-4">
      <div className="group flex items-start justify-between gap-4">
        <div className="w-3/4 h-10 md:h-14 bg-outline-variant/10 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 md:p-5 rounded-xl bg-surface/40 border border-outline-variant/10 flex flex-col gap-2"
          >
            <div className="w-20 h-3 bg-outline-variant/10 rounded animate-pulse" />
            <div className="flex items-center gap-3 mt-1">
              <div className="w-7 h-7 rounded-[10px] bg-outline-variant/10 animate-pulse shrink-0" />
              <div className="w-24 h-5 md:h-7 bg-outline-variant/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TareaHistorialSkeleton() {
  return (
    <div className="relative bg-surface/80 rounded-xl p-6 border border-outline-variant/10 space-y-5">
      <div className="flex items-center justify-between">
        <div className="w-32 h-3 bg-outline-variant/10 rounded animate-pulse" />
        <div className="w-4 h-4 bg-outline-variant/10 rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-4 bg-surface/40 rounded-xl border border-outline-variant/5"
          >
            <div className="w-24 h-3 bg-outline-variant/10 rounded animate-pulse" />
            <div className="w-full h-4 bg-outline-variant/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TareaPhotosSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-20 h-3 bg-outline-variant/10 rounded animate-pulse" />
        <div className="w-16 h-6 bg-outline-variant/10 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden bg-outline-variant/10 h-32 sm:h-40 md:h-48 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function TareaDetailSkeleton() {
  return (
    <>
      {/* Mobile: header with back */}
      <div className="md:hidden h-[60px] w-full border-b border-outline-variant/10 bg-surface/80  px-4 flex items-center">
        <div className="w-20 h-5 bg-outline-variant/10 rounded animate-pulse" />
      </div>

      <main className="relative flex-1 px-4 pt-6 md:pt-28 pb-24 space-y-6 max-w-4xl mx-auto w-full">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center mb-4">
          <div className="w-40 h-4 bg-outline-variant/10 rounded animate-pulse" />
        </div>

        <TareaInfoSkeleton />
        <TareaHistorialSkeleton />
        
        <div className="relative bg-surface/80 rounded-xl p-6 border border-outline-variant/10 space-y-6">
          <TareaPhotosSkeleton />
        </div>
      </main>
    </>
  );
}
