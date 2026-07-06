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
 * ESTILO CORPORATIVO VERDE
 * Layout tradicional con paleta verde bosque/esmeralda.
 * Línea divisoria gruesa, encabezados de tabla en verde oscuro, total resaltado en caja.
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

  // Verde bosque como primario, gris verdoso como secundario
  const primaryColor: [number, number, number] = [21, 128, 61]; // emerald-700
  const secondaryColor: [number, number, number] = [100, 116, 139];
  const lightGreen: [number, number, number] = [236, 253, 245]; // emerald-50
  const materialsTabColor: [number, number, number] = [116, 168, 145]; // verde musgo/salvia sutil

  doc.setFont("Inter", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text(userProfile.company || userProfile.name, margin, 30);

  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text(userProfile.trade || "Servicios Profesionales", margin, 37);

  doc.setFont("Inter", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("PRESUPUESTO", pageWidth - margin, 30, { align: "right" });

  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, 37, { align: "right" });

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, 42, pageWidth - margin, 42);

  let y = 55;

  doc.setFont("Inter", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text("DE", margin, y);
  doc.text("PARA", pageWidth / 2 + 10, y);

  y += 7;
  doc.setFont("Inter", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(userProfile.name, margin, y);
  doc.text(client.nombre, pageWidth / 2 + 10, y);

  y += 5;
  doc.setFont("Inter", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(userProfile.address || "Domicilio no especificado", margin, y);
  doc.text(client.email || "S/D", pageWidth / 2 + 10, y);

  y += 5;
  if (userProfile.matricula) {
    doc.text(`Matrícula: ${userProfile.matricula}`, margin, y);
  }
  if (client.direccion) {
    doc.text(client.direccion, pageWidth / 2 + 10, y);
  }

  y += 15;

  if (tasks.length > 0) {
    doc.setFont("Inter", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text("TRABAJOS Y SERVICIOS", margin, y);
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
    head: [["Descripción", "Cant.", "Precio Unit.", "Subtotal"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: lightGreen,
    },
    columnStyles: {
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
  });

  let currentY = (doc as Parameters<typeof autoTable.default>[0] & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  if (materiales && materiales.length > 0) {
    currentY += 2;
    doc.setFont("Inter", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text("MATERIALES INSUMIDOS", margin, currentY);
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
      head: [["Material", "Cant.", "Precio Unit.", "Subtotal"]],
      body: materialsData,
      theme: "grid",
      headStyles: {
        fillColor: materialsTabColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: lightGreen,
      },
      columnStyles: {
        1: { cellWidth: 15, halign: "center" },
        2: { cellWidth: 25, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
      },
    });

    currentY = (doc as Parameters<typeof autoTable.default>[0] & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }

  const totalTasks = tasks.reduce((acc, t) => acc + (t.precio ?? 0), 0);
  const totalMaterials = (materiales || []).reduce((acc, m) => acc + m.subtotal, 0);
  const finalTotal = totalTasks + totalMaterials;

  // Separación adicional para que el total no quede tan pegado a la tabla
  currentY += 10;

  // Caja de total resaltada en verde claro
  doc.setFillColor(...lightGreen);
  doc.roundedRect(pageWidth - margin - 80, currentY - 8, 80, 14, 2, 2, "F");

  doc.setFont("Inter", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text("TOTAL", pageWidth - margin - 75, currentY);
  doc.text(
    `$ ${finalTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    pageWidth - margin - 5,
    currentY,
    { align: "right" }
  );

  if (job.descripcion) {
    const notesY = currentY + 15;
    doc.setFont("Inter", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("NOTAS", margin, notesY);

    doc.setFont("Inter", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const splitNotes = doc.splitTextToSize(job.descripcion, pageWidth - margin * 2);
    doc.text(splitNotes, margin, notesY + 6);
  }

  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFont("Inter", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Presupuestito", margin, footerY);

  const timestamp = Date.now();
  const fileName = `presupuesto-${client.nombre.replace(/\s+/g, "-").toLowerCase()}-${timestamp}.pdf`;
  doc.save(fileName);
}
