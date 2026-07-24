import type jsPDF from "jspdf";
import type { PDFColorSet, ColorMode } from "./types";
import { hexToRgb } from "./types";
import { derivePDFColors } from "./derivePDFColors";

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

function drawHorizontalGradient(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  from: [number, number, number],
  to: [number, number, number],
): void {
  const steps = Math.max(2, Math.min(w, 80));
  const stepW = w / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const color = lerpColor(from, to, t);
    doc.setFillColor(...color);
    doc.rect(x + i * stepW, y, Math.ceil(stepW), h, "F");
  }
}

export interface ColorStrategy {
  mode: ColorMode;
  colors: PDFColorSet;
  cssHeaderBackground: string;
  cssFooterBackground: string;
  applyHeaderBackground(doc: jsPDF, x: number, y: number, w: number, h: number): void;
  applyFooterBackground(doc: jsPDF, x: number, y: number, w: number, h: number): void;
}

export function createColorStrategy(
  primaryColor: string,
  secondaryColor?: string,
): ColorStrategy {
  const primaryRgb = hexToRgb(primaryColor);
  const colors = derivePDFColors(primaryColor);
  const rgb = colors.primary;

  if (!secondaryColor) {
    const css = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    return {
      mode: "solid",
      colors,
      cssHeaderBackground: css,
      cssFooterBackground: css,
      applyHeaderBackground(doc, x, y, w, h) {
        doc.setFillColor(...rgb);
        doc.rect(x, y, w, h, "F");
      },
      applyFooterBackground(doc, x, y, w, h) {
        doc.setFillColor(...rgb);
        doc.rect(x, y, w, h, "F");
      },
    };
  }

  const secondaryRgb = hexToRgb(secondaryColor) ?? primaryRgb;

  return {
    mode: "gradient",
    colors,
    cssHeaderBackground: `linear-gradient(90deg,rgb(${rgb[0]},${rgb[1]},${rgb[2]}),rgb(${secondaryRgb[0]},${secondaryRgb[1]},${secondaryRgb[2]}))`,
    cssFooterBackground: `linear-gradient(90deg,rgb(${rgb[0]},${rgb[1]},${rgb[2]}),rgb(${secondaryRgb[0]},${secondaryRgb[1]},${secondaryRgb[2]}))`,
    applyHeaderBackground(doc, x, y, w, h) {
      drawHorizontalGradient(doc, x, y, w, h, rgb, secondaryRgb);
    },
    applyFooterBackground(doc, x, y, w, h) {
      drawHorizontalGradient(doc, x, y, w, h, rgb, secondaryRgb);
    },
  };
}
