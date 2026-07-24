import type { Client, Job, Task, Material } from "@/types";
import type { PDFParams } from "./types";
import { DEFAULT_PDF_PARAMS } from "./types";
import { derivePDFColors } from "./derivePDFColors";
import { LAYOUT, buildItemsList } from "./budget-layout";

export interface PDFData {
  client: Client;
  job: Job;
  tasks: Task[];
  materiales: Material[];
  userProfile: {
    name: string;
    company?: string;
    address?: string;
    cuit?: string;
    matricula?: string;
    trade?: string;
    logo_url?: string;
    phone?: string;
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function createDocWithInter(): Promise<InstanceType<Awaited<typeof import("jspdf")>["default"]>> {
  const [{ default: jsPDF }, regular, bold, italic] = await Promise.all([
    import("jspdf"),
    fetch("/fonts/Inter-Regular.ttf")
      .then((r) => r.arrayBuffer())
      .then(arrayBufferToBase64),
    fetch("/fonts/Inter-Bold.ttf")
      .then((r) => r.arrayBuffer())
      .then(arrayBufferToBase64),
    fetch("/fonts/Inter-Italic.ttf")
      .then((r) => r.arrayBuffer())
      .then(arrayBufferToBase64),
  ]);

  const doc = new jsPDF();

  doc.addFileToVFS("Inter-Regular.ttf", regular);
  doc.addFileToVFS("Inter-Bold.ttf", bold);
  doc.addFileToVFS("Inter-Italic.ttf", italic);

  doc.addFont("Inter-Regular.ttf", "Inter", "normal");
  doc.addFont("Inter-Bold.ttf", "Inter", "bold");
  doc.addFont("Inter-Italic.ttf", "Inter", "italic");

  return doc;
}

export async function generateBudgetPDF(
  {
    client,
    job,
    tasks,
    materiales,
    userProfile,
  }: PDFData,
  params?: PDFParams
): Promise<void> {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = await createDocWithInter();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { margin, headerHeight, footerHeight } = LAYOUT;

  const effectiveParams = params ?? DEFAULT_PDF_PARAMS;
  const colors = derivePDFColors(effectiveParams.primaryColor);
  const { primary, onPrimary, onSurface, onSurfaceVariant, outlineVariant } = colors;
  
  let currentY = 0;
  
  // Helper to add a new page if needed
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
  };

  // Load logo
  let logoBase64 = null;
  let logoFormat = null;
  if (userProfile.logo_url) {
    try {
      const response = await fetch(userProfile.logo_url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        logoBase64 = arrayBufferToBase64(buffer);
        const urlLower = userProfile.logo_url.toLowerCase();
        if (urlLower.includes(".png")) {
          logoFormat = "PNG";
        } else if (urlLower.includes(".jpg") || urlLower.includes(".jpeg") || urlLower.includes(".webp")) {
          logoFormat = "JPEG";
        }
      }
    } catch (error) {
      console.error("Failed to load logo", error);
    }
  }

  // Header
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, headerHeight, "F");
  
  // Logo in the header (centered, size adjustable)
  if (logoBase64 && logoFormat) {
    try {
      const props = doc.getImageProperties(logoBase64);
      const scale = effectiveParams.logoScale;
      const maxHeight = LAYOUT.logoMaxHeight * scale;
      const maxWidth = LAYOUT.logoMaxWidth * scale;
      const ratio = Math.min(maxWidth / props.width, maxHeight / props.height);
      const finalWidth = props.width * ratio;
      const finalHeight = props.height * ratio;

      const logoX = (pageWidth - finalWidth) / 2;
      const logoY = (headerHeight - finalHeight) / 2;
      
      doc.addImage(logoBase64, logoFormat, logoX, logoY, finalWidth, finalHeight);
    } catch (e) {
      const logoSize = LAYOUT.fallbackLogoSize * effectiveParams.logoScale;
      doc.addImage(logoBase64, logoFormat, (pageWidth - logoSize) / 2, (headerHeight - logoSize) / 2, logoSize, logoSize);
    }
  }
  
  doc.setTextColor(...onPrimary);
  
  // Sender info (Left)
  const senderName = userProfile.company || userProfile.name || "Sin nombre";
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.senderNameFontSize);
  doc.text(senderName, margin, 15);
  
  if (userProfile.trade) {
    doc.setFont("Inter", "normal");
    doc.setFontSize(LAYOUT.tradeFontSize);
    doc.setTextColor(230, 245, 235);
    doc.text(userProfile.trade, margin, 21);
  }
  
  // Invoice info (Right)
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.labelFontSize);
  doc.setTextColor(230, 245, 235);
  doc.text("PRESUPUESTO", pageWidth - margin, 10, { align: "right", charSpace: LAYOUT.labelCharSpace });
  
  doc.setTextColor(...onPrimary);
  doc.setFontSize(LAYOUT.invoiceIdFontSize);
  const invoiceId = job.id ? job.id.substring(0, 6).toUpperCase() : "000000";
  doc.text(`#${invoiceId}`, pageWidth - margin, 16, { align: "right" });
  
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFont("Inter", "normal");
  doc.setFontSize(LAYOUT.dateFontSize);
  doc.setTextColor(230, 245, 235);
  doc.text(dateStr, pageWidth - margin, 22, { align: "right" });
  
  currentY = headerHeight + LAYOUT.headerPadding;
  
  // Separator
  const drawSeparator = (yPos: number) => {
    doc.setDrawColor(...outlineVariant);
    doc.setLineWidth(LAYOUT.separatorLineWidth);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };
  
  drawSeparator(currentY);
  currentY += LAYOUT.sectionGap;
  
  // Client & Sender blocks (De / Para)
  const colWidth = (pageWidth - margin * 2) / 2;
  
  // DE column
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.deParaTitleFontSize);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("DE", margin, currentY, { charSpace: LAYOUT.labelCharSpace });
  
  currentY += LAYOUT.deParaLineGap;
  doc.setFontSize(LAYOUT.deParaNameFontSize);
  doc.setTextColor(...onSurface);
  doc.text(senderName, margin, currentY);
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(LAYOUT.deParaInfoFontSize);
  doc.setTextColor(...onSurfaceVariant);
  let senderInfoY = currentY + LAYOUT.deParaLineGap;
  if (userProfile.address) {
    doc.text(userProfile.address, margin, senderInfoY);
    senderInfoY += LAYOUT.infoLineGap;
  }
  if (userProfile.phone) {
    doc.text(userProfile.phone, margin, senderInfoY);
    senderInfoY += LAYOUT.infoLineGap;
  }
  if (userProfile.cuit) {
    doc.text(`CUIT: ${userProfile.cuit}`, margin, senderInfoY);
    senderInfoY += LAYOUT.infoLineGap;
  }
  
  // PARA column
  let paraY = currentY - LAYOUT.deParaLineGap;
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.deParaTitleFontSize);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("PARA", margin + colWidth, paraY, { charSpace: LAYOUT.labelCharSpace });
  
  paraY += LAYOUT.deParaLineGap;
  doc.setFontSize(LAYOUT.deParaNameFontSize);
  doc.setTextColor(...onSurface);
  doc.text(client.nombre || "Cliente sin nombre", margin + colWidth, paraY);
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(LAYOUT.deParaInfoFontSize);
  doc.setTextColor(...onSurfaceVariant);
  let clientInfoY = paraY + LAYOUT.deParaLineGap;
  if (client.direccion) {
    doc.text(client.direccion, margin + colWidth, clientInfoY);
    clientInfoY += LAYOUT.infoLineGap;
  }
  if (client.telefono) {
    doc.text(client.telefono, margin + colWidth, clientInfoY);
    clientInfoY += LAYOUT.infoLineGap;
  }
  
  currentY = Math.max(senderInfoY, clientInfoY) + LAYOUT.tightSectionGap;
  
  drawSeparator(currentY);
  currentY += LAYOUT.sectionGap;
  
  // Items
  checkPageBreak(25);
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.descriptionLabelFontSize);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("DESCRIPCIÓN", margin, currentY, { charSpace: LAYOUT.labelCharSpace });
  currentY += LAYOUT.itemRowGap;
  
  const allItems = buildItemsList(tasks, materiales);
  
  autoTable.default(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    showHead: false,
    body: allItems.map(item => [
      item.desc,
      `${item.qty} un.`,
      `$${item.total.toLocaleString("es-AR")}`
    ]),
    theme: "plain",
    styles: {
      cellPadding: { top: 2, bottom: 2, left: 0, right: 0 },
      font: "Inter",
    },
    columnStyles: {
      0: { cellWidth: colWidth * 1.3, halign: "left", textColor: onSurface, fontSize: LAYOUT.itemDescFontSize, fontStyle: "normal" },
      1: { halign: "right", textColor: onSurfaceVariant, fontSize: LAYOUT.itemQtyFontSize },
      2: { halign: "right", textColor: onSurface, fontStyle: "bold", fontSize: LAYOUT.itemTotalFontSize }
    },
    didDrawCell: (data) => {
      if (data.row.index < allItems.length - 1 && data.cell.section === 'body') {
        doc.setDrawColor(...outlineVariant);
        doc.setLineWidth(LAYOUT.cellLineWidth);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + LAYOUT.tightSectionGap;
  
  drawSeparator(currentY);
  currentY += LAYOUT.sectionGap;
  
  // Observations
  if (job.descripcion) {
    checkPageBreak(30);
    doc.setFont("Inter", "bold");
    doc.setFontSize(LAYOUT.observationsLabelFontSize);
    doc.setTextColor(...onSurfaceVariant);
    doc.text("OBSERVACIONES", margin, currentY, { charSpace: LAYOUT.labelCharSpace });
    currentY += LAYOUT.tightSectionGap;
    
    doc.setFont("Inter", "normal");
    doc.setFontSize(LAYOUT.observationsTextFontSize);
    doc.setTextColor(...onSurfaceVariant);
    const obsLines = doc.splitTextToSize(job.descripcion, pageWidth - margin * 2);
    doc.text(obsLines, margin, currentY);
    currentY += obsLines.length * 4 + 4;
    
    drawSeparator(currentY);
    currentY += LAYOUT.sectionGap;
  }

  // Footer / Total
  
  // Only add a new page if the content overlaps with the fixed footer area
  if (currentY + footerHeight + 10 > pageHeight) {
    doc.addPage();
  }
  
  // Siempre al fondo de la hoja
  let finalFooterY = pageHeight - footerHeight;
  
  doc.setFillColor(...primary);
  // Full width footer
  doc.rect(0, finalFooterY, pageWidth, footerHeight, "F");
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(LAYOUT.dateFontSize);
  doc.setTextColor(230, 245, 235);
  doc.text("presupuestito.com", margin, finalFooterY + footerHeight - 10);
  
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.totalLabelFontSize);
  doc.text("TOTAL", pageWidth - margin, finalFooterY + 12, { align: "right", charSpace: LAYOUT.labelCharSpace });
  
  const finalTotal = allItems.reduce((acc, i) => acc + i.total, 0);
  doc.setFontSize(LAYOUT.totalAmountFontSize);
  doc.setTextColor(...onPrimary);
  doc.text(`$${finalTotal.toLocaleString("es-AR")}`, pageWidth - margin, finalFooterY + 22, { align: "right" });
  
  // Asignar el nombre del archivo para que al descargar desde el visor tenga el nombre correcto
  const clientNameStr = client.nombre ? client.nombre.replace(/\s+/g, "_") : "Cliente";
  const fileName = `Presupuesto_${clientNameStr}_${invoiceId}.pdf`;
  
  doc.setProperties({
    title: fileName,
    subject: `Presupuesto para ${client.nombre}`,
    creator: "Presupuestito"
  });
  
  const pdfBlobUrl = doc.output("bloburl");
  window.open(pdfBlobUrl.toString(), "_blank");
}
