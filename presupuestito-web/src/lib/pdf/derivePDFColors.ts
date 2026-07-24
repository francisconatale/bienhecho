import type { PDFColorSet } from "./types";
import { hexToRgb } from "./types";

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const ss = s / 100;
  const ll = l / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ll - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function getLuminance(r: number, g: number, b: number): number {
  const [rr, gg, bb] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

export function derivePDFColors(hex: string): PDFColorSet {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return {
      primary: [61, 139, 110],
      onPrimary: [255, 255, 255],
      onSurface: [26, 48, 32],
      onSurfaceVariant: [61, 96, 72],
      outlineVariant: [181, 208, 188],
    };
  }

  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);

  const onSurfaceH = h;
  const onSurfaceS = Math.max(10, Math.round(s * 0.4));
  const onSurfaceL = 25;
  const onSurface = hslToRgb(onSurfaceH, onSurfaceS, onSurfaceL);

  const onSurfaceVariantH = h;
  const onSurfaceVariantS = Math.max(15, Math.round(s * 0.5));
  const onSurfaceVariantL = 40;
  const onSurfaceVariant = hslToRgb(onSurfaceVariantH, onSurfaceVariantS, onSurfaceVariantL);

  const outlineVariantH = h;
  const outlineVariantS = Math.max(15, Math.round(s * 0.5));
  const outlineVariantL = 78;
  const outlineVariant = hslToRgb(outlineVariantH, outlineVariantS, outlineVariantL);

  const primaryLuminance = getLuminance(rgb[0], rgb[1], rgb[2]);
  const onPrimary: [number, number, number] = primaryLuminance > 0.5 ? [26, 48, 32] : [255, 255, 255];

  return {
    primary: rgb,
    onPrimary,
    onSurface,
    onSurfaceVariant,
    outlineVariant,
  };
}
