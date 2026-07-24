export function TrabajoDetailSkeleton({ isEmbedded = false }: { isEmbedded?: boolean }) {
  return (
    <div className={isEmbedded ? "relative w-full flex flex-col min-h-full h-full flex-1" : "relative w-full flex flex-col min-h-screen"}>
      <main className={isEmbedded 
        ? "relative flex-1 w-full mx-auto px-4 pt-24 pb-28 md:pt-6 md:px-8 max-w-full" 
        : "relative flex-1 w-full mx-auto px-4 pt-24 pb-28 md:px-8 md:pt-8 md:pb-12 max-w-[1400px] md:mt-0"
      }>
        <div className={`flex flex-col gap-3 md:gap-6 ${isEmbedded 
          ? "xl:flex xl:flex-col 2xl:grid 2xl:grid-cols-[1fr_300px] gap-6" 
          : "lg:grid lg:items-start lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_300px] lg:gap-6 xl:gap-10"}`}>
          
          {/* Item 1: JobHeader */}
          <div className="order-1 lg:col-start-1 space-y-4">
            <div className="hidden md:flex items-center justify-between mb-4">
              <div className="w-24 h-4 bg-outline-variant/10 rounded animate-pulse" />
            </div>
            
            <div className="space-y-6">
              <div className="w-3/4 h-10 md:h-14 bg-outline-variant/10 rounded-2xl animate-pulse" />
              <div className="w-1/2 h-5 bg-outline-variant/10 rounded-xl animate-pulse" />
              
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="w-24 h-8 bg-outline-variant/10 rounded-full animate-pulse" />
                <div className="w-32 h-8 bg-outline-variant/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Item 2: Sidebar / Totals */}
          <div className="order-2 lg:col-start-2 lg:row-span-4 lg:sticky lg:top-32">
            <div className="bg-surface/70  rounded-xl border border-outline-variant/20 shadow-sm p-4 md:p-5 flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-20 h-3 bg-outline-variant/10 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-outline-variant/10 rounded-full animate-pulse" />
                  <div className="w-8 h-3 bg-outline-variant/10 rounded animate-pulse" />
                </div>
              </div>

              <div className="h-px w-full bg-outline-variant/10" />

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="w-24 h-3 bg-outline-variant/10 rounded animate-pulse mb-1" />
                  <div className="w-40 h-8 bg-outline-variant/10 rounded-xl animate-pulse" />
                  
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-3 bg-outline-variant/10 rounded animate-pulse" />
                      <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-3 bg-outline-variant/10 rounded animate-pulse" />
                      <div className="w-16 h-3 bg-outline-variant/10 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="w-full h-12 bg-outline-variant/10 rounded-xl animate-pulse mt-2" />
              </div>

            </div>
          </div>

          {/* Item 3: Summary Cards */}
          <div className="order-3 lg:col-start-1 mt-0 md:mt-2">
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-surface/60  rounded-xl border border-outline-variant/15 p-4 md:p-5 h-[120px] shadow-sm flex flex-col justify-between">
                  <div className="w-20 h-3 bg-outline-variant/10 rounded animate-pulse" />
                  <div className="w-24 h-7 bg-outline-variant/10 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Item 4: Task List */}
          <div className="order-4 lg:col-start-1 mt-1 md:mt-4 space-y-4">
            <div className="w-32 h-6 bg-outline-variant/10 rounded-lg animate-pulse" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-outline-variant/5 rounded-xl border border-outline-variant/10 animate-pulse" />
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
