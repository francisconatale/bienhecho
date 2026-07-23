import type { Client, Job, Task, Material } from "@/types";

interface PDFData {
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

export async function generateBudgetPDF({
  client,
  job,
  tasks,
  materiales,
  userProfile,
}: PDFData): Promise<void> {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = await createDocWithInter();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14; // Achicado de 16 a 14 para ganar espacio
  
  // Colors based on globals.css
  const primary: [number, number, number] = [61, 139, 110]; // #3D8B6E
  const onPrimary: [number, number, number] = [255, 255, 255]; // #FFFFFF
  const onSurface: [number, number, number] = [26, 48, 32]; // #1A3020
  const onSurfaceVariant: [number, number, number] = [61, 96, 72]; // #3D6048
  const outlineVariant: [number, number, number] = [181, 208, 188]; // #B5D0BC
  
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

  // Header (Más compacto)
  const headerHeight = 28; // Achicado de 35 a 28
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, headerHeight, "F");
  
  // Center logo in the header
  if (logoBase64 && logoFormat) {
    try {
      const props = doc.getImageProperties(logoBase64);
      const maxHeight = 20; // Achicado para el header más chico
      const maxWidth = 45; 
      
      const ratio = Math.min(maxWidth / props.width, maxHeight / props.height);
      const finalWidth = props.width * ratio;
      const finalHeight = props.height * ratio;

      const logoX = (pageWidth - finalWidth) / 2;
      const logoY = (headerHeight - finalHeight) / 2;
      
      doc.addImage(logoBase64, logoFormat, logoX, logoY, finalWidth, finalHeight);
    } catch (e) {
      const logoSize = 16;
      doc.addImage(logoBase64, logoFormat, (pageWidth - logoSize) / 2, (headerHeight - logoSize) / 2, logoSize, logoSize);
    }
  }
  
  doc.setTextColor(...onPrimary);
  
  // Sender info (Left)
  const senderName = userProfile.company || userProfile.name || "Sin nombre";
  doc.setFont("Inter", "bold");
  doc.setFontSize(18); // de 22 a 18
  doc.text(senderName, margin, 15);
  
  if (userProfile.trade) {
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor(230, 245, 235);
    doc.text(userProfile.trade, margin, 21);
  }
  
  // Invoice info (Right)
  doc.setFont("Inter", "bold");
  doc.setFontSize(7);
  doc.setTextColor(230, 245, 235);
  doc.text("PRESUPUESTO", pageWidth - margin, 10, { align: "right", charSpace: 1 });
  
  doc.setTextColor(...onPrimary);
  doc.setFontSize(12);
  const invoiceId = job.id ? job.id.substring(0, 6).toUpperCase() : "000000";
  doc.text(`#${invoiceId}`, pageWidth - margin, 16, { align: "right" });
  
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(230, 245, 235);
  doc.text(dateStr, pageWidth - margin, 22, { align: "right" });
  
  currentY = headerHeight + 8; // Espaciado reducido
  
  // Separator
  const drawSeparator = (yPos: number) => {
    doc.setDrawColor(...outlineVariant);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
  };
  
  drawSeparator(currentY);
  currentY += 8; // de 12 a 8
  
  // Client & Sender blocks (De / Para)
  const colWidth = (pageWidth - margin * 2) / 2;
  
  // DE column
  doc.setFont("Inter", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("DE", margin, currentY, { charSpace: 1 });
  
  currentY += 5; // de 6 a 5
  doc.setFontSize(12); // de 14 a 12
  doc.setTextColor(...onSurface);
  doc.text(senderName, margin, currentY);
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...onSurfaceVariant);
  let senderInfoY = currentY + 5;
  if (userProfile.address) {
    doc.text(userProfile.address, margin, senderInfoY);
    senderInfoY += 4;
  }
  if (userProfile.phone) {
    doc.text(userProfile.phone, margin, senderInfoY);
    senderInfoY += 4;
  }
  if (userProfile.cuit) {
    doc.text(`CUIT: ${userProfile.cuit}`, margin, senderInfoY);
    senderInfoY += 4;
  }
  
  // PARA column
  let paraY = currentY - 5;
  doc.setFont("Inter", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("PARA", margin + colWidth, paraY, { charSpace: 1 });
  
  paraY += 5;
  doc.setFontSize(12);
  doc.setTextColor(...onSurface);
  doc.text(client.nombre || "Cliente sin nombre", margin + colWidth, paraY);
  
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...onSurfaceVariant);
  let clientInfoY = paraY + 5;
  if (client.direccion) {
    doc.text(client.direccion, margin + colWidth, clientInfoY);
    clientInfoY += 4;
  }
  if (client.telefono) {
    doc.text(client.telefono, margin + colWidth, clientInfoY);
    clientInfoY += 4;
  }
  
  currentY = Math.max(senderInfoY, clientInfoY) + 6; // de 8 a 6
  
  drawSeparator(currentY);
  currentY += 8; // de 12 a 8
  
  // Items
  checkPageBreak(25);
  doc.setFont("Inter", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...onSurfaceVariant);
  doc.text("DESCRIPCIÓN", margin, currentY, { charSpace: 1 });
  currentY += 3; // de 4 a 3
  
  const allItems = [
    ...(tasks || []).map(t => ({
      desc: t.descripcion,
      qty: t.cantidad || 1,
      total: t.precio || 0
    })),
    ...(materiales || []).map(m => ({
      desc: m.nombre_material,
      qty: m.cantidad || 1,
      total: m.subtotal || 0
    }))
  ];
  
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
      cellPadding: { top: 2, bottom: 2, left: 0, right: 0 }, // Reducido de 4 a 2
      font: "Inter",
    },
    columnStyles: {
      0: { cellWidth: colWidth * 1.3, halign: "left", textColor: onSurface, fontSize: 10, fontStyle: "normal" }, // de 11 a 10
      1: { halign: "right", textColor: onSurfaceVariant, fontSize: 9 }, // de 10 a 9
      2: { halign: "right", textColor: onSurface, fontStyle: "bold", fontSize: 10 } // de 11 a 10
    },
    didDrawCell: (data) => {
      // Draw border bottom except last row
      if (data.row.index < allItems.length - 1 && data.cell.section === 'body') {
        doc.setDrawColor(...outlineVariant);
        doc.setLineWidth(0.1);
        doc.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height
        );
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6; // de 8 a 6
  
  drawSeparator(currentY);
  currentY += 8; // de 12 a 8
  
  // Observations
  if (job.descripcion) {
    checkPageBreak(30); // de 40 a 30
    doc.setFont("Inter", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...onSurfaceVariant);
    doc.text("OBSERVACIONES", margin, currentY, { charSpace: 1 });
    currentY += 6; // de 8 a 6
    
    doc.setFont("Inter", "normal");
    doc.setFontSize(9); // de 10 a 9
    doc.setTextColor(...onSurfaceVariant);
    const obsLines = doc.splitTextToSize(job.descripcion, pageWidth - margin * 2);
    doc.text(obsLines, margin, currentY);
    currentY += obsLines.length * 4 + 4; // Menos interlineado
    
    drawSeparator(currentY);
    currentY += 8; // de 12 a 8
  }

  // Footer / Total
  const footerHeight = 30; // de 40 a 30
  
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
  doc.setFontSize(7);
  doc.setTextColor(230, 245, 235);
  doc.text("presupuestito.com", margin, finalFooterY + footerHeight - 10);
  
  doc.setFont("Inter", "bold");
  doc.setFontSize(9);
  doc.text("TOTAL", pageWidth - margin, finalFooterY + 12, { align: "right", charSpace: 1 });
  
  const finalTotal = allItems.reduce((acc, i) => acc + i.total, 0);
  doc.setFontSize(22); // de 28 a 22
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
