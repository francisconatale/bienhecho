import type { Client, Job, Task, Material } from "@/types";
import type { PDFParams } from "./types";
import { DEFAULT_PDF_PARAMS } from "./types";
import { derivePDFColors } from "./derivePDFColors";
import { createColorStrategy } from "./color-strategies";
import { LAYOUT, buildTasksList, buildMaterialsList } from "./budget-layout";

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

const LOGO_MAX_DIMENSION = 800;
const LOGO_JPEG_QUALITY = 0.85;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function compressLogo(
  base64: string,
  format: string
): Promise<{ base64: string; format: string }> {
  try {
    const src = `data:image/${format.toLowerCase()};base64,${base64}`;
    const img = await loadImage(src);

    const { width, height } = img;
    if (width <= LOGO_MAX_DIMENSION && height <= LOGO_MAX_DIMENSION) {
      return { base64, format };
    }

    const ratio = Math.min(LOGO_MAX_DIMENSION / width, LOGO_MAX_DIMENSION / height);
    const newWidth = Math.round(width * ratio);
    const newHeight = Math.round(height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d")!;

    const isPng = format.toUpperCase() === "PNG";
    if (!isPng) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, newWidth, newHeight);
    }
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    if (isPng) {
      const compressed = canvas.toDataURL("image/png");
      const compressedBase64 = compressed.split(",")[1];
      return { base64: compressedBase64, format: "PNG" };
    }

    const compressed = canvas.toDataURL("image/jpeg", LOGO_JPEG_QUALITY);
    const compressedBase64 = compressed.split(",")[1];
    return { base64: compressedBase64, format: "JPEG" };
  } catch {
    return { base64, format };
  }
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
  const { onPrimary, onSurface, onSurfaceVariant, outlineVariant } = colors;
  const strategy = createColorStrategy(effectiveParams.primaryColor, effectiveParams.secondaryColor);
  
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
        let rawBase64 = arrayBufferToBase64(buffer);
        let rawFormat = "PNG";
        const urlLower = userProfile.logo_url.toLowerCase();
        if (urlLower.includes(".jpg") || urlLower.includes(".jpeg") || urlLower.includes(".webp")) {
          rawFormat = "JPEG";
        }
        const compressed = await compressLogo(rawBase64, rawFormat);
        logoBase64 = compressed.base64;
        logoFormat = compressed.format;
      }
    } catch (error) {
      console.error("Failed to load logo", error);
    }
  }

  // Header
  strategy.applyHeaderBackground(doc, 0, 0, pageWidth, headerHeight);
  
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
  if (userProfile.matricula) {
    doc.text(`Matrícula: ${userProfile.matricula}`, margin, senderInfoY);
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
  
  // Items (Trabajos)
  checkPageBreak(25);
  currentY += LAYOUT.itemRowGap;
  
  const tasksItems = buildTasksList(tasks);
  const materialsItems = buildMaterialsList(materiales);
  
  autoTable.default(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    showHead: 'firstPage',
    head: [[
      { content: "TRABAJOS", styles: { halign: "left" } },
      { content: "CANTIDAD", styles: { halign: "right" } },
      { content: "PRECIO UNITARIO", styles: { halign: "right" } },
      { content: "TOTAL", styles: { halign: "right" } }
    ]],
    body: tasksItems.map(item => [
      item.desc,
      `${item.qty} un.`,
      `$${item.unitPrice.toLocaleString("es-AR")}`,
      `$${item.total.toLocaleString("es-AR")}`
    ]),
    theme: "plain",
    styles: {
      cellPadding: { top: 4, bottom: 4, left: 0, right: 0 },
      font: "Inter",
    },
    headStyles: {
      fillColor: false,
      textColor: onSurfaceVariant,
      fontSize: LAYOUT.descriptionLabelFontSize,
      fontStyle: "bold",
      cellPadding: { top: 0, bottom: 6, left: 0, right: 0 }
    },
    columnStyles: {
      0: { cellWidth: colWidth * 1.1, halign: "left", textColor: onSurface, fontSize: LAYOUT.itemDescFontSize, fontStyle: "normal" },
      1: { halign: "right", textColor: onSurfaceVariant, fontSize: LAYOUT.itemQtyFontSize },
      2: { halign: "right", textColor: onSurfaceVariant, fontSize: LAYOUT.itemQtyFontSize },
      3: { halign: "right", textColor: onSurface, fontStyle: "bold", fontSize: LAYOUT.itemTotalFontSize }
    },
    didDrawCell: (data) => {
      if (data.row.index < tasksItems.length - 1 && data.cell.section === 'body') {
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
  
    // Materiales (if any)
  if (materialsItems.length > 0) {
    drawSeparator(currentY);
    currentY += LAYOUT.sectionGap;
    
    checkPageBreak(25);
    currentY += LAYOUT.itemRowGap;
    
    autoTable.default(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      showHead: 'firstPage',
      head: [[
        { content: "MATERIALES", styles: { halign: "left" } },
        { content: "CANTIDAD", styles: { halign: "right" } },
        { content: "PRECIO UNITARIO", styles: { halign: "right" } },
        { content: "TOTAL", styles: { halign: "right" } }
      ]],
      body: materialsItems.map(item => [
        item.desc,
        `${item.qty} un.`,
        `$${item.unitPrice.toLocaleString("es-AR")}`,
        `$${item.total.toLocaleString("es-AR")}`
      ]),
      theme: "plain",
      styles: {
        cellPadding: { top: 4, bottom: 4, left: 0, right: 0 },
        font: "Inter",
      },
      headStyles: {
        fillColor: false,
        textColor: onSurfaceVariant,
        fontSize: LAYOUT.descriptionLabelFontSize,
        fontStyle: "bold",
        cellPadding: { top: 0, bottom: 6, left: 0, right: 0 }
      },
      columnStyles: {
        0: { cellWidth: colWidth * 1.1, halign: "left", textColor: onSurface, fontSize: LAYOUT.itemDescFontSize, fontStyle: "normal" },
        1: { halign: "right", textColor: onSurfaceVariant, fontSize: LAYOUT.itemQtyFontSize },
        2: { halign: "right", textColor: onSurfaceVariant, fontSize: LAYOUT.itemQtyFontSize },
        3: { halign: "right", textColor: onSurface, fontStyle: "bold", fontSize: LAYOUT.itemTotalFontSize }
      },
      didDrawCell: (data) => {
        if (data.row.index < materialsItems.length - 1 && data.cell.section === 'body') {
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
  }
  
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
  
  strategy.applyFooterBackground(doc, 0, finalFooterY, pageWidth, footerHeight);
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(LAYOUT.dateFontSize);
  doc.setTextColor(230, 245, 235);
  doc.text("bien-hecho.com", margin, finalFooterY + footerHeight - 10);
  
  doc.setFont("Inter", "bold");
  doc.setFontSize(LAYOUT.totalLabelFontSize);
  doc.text("TOTAL", pageWidth - margin, finalFooterY + 12, { align: "right", charSpace: LAYOUT.labelCharSpace });
  
  const finalTotal = [...tasksItems, ...materialsItems].reduce((acc, i) => acc + i.total, 0);
  doc.setFontSize(LAYOUT.totalAmountFontSize);
  doc.setTextColor(...onPrimary);
  doc.text(`$${finalTotal.toLocaleString("es-AR")}`, pageWidth - margin, finalFooterY + 22, { align: "right" });
  
  // Asignar el nombre del archivo para que al descargar desde el visor tenga el nombre correcto
  const clientNameStr = client.nombre ? client.nombre.replace(/\s+/g, "_") : "Cliente";
  const fileName = `Presupuesto_${clientNameStr}_${invoiceId}.pdf`;
  
  doc.setProperties({
    title: fileName,
    subject: `Presupuesto para ${client.nombre}`,
    creator: "Bien Hecho"
  });
  
  const pdfBlobUrl = doc.output("bloburl");
  window.open(pdfBlobUrl.toString(), "_blank");
}
