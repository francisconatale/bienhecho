"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { BudgetPreview } from "./BudgetPreview";
import type { PDFData } from "@/lib/pdf/generate-budget";
import type { PDFParams } from "@/lib/pdf/types";
import { DEFAULT_PDF_PARAMS } from "@/lib/pdf/types";
import { ColorPicker } from "@/components/ui/color-picker";

interface PDFPreviewModalProps {
  data: PDFData;
  onDownload: (params: PDFParams) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function PDFPreviewModal({ data, onDownload, onCancel, loading = false }: PDFPreviewModalProps) {
  const [params, setParams] = useState<PDFParams>(DEFAULT_PDF_PARAMS);

  const hasLogo = !!data.userProfile.logo_url;

  const handleColorChange = (color: string) => {
    setParams(prev => ({ ...prev, primaryColor: color }));
  };

  const handleSecondaryColorChange = (color: string) => {
    setParams(prev => ({ ...prev, secondaryColor: color }));
  };

  const handleLogoScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, logoScale: parseFloat(e.target.value) }));
  };

  const handleModeToggle = () => {
    setParams(prev => ({
      ...prev,
      colorMode: prev.colorMode === "solid" ? "gradient" : "solid",
      secondaryColor: prev.colorMode === "solid" ? "#FF9F43" : undefined,
    }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Personalizar PDF" position="center">
      <div className="flex flex-col gap-4">
        {/* Controls */}
        <div className="flex items-center gap-6 flex-wrap order-2 md:order-1 pt-2 md:pt-0 border-t border-outline-variant/15 md:border-0">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
              Modo
            </label>
            <button
              onClick={handleModeToggle}
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-on-surface/5 text-on-surface-variant hover:bg-on-surface/10 transition-colors transition-transform active:scale-[0.98] cursor-pointer"
            >
              {params.colorMode === "solid" ? "Sólido" : "Degradado"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
              {params.colorMode === "gradient" ? "Desde" : "Color"}
            </label>
            <ColorPicker
              color={params.primaryColor}
              onChange={handleColorChange}
            />
          </div>
          {params.colorMode === "gradient" && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                Hasta
              </label>
              <ColorPicker
                color={params.secondaryColor ?? "#FF9F43"}
                onChange={handleSecondaryColorChange}
              />
            </div>
          )}
          {hasLogo && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/70">
                Logo
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={params.logoScale}
                onChange={handleLogoScaleChange}
                className="w-20 accent-[#3D8B6E] cursor-pointer"
              />
              <span className="text-xs font-bold text-on-surface-variant w-6 text-right">
                {Math.round(params.logoScale * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm order-1 md:order-2">
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            <BudgetPreview data={data} params={params} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 order-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-on-surface/5 text-on-surface font-bold text-sm hover:bg-on-surface/10 transition-colors transition-transform active:scale-[0.98] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => onDownload(params)}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors transition-transform active:scale-[0.98] shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Generando..." : "Descargar PDF"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
