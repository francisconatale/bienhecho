import { Search } from "lucide-react";

export function MasterDetailSkeleton() {
  return (
    <div className="flex-1 relative flex min-h-0 overflow-hidden w-full">
      {/* Mobile Header Skeleton (Only visible on mobile) */}
      <div className="md:hidden absolute top-0 left-0 right-0 pt-8 pb-2 px-4 z-10 bg-transparent">
        <div className="w-48 h-8 bg-outline-variant/10 rounded-lg animate-pulse" />
        <div className="w-32 h-4 bg-outline-variant/10 rounded md mt-2 animate-pulse" />
      </div>

      {/* List Pane Skeleton */}
      <div className="absolute inset-0 md:relative flex-shrink-0 flex flex-col border-r border-outline-variant/10 bg-surface overflow-hidden z-10 w-full md:w-[360px] max-md:mt-[100px]">
        {/* Search Bar Skeleton */}
        <div className="px-4 md:px-5 py-3 bg-surface border-b border-outline-variant/10">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-outline-variant/50 pointer-events-none" />
              <div className="w-full h-9 md:h-10 bg-grouped-bg-light rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-outline-variant/10 animate-pulse" />
          </div>
        </div>

        {/* List Items Skeleton */}
        <div className="flex-1 overflow-y-auto px-4 md:px-0 py-4 md:py-0 space-y-3 md:space-y-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 md:px-5 py-4 border-b border-outline-variant/5">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-outline-variant/10 animate-pulse shrink-0" />
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
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-grouped-bg-light md:bg-transparent z-0 p-8">
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
