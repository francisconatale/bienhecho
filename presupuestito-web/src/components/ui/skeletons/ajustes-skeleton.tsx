export function AjustesSkeleton() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Mobile */}
      <div className="md:hidden flex flex-col px-5 pt-14 pb-28 w-full space-y-6">
        <div className="w-32 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        
        <div className="flex flex-col space-y-6">
          <SectionSkeleton rows={3} />
          <SectionSkeleton rows={2} />
          <SectionSkeleton rows={2} />
        </div>
      </div>

      {/* Desktop */}
      <main className="hidden md:block relative flex-1 px-8 lg:px-12 pt-16 pb-32 w-full">
        <div className="max-w-7xl mx-auto mb-8 pl-1">
          <div className="w-32 h-10 bg-outline-variant/10 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto items-start">
          {/* Left column */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <SectionSkeleton rows={4} />
            <SectionSkeleton rows={3} />
          </div>
          {/* Right column */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            <SectionSkeleton rows={2} />
            <SectionSkeleton rows={2} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-surface/60  rounded-2xl border border-outline-variant/15 p-6 shadow-sm">
      <div className="w-36 h-5 bg-outline-variant/10 rounded animate-pulse mb-5" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="w-32 h-3.5 bg-outline-variant/10 rounded animate-pulse" />
              <div className="w-48 h-2.5 bg-outline-variant/8 rounded animate-pulse" />
            </div>
            <div className="w-10 h-6 bg-outline-variant/10 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
