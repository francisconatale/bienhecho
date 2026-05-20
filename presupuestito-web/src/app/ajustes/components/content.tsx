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
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? "bg-primary" : "bg-surface-container-highest"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out mt-0.5 ${
          checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"
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
        className={`w-full flex items-center justify-center px-4 py-3 min-h-[44px] hover:bg-error/5 transition-colors text-center ${borderClass}`}
      >
        <span className="font-semibold text-error">{props.label}</span>
      </button>
    );
  }

  const { icon, iconBg, label, isLast } = props;
  const base = `flex items-center gap-3 px-4 py-3 min-h-[44px] transition-colors ${isLast ? "" : borderClass}`;

  if (props.type === "toggle") {
    return (
      <div className={`${base} bg-surface`}>
        <div
          className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <span className="flex-1 font-medium text-on-surface">{label}</span>
        <Toggle checked={props.checked} onChange={props.onToggle} />
      </div>
    );
  }

  // nav row
  return (
    <button
      onClick={props.onClick}
      className={`${base} w-full text-left hover:bg-surface-variant/30 group`}
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
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <Link
            href="/ajustes/perfil"
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-variant/30 transition-colors text-left group"
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
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <Row type="destructive" label="Cerrar Sesión" />
        </div>
      </section>
    </>
  );
}
