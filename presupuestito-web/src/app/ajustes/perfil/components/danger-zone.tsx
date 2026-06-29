export function DangerZone() {
  return (
    <section>
      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <button
          type="button"
          className="w-full px-4 py-3 min-h-[44px] text-center hover:bg-error/5 active:bg-error/10 transition-colors text-sm font-semibold text-error select-none"
        >
          Cerrar Sesión
        </button>
      </div>
    </section>
  );
}
