import { VariantA } from "../../../.claude-design/lab/variants/VariantA";
import { VariantB } from "../../../.claude-design/lab/variants/VariantB";
import { VariantC } from "../../../.claude-design/lab/variants/VariantC";
import { VariantD } from "../../../.claude-design/lab/variants/VariantD";
import { VariantE } from "../../../.claude-design/lab/variants/VariantE";
import { FeedbackOverlay } from "./FeedbackOverlay";

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-grouped-bg-light dark:bg-[#000000]">
      <header className="bg-surface dark:bg-surface-container border-b border-outline-variant/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Design Lab: Tabla Trabajos Activos</h1>
            <p className="text-on-surface-variant mt-1">Explorando estilo tabla (Notion/Apple) para reemplazar cards</p>
          </div>
          <div className="text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium">
            5 Variantes generadas
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col gap-12 pb-32">
          
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xl">A</div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">Tabla Limpia (Notion)</h2>
                <p className="text-sm text-on-surface-variant">Etiquetas de estado coloreadas, fila resaltada en hover</p>
              </div>
            </div>
            <div data-variant="A" className="bg-surface/50 dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <VariantA />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xl">B</div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">iOS Settings (Apple)</h2>
                <p className="text-sm text-on-surface-variant">Fondo agrupado, separadores sutiles, chevron a la derecha</p>
              </div>
            </div>
            <div data-variant="B" className="bg-surface/50 dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <VariantB />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xl">C</div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">macOS Finder (Apple)</h2>
                <p className="text-sm text-on-surface-variant">Cabecera definida, importes alineados a la derecha (tabular)</p>
              </div>
            </div>
            <div data-variant="C" className="bg-surface/50 dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <VariantC />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">D</div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">Grilla Minimalista (Moderno)</h2>
                <p className="text-sm text-on-surface-variant">Sin bordes laterales, mucho aire, cabeceras en mayúsculas</p>
              </div>
            </div>
            <div data-variant="D" className="bg-surface/50 dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <VariantD />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xl">E</div>
              <div>
                <h2 className="text-lg font-bold text-on-surface">Compacta Iconográfica (Notion)</h2>
                <p className="text-sm text-on-surface-variant">Iconos a la izquierda, etiquetas simples, hover interactivo</p>
              </div>
            </div>
            <div data-variant="E" className="bg-surface/50 dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
              <VariantE />
            </div>
          </section>

        </div>
      </main>

      <FeedbackOverlay targetName="ClientDetailPane - Trabajos Activos" />
    </div>
  );
}
