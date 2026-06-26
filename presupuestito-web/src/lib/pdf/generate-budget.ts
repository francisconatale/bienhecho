import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Client, Job, Task } from "@/types";

interface PDFData {
  client: Client;
  job: Job;
  tasks: Task[];
  userProfile: {
    name: string;
    company?: string;
    address?: string;
    cuit?: string;
    trade?: string;
  };
}

export function generateBudgetPDF({ client, job, tasks, userProfile }: PDFData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  const primaryColor: [number, number, number] = [37, 99, 235];
  const secondaryColor: [number, number, number] = [100, 116, 139];

  // Header - Company
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text(userProfile.company || userProfile.name, margin, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.text(userProfile.trade || "Servicios Profesionales", margin, 37);

  // Header - Document title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("PRESUPUESTO", pageWidth - margin, 30, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, pageWidth - margin, 37, { align: "right" });

  // Divider
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(margin, 42, pageWidth - margin, 42);

  // From / To section
  let y = 55;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("DE", margin, y);

  doc.text("PARA", pageWidth / 2 + 10, y);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(userProfile.name, margin, y);
  doc.text(client.nombre, pageWidth / 2 + 10, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(userProfile.address || "Domicilio no especificado", margin, y);
  doc.text(client.email || "S/D", pageWidth / 2 + 10, y);

  y += 5;
  doc.text(`CUIT: ${userProfile.cuit || "Consumidor Final"}`, margin, y);
  if (client.direccion) {
    doc.text(client.direccion, pageWidth / 2 + 10, y);
  }

  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text(`Trabajo: ${job.titulo}`, pageWidth / 2 + 10, y);

  // Tasks table
  y += 15;

  const tableData = tasks.map((task) => [
    task.descripcion,
    `$ ${(task.precio ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Descripción", "Precio"]],
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
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 40, halign: "right" },
    },
  });

  // Total
  const total = tasks.reduce((acc, t) => acc + (t.precio ?? 0), 0);
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...primaryColor);
  doc.text("TOTAL", pageWidth - margin - 50, finalY);
  doc.text(
    `$ ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
    pageWidth - margin,
    finalY,
    { align: "right" }
  );

  // Notes
  if (job.descripcion) {
    const notesY = finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text("NOTAS", margin, notesY);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const splitNotes = doc.splitTextToSize(job.descripcion, pageWidth - margin * 2);
    doc.text(splitNotes, margin, notesY + 6);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Presupuestito", margin, footerY);

  // Download
  const fileName = `presupuesto-${client.nombre.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(fileName);
}
