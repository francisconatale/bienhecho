export const LAYOUT = {
  margin: 14,
  headerHeight: 28,
  footerHeight: 30,
  senderNameFontSize: 18,
  tradeFontSize: 9,
  labelFontSize: 7,
  labelCharSpace: 1,
  invoiceIdFontSize: 12,
  dateFontSize: 9,
  deParaTitleFontSize: 7,
  deParaNameFontSize: 12,
  deParaInfoFontSize: 9,
  descriptionLabelFontSize: 7,
  itemDescFontSize: 10,
  itemQtyFontSize: 9,
  itemTotalFontSize: 10,
  observationsLabelFontSize: 7,
  observationsTextFontSize: 9,
  totalLabelFontSize: 9,
  totalAmountFontSize: 22,
  logoMaxHeight: 20,
  logoMaxWidth: 45,
  fallbackLogoSize: 16,
  separatorLineWidth: 0.2,
  cellLineWidth: 0.1,
  headerPadding: 8,
  sectionGap: 8,
  tightSectionGap: 6,
  itemRowGap: 3,
  infoLineGap: 4,
  deParaLineGap: 5,
} as const;

export function getPageLayout(pageWidth: number) {
  const colWidth = (pageWidth - LAYOUT.margin * 2) / 2;
  return { pageWidth, colWidth };
}

export interface LayoutItem {
  desc: string;
  qty: number;
  total: number;
}

export function buildItemsList(tasks: any[], materiales: any[]): LayoutItem[] {
  return [
    ...(tasks || []).map(t => ({
      desc: t.descripcion,
      qty: t.cantidad || 1,
      total: t.precio || 0,
    })),
    ...(materiales || []).map(m => ({
      desc: m.nombre_material,
      qty: m.cantidad || 1,
      total: m.subtotal || 0,
    })),
  ];
}
