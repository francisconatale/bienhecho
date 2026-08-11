import { Search } from "lucide-react";

export function MasterDetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando contenido" className="flex-1 relative flex min-h-0 overflow-hidden w-full">
      {/* Mobile Wrapper (only visible on mobile) */}
      <div className="md:hidden flex-1 flex flex-col w-full h-full overflow-y-auto">
        {/* Mobile Header Skeleton */}
        <div className="flex pt-14 pb-4 px-4 items-center justify-between">
          <div className="w-48 h-10 bg-outline-variant/10 rounded-lg animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-outline-variant/10 animate-pulse" />
        </div>
        {/* Mobile Search Bar Skeleton */}
        <div className="px-4 pb-4">
          <div className="w-full h-[42px] bg-surface/70 border border-outline-variant/20 rounded-lg animate-pulse" />
        </div>
        {/* Mobile List Card Skeleton */}
        <div className="px-4 pb-20">
          <div className="flex flex-col bg-surface/70 rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm divide-y divide-outline-variant/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-4 py-4 bg-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-outline-variant/10 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-outline-variant/10 rounded animate-pulse" />
                    <div className="w-1/2 h-3 bg-outline-variant/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop List Pane Skeleton (only visible on desktop) */}
      <div className="hidden md:flex flex-shrink-0 flex-col border-r border-outline-variant/10 bg-surface overflow-hidden z-10 w-[360px]">
        {/* Search Bar Skeleton */}
        <div className="px-5 py-3 bg-surface border-b border-outline-variant/10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant/50 pointer-events-none" />
              <div className="w-full h-10 bg-grouped-bg-light rounded-lg animate-pulse" />
            </div>
            <div className="h-9 w-9 rounded-lg bg-outline-variant/10 animate-pulse" />
          </div>
        </div>

        {/* List Items Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-5 py-4 border-b border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-outline-variant/10 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-outline-variant/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Pane Skeleton (Desktop only) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-grouped-bg-light z-0 p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="w-16 h-16 rounded-xl bg-outline-variant/10 animate-pulse" />
          <div className="w-48 h-5 bg-outline-variant/10 rounded animate-pulse" />
          <div className="w-32 h-4 bg-outline-variant/10 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="w-full h-3 bg-outline-variant/10 rounded animate-pulse" />
            <div className="w-2/3 h-3 bg-outline-variant/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
