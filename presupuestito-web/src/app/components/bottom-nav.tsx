import { LayoutDashboard, Users, Settings } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  const activeClasses = active
    ? "text-primary"
    : "text-on-surface-variant/60 hover:text-on-surface";

  return (
    <a
      className={`flex flex-col items-center justify-center px-4 py-2 transition-all ${activeClasses}`}
      href={href}
    >
      <div className={`${active ? "bg-primary/10" : ""} rounded-2xl p-2 mb-1`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </a>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pt-2 pb-safe md:hidden bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-lg border-t border-outline-variant/10 rounded-t-[24px] shadow-2xl">
      <NavItem
        icon={<LayoutDashboard className="w-6 h-6" strokeWidth={2.5} />}
        label="Dashboard"
        href="#"
        active
      />
      <NavItem
        icon={<Users className="w-6 h-6" strokeWidth={2} />}
        label="Clientes"
        href="#"
      />
      <NavItem
        icon={<Settings className="w-6 h-6" strokeWidth={2} />}
        label="Ajustes"
        href="#"
      />
    </nav>
  );
}
