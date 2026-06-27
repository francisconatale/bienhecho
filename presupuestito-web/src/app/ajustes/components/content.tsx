"use client";

import { useTheme } from "@/components/layout/theme-provider";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  CreditCard,
  Bell,
  Moon,
  Globe,
  LogOut,
  CircleUserRound,
} from "lucide-react";

// ─── Toggle Switch ───────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none border ${
        checked ? "bg-primary border-transparent shadow-[0_0_12px_rgba(74,140,127,0.4)]" : "bg-surface-variant/30 border-outline-variant/20"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-all duration-300 ease-in-out mt-[2px] ml-[2px] ${
          checked ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Section Label ───────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-3">
      {label}
    </h3>
  );
}

// ─── Row types ───────────────────────────────────────────────
interface RowBaseProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  isLast?: boolean;
}

interface RowNavProps extends RowBaseProps {
  type: "nav";
  value?: string;
  onClick?: () => void;
}

interface RowToggleProps extends RowBaseProps {
  type: "toggle";
  checked: boolean;
  onToggle: (val: boolean) => void;
}

interface RowDestructiveProps {
  type: "destructive";
  label: string;
  onClick?: () => void;
}

type RowProps = RowNavProps | RowToggleProps | RowDestructiveProps;

function Row(props: RowProps) {
  const borderClass = "border-b border-outline-variant/10 last:border-0";

  if (props.type === "destructive") {
    return (
      <button
        onClick={props.onClick}
        className={`w-full flex items-center justify-center px-4 py-3 min-h-[52px] hover:bg-error/10 transition-colors text-center ${borderClass}`}
      >
        <span className="font-bold text-error">{props.label}</span>
      </button>
    );
  }

  const { icon, iconBg, label, isLast } = props;
  const base = `flex items-center gap-4 px-5 py-3.5 min-h-[56px] transition-colors ${isLast ? "" : borderClass}`;

  if (props.type === "toggle") {
    return (
      <div className={`${base} bg-transparent`}>
        <div
          className={`w-[36px] h-[36px] rounded-[12px] ${iconBg} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <span className="flex-1 font-semibold text-on-surface">{label}</span>
        <Toggle checked={props.checked} onChange={props.onToggle} />
      </div>
    );
  }

  // nav row
  return (
    <button
      onClick={props.onClick}
      className={`${base} w-full text-left hover:bg-surface-variant/10 group`}
    >
      <div
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <span className="flex-1 font-medium text-on-surface">{label}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {props.value && (
          <span className="text-sm text-on-surface-variant">{props.value}</span>
        )}
        <ChevronRight
          className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors"
          strokeWidth={2.5}
        />
      </div>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────
export function AjustesContent() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <>
      {/* Perfil */}
      <section>
        <SectionLabel label="Cuenta" />
        <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
          <Link
            href="/ajustes/perfil"
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-variant/10 transition-colors text-left group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CircleUserRound className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-on-surface">Juan Pérez</h4>
              <p className="text-xs text-on-surface-variant truncate">
                juan@empresa.com
              </p>
            </div>
            <ChevronRight
              className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors shrink-0"
              strokeWidth={2.5}
            />
          </Link>
        </div>
      </section>

      {/* Suscripción */}
      <section>
        <SectionLabel label="Suscripción" />
        <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
          <Row
            type="nav"
            icon={<Star className="w-4 h-4 text-primary" strokeWidth={2} />}
            iconBg="bg-primary/10"
            label="Plan Actual"
            value="Pro"
          />
          <Row
            type="nav"
            icon={
              <CreditCard className="w-4 h-4 text-primary" strokeWidth={2} />
            }
            iconBg="bg-primary/10"
            label="Facturación"
          />
        </div>
      </section>

      {/* Preferencias */}
      <section>
        <SectionLabel label="Preferencias" />
        <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
          <Row
            type="nav"
            icon={<Bell className="w-4 h-4 text-error" strokeWidth={2} />}
            iconBg="bg-error/10"
            label="Notificaciones"
          />
          <Row
            type="toggle"
            icon={
              <Moon
                className="w-4 h-4 text-on-surface-variant"
                strokeWidth={2}
              />
            }
            iconBg="bg-surface-container-highest"
            label="Modo Oscuro"
            checked={darkMode}
            onToggle={setDarkMode}
          />
          <Row
            type="nav"
            icon={<Globe className="w-4 h-4 text-primary" strokeWidth={2} />}
            iconBg="bg-primary/10"
            label="Idioma"
            value="Español"
          />
        </div>
      </section>

      {/* Acciones de cuenta */}
      <section>
        <div className="bg-surface/80 rounded-[32px] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-error/20 overflow-hidden">
          <Row type="destructive" label="Cerrar Sesión" />
        </div>
      </section>
    </>
  );
}
