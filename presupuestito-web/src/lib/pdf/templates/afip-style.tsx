import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Client, Job, Budget, Concept } from "@/types";

/**
 * Professional Budget Template
 * Focus: Clarity, Modern Typography, and Hierarchy
 * Style: Clean SaaS (Stripe/Harvest inspired)
 */

const primaryColor = "#2563EB";
const secondaryColor = "#64748B";
const borderColor = "#E2E8F0";
const bgShade = "#F8FAFC";

const styles = StyleSheet.create({
  page: {
    padding: "20mm",
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1E293B",
    lineHeight: 1.5,
  },
  
  // Header Section
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    borderBottom: `2pt solid ${primaryColor}`,
    paddingBottom: 20,
  },
  brandContainer: {
    flexDirection: "column",
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    color: primaryColor,
    letterSpacing: -0.5,
  },
  brandSlogan: {
    fontSize: 9,
    color: secondaryColor,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  docInfo: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  docNumber: {
    fontSize: 10,
    color: secondaryColor,
  },

  // Info Grid (From / To)
  infoGrid: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 40,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: secondaryColor,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    borderBottom: `1pt solid ${borderColor}`,
    paddingBottom: 4,
  },
  infoName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  infoDetail: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
  },

  // Table Section
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: bgShade,
    borderBottom: `1pt solid ${borderColor}`,
    borderTop: `1pt solid ${borderColor}`,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1pt solid ${borderColor}`,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: "#FFFFFF",
  },
  tableCell: {
    fontSize: 9,
    color: "#1E293B",
  },
  
  // Columns
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "center" },
  colUnit: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right", fontWeight: "bold" },

  // Summary Section
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  summaryBox: {
    width: "40%",
    backgroundColor: bgShade,
    borderRadius: 8,
    padding: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 9,
    color: secondaryColor,
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1E293B",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTop: `1pt solid ${borderColor}`,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: primaryColor,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: primaryColor,
  },

  // Notes & Footer
  notesSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: `1pt dashed ${borderColor}`,
  },
  notesLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: secondaryColor,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 9,
    color: "#64748B",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1pt solid ${borderColor}`,
    paddingTop: 10,
    fontSize: 8,
    color: secondaryColor,
  },
});

interface BudgetPDFProps {
  budget: Partial<Budget>;
  client: Client;
  job?: Job;
  concepts: Concept[];
  userProfile: {
    name: string;
    company?: string;
    address?: string;
    cuit?: string;
    trade?: string;
  };
}

export const BudgetPDF = ({ budget, client, job, concepts, userProfile }: BudgetPDFProps) => {
  const dateStr = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  
  const subtotal = concepts.reduce((acc, c) => {
    const price = parseFloat(c.price.replace(/\./g, "").replace(",", "."));
    return acc + (price * c.quantity);
  }, 0);
  
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const formatCurrency = (num: number) => 
    num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Document title={`Presupuesto - ${client.name}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>{userProfile.company || userProfile.name}</Text>
            <Text style={styles.brandSlogan}>{userProfile.trade || "Servicios Profesionales"}</Text>
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>PRESUPUESTO</Text>
            <Text style={styles.docNumber}>N° 0001-00000001</Text>
            <Text style={[styles.docNumber, { marginTop: 4 }]}>{dateStr}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>De</Text>
            <Text style={styles.infoName}>{userProfile.name}</Text>
            <Text style={styles.infoDetail}>{userProfile.address || "Domicilio no especificado"}</Text>
            <Text style={styles.infoDetail}>CUIT: {userProfile.cuit || "Consumidor Final"}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Para</Text>
            <Text style={styles.infoName}>{client.name}</Text>
            <Text style={styles.infoDetail}>{client.email || "S/D"}</Text>
            <Text style={[styles.infoDetail, { marginTop: 4, fontWeight: "bold" }]}>
              Trabajo: {job?.name || "General"}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Cant.</Text>
            <Text style={[styles.tableHeaderText, styles.colUnit]}>U.M.</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Unitario</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
          </View>

          {concepts.map((concept, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowEven : {}]}>
              <View style={styles.colDesc}>
                <Text style={styles.tableCell}>{concept.name}</Text>
                {concept.description ? (
                  <Text style={{ fontSize: 7, color: secondaryColor, marginTop: 2 }}>{concept.description}</Text>
                ) : null}
              </View>
              <Text style={[styles.tableCell, styles.colQty]}>{concept.quantity}</Text>
              <Text style={[styles.tableCell, styles.colUnit]}>{concept.unit}</Text>
              <Text style={[styles.tableCell, styles.colPrice]}>$ {concept.price}</Text>
              <Text style={[styles.tableCell, styles.colTotal]}>$ {concept.amount}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$ {formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA (21%)</Text>
              <Text style={styles.summaryValue}>$ {formatCurrency(iva)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>$ {formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notas Adicionales</Text>
          <Text style={styles.notesText}>
            Este presupuesto tiene una validez de 15 días corridos a partir de la fecha de emisión. 
            Los precios están sujetos a cambios según disponibilidad de materiales.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generado con Presupuestito - www.presupuestito.com</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};
