import { useState } from "react";
import type { PDFData } from "@/lib/pdf/generate-budget";
import type { PDFParams } from "@/lib/pdf/types";
import { derivePDFColors } from "@/lib/pdf/derivePDFColors";
import { createColorStrategy } from "@/lib/pdf/color-strategies";
import { buildItemsList } from "@/lib/pdf/budget-layout";

interface BudgetPreviewProps {
  data: Pick<PDFData, "client" | "job" | "tasks" | "materiales" | "userProfile">;
  params: PDFParams;
}

export function BudgetPreview({ data, params }: BudgetPreviewProps) {
  const colors = derivePDFColors(params.primaryColor);
  const strategy = createColorStrategy(params.primaryColor, params.secondaryColor);
  const rgb = (c: [number, number, number]) => `rgb(${c[0]},${c[1]},${c[2]})`;
  const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  const { client, job, tasks, materiales, userProfile } = data;
  const allItems = buildItemsList(tasks, materiales);
  const finalTotal = allItems.reduce((acc, i) => acc + i.total, 0);
  const senderName = userProfile.company || userProfile.name || "Sin nombre";
  const invoiceId = job.id ? job.id.substring(0, 6).toUpperCase() : "000000";
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const hasLogo = !!userProfile.logo_url;

  const logoSize = Math.round(32 * params.logoScale);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-white text-[#1A3020] text-sm leading-snug">
      {/* Header — matches PDF layout order: logo centered, text on top */}
      <div style={{ background: strategy.cssHeaderBackground }} className="relative px-4 py-3 min-h-[72px] overflow-hidden">
        {hasLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {logoError || !logoLoaded ? (
              <div
                style={{ width: logoSize, height: logoSize }}
                className="rounded-md bg-white/20 flex items-center justify-center text-white/50 text-[9px] font-bold"
              >
                {logoError ? "—" : "..."}
              </div>
            ) : null}
            <img
              src={userProfile.logo_url}
              alt="Logo"
              style={{ width: logoSize, height: logoSize }}
              className={`rounded-md object-contain bg-white/10 ${logoLoaded ? "block" : "hidden"}`}
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoError(true)}
            />
          </div>
        )}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div style={{ color: rgb(colors.onPrimary) }} className="text-base font-bold leading-tight">
              {senderName}
            </div>
            {userProfile.trade && (
              <div style={{ color: rgba(colors.onPrimary, 0.7) }} className="text-[10px] mt-0.5">
                {userProfile.trade}
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <div style={{ color: rgba(colors.onPrimary, 0.7) }} className="text-[9px] font-bold tracking-widest uppercase">
              PRESUPUESTO
            </div>
            <div style={{ color: rgb(colors.onPrimary) }} className="text-sm font-bold mt-0.5">
              #{invoiceId}
            </div>
            <div style={{ color: rgba(colors.onPrimary, 0.7) }} className="text-[9px] mt-0.5">
              {dateStr}
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="px-4 py-2">
        <div style={{ backgroundColor: rgb(colors.outlineVariant) }} className="h-px" />
      </div>

      {/* DE / PARA */}
      <div className="px-4 grid grid-cols-2 gap-4 pb-2">
        <div>
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[9px] font-bold tracking-widest uppercase">
            DE
          </div>
          <div style={{ color: rgb(colors.onSurface) }} className="text-sm font-bold mt-1">
            {senderName}
          </div>
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[11px] leading-snug mt-0.5 space-y-0.5">
            {userProfile.address && <div>{userProfile.address}</div>}
            {userProfile.phone && <div>{userProfile.phone}</div>}
            {userProfile.cuit && <div>CUIT: {userProfile.cuit}</div>}
          </div>
        </div>
        <div>
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[9px] font-bold tracking-widest uppercase">
            PARA
          </div>
          <div style={{ color: rgb(colors.onSurface) }} className="text-sm font-bold mt-1">
            {client.nombre || "Cliente sin nombre"}
          </div>
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[11px] leading-snug mt-0.5 space-y-0.5">
            {client.direccion && <div>{client.direccion}</div>}
            {client.telefono && <div>{client.telefono}</div>}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="px-4 py-2">
        <div style={{ backgroundColor: rgb(colors.outlineVariant) }} className="h-px" />
      </div>

      {/* Items */}
      <div className="px-4 pb-1">
        <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[9px] font-bold tracking-widest uppercase">
          DESCRIPCIÓN
        </div>
      </div>
      <div className="px-4">
        {allItems.map((item, i) => (
          <div key={i}>
            <div className="flex items-center py-2 gap-3">
              <div className="flex-1 min-w-0">
                <div style={{ color: rgb(colors.onSurface) }} className="text-sm truncate">
                  {item.desc}
                </div>
              </div>
              <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-xs text-right w-16 shrink-0">
                {item.qty} un.
              </div>
              <div style={{ color: rgb(colors.onSurface) }} className="text-sm font-bold text-right w-24 shrink-0">
                ${item.total.toLocaleString("es-AR")}
              </div>
            </div>
            {i < allItems.length - 1 && (
              <div style={{ backgroundColor: rgb(colors.outlineVariant) }} className="h-px opacity-50" />
            )}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="px-4 py-2">
        <div style={{ backgroundColor: rgb(colors.outlineVariant) }} className="h-px" />
      </div>

      {/* Observations */}
      {job.descripcion && (
        <div className="px-4 pb-2">
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[9px] font-bold tracking-widest uppercase mb-1">
            OBSERVACIONES
          </div>
          <div style={{ color: rgb(colors.onSurfaceVariant) }} className="text-[11px] leading-relaxed whitespace-pre-wrap">
            {job.descripcion}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ background: strategy.cssFooterBackground }} className="px-4 py-3 flex items-center justify-between mt-2">
        <div style={{ color: rgba(colors.onPrimary, 0.7) }} className="text-[10px]">
          presupuestito.com
        </div>
        <div className="text-right">
          <div style={{ color: rgba(colors.onPrimary, 0.7) }} className="text-[10px] font-bold tracking-widest uppercase">
            TOTAL
          </div>
          <div style={{ color: rgb(colors.onPrimary) }} className="text-xl font-bold">
            ${finalTotal.toLocaleString("es-AR")}
          </div>
        </div>
      </div>
    </div>
  );
}
