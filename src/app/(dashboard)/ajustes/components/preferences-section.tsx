"use client";

import { Bell, Moon, Globe } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { SectionLabel } from "./section-label";
import { Row } from "./row";

export function PreferencesSection() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <section>
      <SectionLabel label="Preferencias" />
      <div className="bg-surface/80 rounded-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)] border border-outline-variant/20 overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-3.5 min-h-[56px] opacity-50 cursor-not-allowed border-b border-outline-variant/10">
          <div className="w-8 h-8 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-error" strokeWidth={2} />
          </div>
          <span className="flex-1 font-medium text-on-surface">Notificaciones</span>
        </div>
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
        <div className="flex items-center gap-4 px-5 py-3.5 min-h-[56px] opacity-50 cursor-not-allowed">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-primary" strokeWidth={2} />
          </div>
          <span className="flex-1 font-medium text-on-surface">Idioma</span>
          <span className="text-sm text-on-surface-variant">Español</span>
        </div>
      </div>
    </section>
  );
}
