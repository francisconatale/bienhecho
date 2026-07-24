export interface PDFParams {
  primaryColor: string;
  logoScale: number;
}

export const DEFAULT_PDF_PARAMS: PDFParams = {
  primaryColor: "#3D8B6E",
  logoScale: 1,
};

export type PDFColorSet = {
  primary: [number, number, number];
  onPrimary: [number, number, number];
  onSurface: [number, number, number];
  onSurfaceVariant: [number, number, number];
  outlineVariant: [number, number, number];
};

export function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
  }
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}
