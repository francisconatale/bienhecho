type AuroraPreset = "layout" | "ajustes" | "perfil" | "trabajo" | "dashboard";

interface AuroraBackgroundProps {
  preset?: AuroraPreset;
  className?: string;
}

const NOISE_URL =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

function NoiseOverlay({ zIndex }: { zIndex: string }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] ${zIndex}`}
      style={{ backgroundImage: `url('${NOISE_URL}')` }}
    />
  );
}

function Blob({
  className,
  dark,
  pulse,
  pulseDuration,
}: {
  className: string;
  dark?: boolean;
  pulse?: boolean;
  pulseDuration?: string;
}) {
  return (
    <div
      className={`${dark ? "hidden dark:block " : ""}${className} ${
        pulse ? "animate-pulse" : ""
      } transform-gpu will-change-transform will-change-opacity`}
      style={pulse && pulseDuration ? { animationDuration: pulseDuration } : undefined}
    />
  );
}

export function AuroraBackground({ preset = "layout", className }: AuroraBackgroundProps) {
  switch (preset) {
    case "layout":
      return (
        <>
          <NoiseOverlay zIndex="z-[-1]" />
          <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-300 z-[-1] ${className ?? ""}`}>
            <Blob
              className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[50px] md:blur-[160px] rounded-full dark:hidden transition-opacity duration-300"
              pulse
              pulseDuration="8s"
            />
            <Blob
              className="absolute top-[20%] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[60px] md:blur-[160px] rounded-full dark:hidden transition-opacity duration-300"
            />
            <Blob
              dark
              className="absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[60px] md:blur-[180px] rounded-full transition-opacity duration-300"
            />
            <Blob
              dark
              className="absolute top-[20%] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/30 md:bg-primary-container/20 blur-[60px] md:blur-[160px] rounded-full transition-opacity duration-300"
            />
          </div>
        </>
      );

    case "ajustes":
      return (
        <div
          className={`absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-opacity duration-300 ${className ?? ""}`}
          style={{
            zIndex: -1,
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          }}
        >
          <Blob
            className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[400px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[55px] md:blur-[140px] rounded-[100%] dark:hidden transition-opacity duration-300"
          />
          <Blob
            className="absolute top-[80px] right-[-50px] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-500/15 md:bg-indigo-500/10 blur-[50px] md:blur-[140px] rounded-full dark:hidden transition-opacity duration-300"
          />
          <Blob
            dark
            className="absolute top-[-150px] right-[-100px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-primary/25 md:bg-primary/15 blur-[65px] md:blur-[180px] rounded-full transition-opacity duration-300"
          />
          <Blob
            dark
            className="absolute top-[120px] left-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/35 md:bg-primary-container/25 blur-[60px] md:blur-[160px] rounded-full transition-opacity duration-300"
          />
        </div>
      );

    case "perfil":
      return (
        <div
          className={`absolute top-0 left-0 right-0 h-[400px] pointer-events-none overflow-hidden ${className ?? ""}`}
          style={{
            zIndex: -1,
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          }}
        >
          <Blob
            className="absolute top-[20px] left-[-80px] w-[300px] h-[300px] bg-indigo-500/20 blur-[60px] rounded-[100%] dark:hidden"
          />
          <Blob
            className="absolute top-[10px] right-[50px] w-[200px] h-[200px] bg-primary/15 blur-[45px] rounded-full dark:hidden"
          />
          <Blob
            dark
            className="absolute top-[0px] left-[-150px] w-[450px] h-[450px] bg-primary/30 blur-[65px] rounded-full"
          />
          <Blob
            dark
            className="absolute top-[-50px] right-[50px] w-[250px] h-[250px] bg-primary-container/40 blur-[55px] rounded-full"
          />
        </div>
      );

    case "trabajo":
      return (
        <>
          <NoiseOverlay zIndex="z-[-1]" />
          <div
            className={`absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-opacity duration-300 ${className ?? ""}`}
            style={{
              zIndex: -1,
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            }}
          >
            <Blob
              className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[50px] md:blur-[160px] rounded-full dark:hidden transition-opacity duration-300"
              pulse
              pulseDuration="8s"
            />
            <Blob
              className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[60px] md:blur-[160px] rounded-full dark:hidden transition-opacity duration-300"
            />
            <Blob
              dark
              className="absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[60px] md:blur-[180px] rounded-full transition-opacity duration-300"
            />
            <Blob
              dark
              className="absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[60px] md:blur-[160px] rounded-full transition-opacity duration-300"
            />
          </div>
        </>
      );

    case "dashboard":
      return (
        <div
          className={`absolute top-0 left-0 right-0 h-[500px] md:h-[1200px] pointer-events-none overflow-hidden transition-opacity duration-300 ${className ?? ""}`}
          style={{
            zIndex: -1,
            WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
        >
          <Blob
            className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/20 md:bg-primary/15 blur-[50px] md:blur-[160px] rounded-full -translate-y-1/4 translate-x-1/4 dark:hidden transition-opacity duration-300"
          />
          <Blob
            className="absolute top-[100px] left-[-100px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary-container/15 md:bg-primary-container/10 blur-[60px] md:blur-[140px] rounded-full dark:hidden transition-opacity duration-300"
          />
          <Blob
            dark
            className="absolute top-[-50px] md:top-[-100px] right-[-50px] md:right-[-200px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-primary/25 md:bg-primary/20 blur-[60px] md:blur-[180px] rounded-full transition-opacity duration-300"
          />
          <Blob
            dark
            className="absolute top-[150px] md:top-[50px] left-[-150px] md:left-[-100px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary-container/40 md:bg-primary-container/30 blur-[65px] md:blur-[160px] rounded-full transition-opacity duration-300"
          />
        </div>
      );
  }
}

