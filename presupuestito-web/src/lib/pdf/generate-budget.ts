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

/**
 * ESTILO EDITORIAL MINIMALISTA — verde sutil
 * Fondo blanco, mucho espacio en blanco, serif solo en el nombre y el total.
 * Líneas divisorias finas en verde salvia apagado, sin bloques de color,
 * jerarquía por tipografía y peso, no por color.
 */
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
  const margin = 20;

  // Paleta editorial minimalista con acento verde salvia apagado
  const ink: [number, number, number] = [26, 32, 27]; // casi negro, con tinte verdoso
  const textSecondary: [number, number, number] = [100, 116, 105]; // gris-verde
  const textMuted: [number, number, number] = [140, 152, 140];
  const sage: [number, number, number] = [91, 138, 111]; // acento verde salvia
  const sageDark: [number, number, number] = [58, 94, 74]; // verde más oscuro para el total
  const hairline: [number, number, number] = [214, 224, 216]; // línea muy sutil verde-gris
  const brandGreen: [number, number, number] = [21, 128, 61]; // verde vibrante para headers y totales

  // ---------- Encabezado (Solido Compacto) ----------
  const headerHeight = 35;
  doc.setFillColor(...brandGreen);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

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
        } else if (urlLower.includes(".jpg") || urlLower.includes(".jpeg")) {
          logoFormat = "JPEG";
        }
      }
    } catch (error) {
      console.error("Failed to load logo", error);
    }
  }

  let textX = margin;
  if (logoBase64 && logoFormat) {
    // Draw logo in the header
    // The logo will be drawn in the center horizontally, centered vertically in the header
    const logoSize = 20;
    doc.addImage(logoBase64, logoFormat, (pageWidth - logoSize) / 2, (headerHeight - logoSize) / 2, logoSize, logoSize);
  }

  doc.setFont("Inter", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(userProfile.company || userProfile.name, textX, 18);

  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(240, 253, 244); // light green tint
  doc.text(userProfile.trade || "Servicios Profesionales", textX, 26);

  doc.setFont("Inter", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("PRESUPUESTO", pageWidth - margin, 18, { align: "right" });

  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(240, 253, 244);
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, 26, { align: "right" });

  // ---------- DE / PARA ----------
  let y = 50;

  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...sage);
  doc.text("DE", margin, y, { charSpace: 0.4 });
  doc.text("PARA", pageWidth / 2 + 10, y, { charSpace: 0.4 });

  y += 7;
  doc.setFont("Inter", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  doc.text(userProfile.name, margin, y);
  doc.text(client.nombre, pageWidth / 2 + 10, y);

  y += 5;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...textSecondary);
  doc.text(userProfile.address || "Domicilio no especificado", margin, y);
  doc.text(client.email || "S/D", pageWidth / 2 + 10, y);

  y += 5;
  if (userProfile.matricula) {
    doc.text(`Matrícula: ${userProfile.matricula}`, margin, y);
  }
  if (client.direccion) {
    doc.text(client.direccion, pageWidth / 2 + 10, y);
  }

  y += 8;
  doc.setDrawColor(...hairline);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 15;

  // ---------- Tareas y servicios ----------
  if (tasks.length > 0) {
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...sage);
    doc.text("TAREAS Y SERVICIOS", margin, y, { charSpace: 0.4 });
    y += 4;
  }

  const tableData = tasks.map((task) => [
    task.descripcion,
    task.cantidad ? String(task.cantidad) : "1",
    task.precio_unitario !== undefined && task.precio_unitario !== null
      ? `$ ${task.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
      : "-",
    `$ ${(task.precio ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  ]);

  autoTable.default(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[
      { content: "Descripción", styles: { halign: "left" } },
      { content: "Cant.", styles: { halign: "center" } },
      { content: "Precio Unit.", styles: { halign: "right" } },
      { content: "Subtotal", styles: { halign: "right" } }
    ]],
    body: tableData,
    theme: "grid",
    tableLineWidth: 0,
    headStyles: {
      fillColor: brandGreen,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      lineColor: brandGreen,
      lineWidth: 0.3,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: ink,
      lineColor: hairline,
      lineWidth: { bottom: 0.3, top: 0, left: 0, right: 0 },
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 35, halign: "right", textColor: sageDark },
    },
  });

  let currentY =
    (doc as Parameters<typeof autoTable.default>[0] & { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 10;

  // ---------- Materiales insumidos ----------
  if (materiales && materiales.length > 0) {
    currentY += 2;
    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...sage);
    doc.text("MATERIALES INSUMIDOS", margin, currentY, { charSpace: 0.4 });
    currentY += 4;

    const materialsData = materiales.map((m) => [
      m.nombre_material,
      `${m.cantidad}`,
      `$ ${m.precio_unitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
      `$ ${m.subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    ]);

    autoTable.default(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [[
        { content: "Material", styles: { halign: "left" } },
        { content: "Cant.", styles: { halign: "center" } },
        { content: "Precio Unit.", styles: { halign: "right" } },
        { content: "Subtotal", styles: { halign: "right" } }
      ]],
      body: materialsData,
      theme: "grid",
      tableLineWidth: 0,
      headStyles: {
        fillColor: brandGreen,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        lineColor: brandGreen,
        lineWidth: 0.3,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: ink,
        lineColor: hairline,
        lineWidth: { bottom: 0.3, top: 0, left: 0, right: 0 },
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        1: { cellWidth: 15, halign: "center" },
        2: { cellWidth: 25, halign: "right" },
        3: { cellWidth: 35, halign: "right", textColor: sageDark },
      },
    });

    currentY =
      (doc as Parameters<typeof autoTable.default>[0] & { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY + 10;
  }

  // ---------- Total ----------
  const totalTasks = tasks.reduce((acc, t) => acc + (t.precio ?? 0), 0);
  const totalMaterials = (materiales || []).reduce((acc, m) => acc + m.subtotal, 0);
  const finalTotal = totalTasks + totalMaterials;

  currentY += 10;

  doc.setDrawColor(...brandGreen);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - margin - 65, currentY - 6, pageWidth - margin, currentY - 6);

  doc.setFont("Inter", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...brandGreen);
  doc.text("TOTAL", pageWidth - margin, currentY, { align: "right", charSpace: 0.4 });

  doc.setFont("Inter", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...brandGreen);
  const totalText = `$ ${finalTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
  doc.text(totalText, pageWidth - margin, currentY + 8, { align: "right" });

  // ---------- Notas ----------
  if (job.descripcion) {
    const notesY = currentY + 22;
    doc.setFont("Inter", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...sage);
    doc.text("NOTAS", margin, notesY, { charSpace: 0.4 });

    doc.setFont("Inter", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...textSecondary);
    const splitNotes = doc.splitTextToSize(job.descripcion, pageWidth - margin * 2);
    doc.text(splitNotes, margin, notesY + 6);
  }

  // ---------- Footer ----------
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text("Generado con Presupuestito", margin, footerY);

  const pdfBlobUrl = doc.output("bloburl");
  window.open(pdfBlobUrl.toString(), "_blank");
}
