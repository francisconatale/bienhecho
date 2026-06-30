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
  );
}
