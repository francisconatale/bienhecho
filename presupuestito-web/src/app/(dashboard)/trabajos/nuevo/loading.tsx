import { MasterDetailSkeleton } from "@/components/ui/master-detail-skeleton";

export default function NuevoTrabajoLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <p className="text-on-surface-variant/60 mt-4 text-sm font-medium animate-pulse">Cargando wizard...</p>
    </div>
  );
}
