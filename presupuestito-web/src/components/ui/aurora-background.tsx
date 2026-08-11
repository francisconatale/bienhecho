type AuroraPreset = "layout" | "ajustes" | "perfil" | "trabajo" | "dashboard";

interface AuroraBackgroundProps {
  preset?: AuroraPreset;
  className?: string;
}

const NOISE_URL =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

export function AuroraBackground({ preset = "layout", className }: AuroraBackgroundProps) {
  // We flattened the heavy blur divs into a simple, high-performance radial gradient
  return (
    <div
      className={`fixed inset-0 pointer-events-none transition-opacity duration-300 z-[-1] ${className ?? ""}`}
      style={{
        background: 'radial-gradient(circle at 50% -20%, var(--color-primary-container) 0%, transparent 60%), radial-gradient(circle at 100% 20%, var(--color-primary) 0%, transparent 50%)',
        opacity: 0.15
      }}
    />
  );
}

