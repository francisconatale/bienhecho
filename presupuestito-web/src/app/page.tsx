import {
  CircleUserRound,
  PlusCircle,
  FileText,
  Banknote,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/10 px-4 pb-4 pt-safe flex items-end justify-between transition-all">
        <button
          aria-label="Profile"
          className="text-primary p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
        </button>
        <h1 className="font-headline-large-mobile text-headline-large-mobile text-on-surface dark:text-inverse-on-surface flex-1 text-center font-bold tracking-tight">
          Presupuestito
        </h1>
        <button
          aria-label="Add"
          className="text-primary p-2 -mr-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <PlusCircle className="w-8 h-8" strokeWidth={1.5} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 space-y-6 mt-20 pb-24 max-w-3xl mx-auto w-full">
        {/* Summary Section (Bento Grid Style) */}
        <section className="grid grid-cols-2 gap-4">
          {/* Active Budgets Card */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between aspect-square">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-primary-container/10 rounded-xl text-primary">
                <FileText className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-on-surface">12</h2>
              <p className="text-sm text-on-surface-variant mt-1 font-medium uppercase tracking-wider">
                Activos
              </p>
            </div>
          </div>
          {/* Total Pending Card */}
          <div className="bg-primary text-on-primary rounded-2xl p-5 shadow-sm flex flex-col justify-between aspect-square">
            <div className="flex items-start justify-between">
              <div className="p-2.5 bg-white/10 rounded-xl text-white">
                <Banknote className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold">$4,500</h2>
              <p className="text-sm text-white/80 mt-1 font-medium uppercase tracking-wider">Pendiente</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex gap-4">
          <button className="flex-1 bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-center gap-3 hover:bg-surface-variant transition-all active:scale-[0.98] duration-100 ease-in-out">
            <PlusCircle className="w-6 h-6 text-primary" strokeWidth={2} />
            <span className="font-semibold text-primary">Nuevo Presupuesto</span>
          </button>
        </section>

        {/* Recent Activity (Inset Grouped List) */}
        <section>
          <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Actividad Reciente
            </h3>
          </div>
          <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            {/* Item 1 */}
            <div className="flex items-center p-4 border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mr-3">
                <span className="font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface truncate">Acme Corp</h4>
                <p className="text-xs text-on-surface-variant truncate">
                  Diseño Web • 12 Oct
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-bold text-on-surface">$1,200</span>
                <span className="text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded-full mt-1 uppercase">
                  Enviado
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant ml-2" strokeWidth={2.5} />
            </div>
            {/* Item 2 */}
            <div className="flex items-center p-4 border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mr-3">
                <span className="font-bold">S</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface truncate">
                  Stark Industries
                </h4>
                <p className="text-xs text-on-surface-variant truncate">
                  Consultoría SEO • 10 Oct
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-bold text-on-surface">$850</span>
                <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full mt-1 uppercase">
                  Borrador
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant ml-2" strokeWidth={2.5} />
            </div>
            {/* Item 3 */}
            <div className="flex items-center p-4 hover:bg-surface-variant/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant mr-3">
                <span className="font-bold">W</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-on-surface truncate">Wayne Ent.</h4>
                <p className="text-xs text-on-surface-variant truncate">
                  Campaña Ads • 05 Oct
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="font-bold text-on-surface">$2,450</span>
                <span className="text-[10px] font-bold text-success-dark bg-success/10 px-2 py-0.5 rounded-full mt-1 uppercase">
                  Aceptado
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant ml-2" strokeWidth={2.5} />
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pt-2 pb-safe md:hidden bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-lg border-t border-outline-variant/10 rounded-t-[24px] shadow-2xl">
        {/* Active Tab: Dashboard */}
        <a
          className="flex flex-col items-center justify-center text-primary px-4 py-2 transition-all"
          href="#"
        >
          <div className="bg-primary/10 rounded-2xl p-2 mb-1">
            <LayoutDashboard className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Dashboard</span>
        </a>
        {/* Inactive Tab: Clients */}
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 px-4 py-2 hover:text-on-surface transition-all"
          href="#"
        >
          <div className="p-2 mb-1">
            <Users className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Clientes</span>
        </a>
        {/* Inactive Tab: Settings */}
        <a
          className="flex flex-col items-center justify-center text-on-surface-variant/60 px-4 py-2 hover:text-on-surface transition-all"
          href="#"
        >
          <div className="p-2 mb-1">
            <Settings className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Ajustes</span>
        </a>
      </nav>
    </>
  );
}
