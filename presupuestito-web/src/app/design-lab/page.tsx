import { FeedbackOverlay } from './FeedbackOverlay';

export default function DesignLabPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background (Aurora + Noise) */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.04] mix-blend-overlay bg-[url('/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[-15%] w-[45%] h-[45%] rounded-full bg-blue-500/8 blur-[130px]" />
      </div>

      <header className="mb-8">
        <h1 className="text-[34px] lg:text-[48px] font-bold">Design Lab: Trabajo Detail Skeleton</h1>
        <p className="text-on-surface-variant">Review the 5 variants and use the feedback overlay to decide.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-24">
        {/* Variant A: Information Hierarchy Focus (Apple Settings style) */}
        <div data-variant="A" className="flex flex-col gap-2 border border-outline-variant/20 rounded-[24px] p-6 bg-surface/60 backdrop-blur-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Variant A: Apple Settings Style</h2>
          <p className="text-sm text-on-surface-variant mb-4">Groups skeleton items tightly in rounded cards, imitating iOS list styles. Clear sections, grouped together.</p>
          <div className="w-24 h-6 bg-outline-variant/10 rounded animate-pulse mb-4" />
          <div className="bg-surface/70 rounded-[24px] border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="w-full h-14 border-b border-outline-variant/15 flex items-center px-4 gap-3 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-outline-variant/10 shrink-0" />
               <div className="w-3/4 h-4 bg-outline-variant/10 rounded" />
            </div>
            <div className="w-full h-14 border-b border-outline-variant/15 flex items-center px-4 gap-3 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-outline-variant/10 shrink-0" />
               <div className="w-1/2 h-4 bg-outline-variant/10 rounded" />
            </div>
            <div className="w-full h-14 flex items-center px-4 gap-3 animate-pulse">
               <div className="w-8 h-8 rounded-full bg-outline-variant/10 shrink-0" />
               <div className="w-2/3 h-4 bg-outline-variant/10 rounded" />
            </div>
          </div>
        </div>

        {/* Variant B: Layout Model Exploration (Card-heavy) */}
        <div data-variant="B" className="flex flex-col gap-2 border border-outline-variant/20 rounded-[24px] p-6 bg-surface/60 backdrop-blur-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Variant B: Grid & Cards</h2>
          <p className="text-sm text-on-surface-variant mb-4">More spacious grid layout, separating information into distinct modular cards instead of lists.</p>
          <div className="w-32 h-8 bg-outline-variant/10 rounded-lg animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-surface/70 rounded-[24px] border border-outline-variant/20 shadow-sm animate-pulse p-4 flex flex-col gap-2">
               <div className="w-1/2 h-4 bg-outline-variant/10 rounded" />
               <div className="w-full flex-1 bg-outline-variant/5 rounded-xl" />
            </div>
            <div className="h-32 bg-surface/70 rounded-[24px] border border-outline-variant/20 shadow-sm animate-pulse p-4 flex flex-col gap-2">
               <div className="w-1/2 h-4 bg-outline-variant/10 rounded" />
               <div className="w-full flex-1 bg-outline-variant/5 rounded-xl" />
            </div>
            <div className="col-span-2 h-24 bg-surface/70 rounded-[24px] border border-outline-variant/20 shadow-sm animate-pulse p-4 flex flex-col gap-2">
               <div className="w-1/4 h-4 bg-outline-variant/10 rounded" />
               <div className="w-full flex-1 bg-outline-variant/5 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Variant C: Density Variation (Compact) */}
        <div data-variant="C" className="flex flex-col gap-2 border border-outline-variant/20 rounded-[24px] p-6 bg-surface/60 backdrop-blur-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Variant C: High Density Minimal</h2>
          <p className="text-sm text-on-surface-variant mb-4">Strips away heavy card borders, uses subtle dividers and extremely minimal indicators. Fast scanning.</p>
          <div className="space-y-3">
            <div className="w-48 h-6 bg-outline-variant/10 rounded animate-pulse" />
            <div className="w-full h-[1px] bg-outline-variant/15" />
            <div className="w-full h-8 bg-outline-variant/5 rounded animate-pulse" />
            <div className="w-full h-8 bg-outline-variant/5 rounded animate-pulse" />
            <div className="w-full h-8 bg-outline-variant/5 rounded animate-pulse" />
          </div>
        </div>

        {/* Variant D: Interaction Model (Progressive Disclosure) */}
        <div data-variant="D" className="flex flex-col gap-2 border border-outline-variant/20 rounded-[24px] p-6 bg-surface/60 backdrop-blur-xl shadow-sm">
          <h2 className="font-bold text-lg mb-2">Variant D: Progressive Disclosure</h2>
          <p className="text-sm text-on-surface-variant mb-4">Only shows the top-level skeleton items (like a summary), implying the rest is hidden until loaded or expanded.</p>
          <div className="flex gap-4 items-center mb-6 bg-surface/70 rounded-[24px] border border-outline-variant/20 p-4 shadow-sm animate-pulse">
            <div className="w-16 h-16 rounded-full bg-outline-variant/10" />
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-5 bg-outline-variant/10 rounded" />
              <div className="w-1/3 h-4 bg-outline-variant/10 rounded" />
            </div>
          </div>
          <div className="w-full h-12 bg-primary/10 rounded-xl animate-pulse" />
        </div>

        {/* Variant E: Expressive Direction (Premium Aurora) */}
        <div data-variant="E" className="flex flex-col gap-2 border border-outline-variant/20 rounded-[24px] p-6 bg-surface/60 backdrop-blur-xl shadow-sm relative overflow-hidden">
          <h2 className="font-bold text-lg mb-2 relative z-10">Variant E: Premium Expressive</h2>
          <p className="text-sm text-on-surface-variant mb-4 relative z-10">Uses soft gradients in the skeletons themselves and larger typography placeholders.</p>
          <div className="space-y-6 relative z-10">
            <div className="w-3/4 h-12 bg-gradient-to-r from-outline-variant/10 to-outline-variant/5 rounded-[24px] animate-pulse" />
            <div className="flex gap-3 overflow-hidden">
               <div className="w-32 h-32 shrink-0 bg-gradient-to-tr from-outline-variant/10 to-outline-variant/5 rounded-[24px] animate-pulse" />
               <div className="w-32 h-32 shrink-0 bg-gradient-to-tr from-outline-variant/10 to-outline-variant/5 rounded-[24px] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <FeedbackOverlay targetName="TrabajoDetailSkeleton" />
    </div>
  );
}
