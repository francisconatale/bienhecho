type AuroraPreset = "layout" | "ajustes" | "perfil" | "trabajo" | "dashboard";

interface AuroraBackgroundProps {
  preset?: AuroraPreset;
  className?: string;
}

const NOISE_URL =
  "https://grainy-gradients.vercel.app/noise.svg";

function NoiseOverlay({ zIndex }: { zIndex: string }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay dark:opacity-[0.06] ${zIndex}`}
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
      }`}
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
          <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-all duration-1000 z-[-1] ${className ?? ""}`}>
            <Blob
              className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000"
              pulse
              pulseDuration="8s"
            />
            <Blob
              className="absolute top-[20%] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/20 md:bg-primary-container/15 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000"
            />
            <Blob
              dark
              className="absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/25 md:bg-primary/15 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000"
            />
            <Blob
              dark
              className="absolute top-[20%] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000"
            />
          </div>
        </>
      );

    case "ajustes":
      return (
        <div
          className={`absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700 ${className ?? ""}`}
          style={{
            zIndex: -1,
            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
          }}
        >
          <Blob
            className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[400px] md:h-[600px] bg-primary/20 md:bg-primary/15 blur-[110px] md:blur-[140px] rounded-[100%] dark:hidden transition-all duration-700"
          />
          <Blob
            className="absolute top-[80px] right-[-50px] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-500/15 md:bg-indigo-500/10 blur-[100px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700"
          />
          <Blob
            dark
            className="absolute top-[-150px] right-[-100px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-primary/25 md:bg-primary/15 blur-[130px] md:blur-[180px] rounded-full transition-all duration-700"
          />
          <Blob
            dark
            className="absolute top-[120px] left-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/35 md:bg-primary-container/25 blur-[120px] md:blur-[160px] rounded-full transition-all duration-700"
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
            className="absolute top-[20px] left-[-80px] w-[300px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-[100%] dark:hidden"
          />
          <Blob
            className="absolute top-[10px] right-[50px] w-[200px] h-[200px] bg-primary/15 blur-[90px] rounded-full dark:hidden"
          />
          <Blob
            dark
            className="absolute top-[0px] left-[-150px] w-[450px] h-[450px] bg-primary/30 blur-[130px] rounded-full"
          />
          <Blob
            dark
            className="absolute top-[-50px] right-[50px] w-[250px] h-[250px] bg-primary-container/40 blur-[110px] rounded-full"
          />
        </div>
      );

    case "trabajo":
      return (
        <>
          <NoiseOverlay zIndex="z-[-1]" />
          <div
            className={`absolute top-0 left-0 right-0 h-[400px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-1000 ${className ?? ""}`}
            style={{
              zIndex: -1,
              WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, black 10%, transparent 100%)",
            }}
          >
            <Blob
              className="absolute top-[-50px] left-[-50px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/30 md:bg-primary/20 blur-[100px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000"
              pulse
              pulseDuration="8s"
            />
            <Blob
              className="absolute top-[0px] right-[-100px] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary-container/30 md:bg-primary-container/20 blur-[120px] md:blur-[160px] rounded-full dark:hidden transition-all duration-1000"
            />
            <Blob
              dark
              className="absolute top-[-50px] left-[-50px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/35 md:bg-primary/25 blur-[120px] md:blur-[180px] rounded-full transition-all duration-1000"
            />
            <Blob
              dark
              className="absolute top-[50px] right-[-150px] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-primary-container/40 md:bg-primary-container/30 blur-[120px] md:blur-[160px] rounded-full transition-all duration-1000"
            />
          </div>
        </>
      );

    case "dashboard":
      return (
        <div
          className={`absolute top-0 left-0 right-0 h-[500px] md:h-[1200px] pointer-events-none overflow-hidden transition-all duration-700 ${className ?? ""}`}
          style={{
            zIndex: -1,
            WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
        >
          <Blob
            className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/20 md:bg-primary/15 blur-[100px] md:blur-[160px] rounded-full -translate-y-1/4 translate-x-1/4 dark:hidden transition-all duration-700"
          />
          <Blob
            className="absolute top-[100px] left-[-100px] w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary-container/15 md:bg-primary-container/10 blur-[120px] md:blur-[140px] rounded-full dark:hidden transition-all duration-700"
          />
          <Blob
            dark
            className="absolute top-[-50px] md:top-[-100px] right-[-50px] md:right-[-200px] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-primary/25 md:bg-primary/20 blur-[120px] md:blur-[180px] rounded-full transition-all duration-700"
          />
          <Blob
            dark
            className="absolute top-[150px] md:top-[50px] left-[-150px] md:left-[-100px] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary-container/40 md:bg-primary-container/30 blur-[130px] md:blur-[160px] rounded-full transition-all duration-700"
          />
        </div>
      );
  }
}
