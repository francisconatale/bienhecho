import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Client, Job, Budget } from "@/types";
import { Concept } from "@/app/(dashboard)/presupuestos/nuevo/hooks/use-budget";

// Helvetica is built-in, so we don't need to register external files for basic usage
// but we'll set up the styles to match the ReportLab proportions

const styles = StyleSheet.create({
  page: {
    padding: "15mm",
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#000",
  },
  headerOriginal: {
    border: "0.5pt solid black",
    textAlign: "center",
    paddingVertical: 2,
    marginBottom: "4mm",
  },
  headerOriginalText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  topBlock: {
    flexDirection: "row",
    border: "0.5pt solid black",
    height: "30mm",
  },
  issuerColumn: {
    width: "42%",
    padding: "3mm",
    borderRight: "0.5pt solid black",
  },
  infoColumn: {
    flex: 1,
    padding: "3mm",
    alignItems: "center",
  },
  centralSquare: {
    position: "absolute",
    left: "42%",
    marginLeft: "-7mm",
    top: "4mm",
    width: "14mm",
    height: "14mm",
    border: "0.5pt solid black",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  centralLetter: {
    fontSize: 22,
    fontWeight: "bold",
  },
  centralCode: {
    fontSize: 6,
  },
  fieldLabel: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  periodBlock: {
    flexDirection: "row",
    border: "0.5pt solid black",
    borderTopWidth: 0,
    padding: "2mm 3mm",
    justifyContent: "space-between",
  },
  buyerBlock: {
    marginTop: "4mm",
    border: "0.5pt solid black",
    height: "20mm",
  },
  buyerRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid black",
    height: "7mm",
    alignItems: "center",
    paddingHorizontal: "3mm",
  },
  buyerBottomRow: {
    flexDirection: "row",
    height: "13mm",
    padding: "3mm",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    border: "0.5pt solid black",
    marginTop: "4mm",
    height: "7mm",
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderHorizontal: "0.5pt solid black",
    borderBottom: "0.5pt solid black",
    height: "7mm",
    alignItems: "center",
  },
  column: {
    borderRight: "0.5pt solid black",
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  colCode: { width: "14mm" },
  colDesc: { flex: 1 },
  colQty: { width: "15mm", textAlign: "center" },
  colUnit: { width: "15mm", textAlign: "center" },
  colPrice: { width: "20mm", textAlign: "right" },
  colTotal: { width: "20mm", textAlign: "right", borderRightWidth: 0 },
  
  itemsArea: {
    borderHorizontal: "0.5pt solid black",
    borderBottom: "0.5pt solid black",
    height: "90mm", // Spacing for empty area
  },
  totalsBlock: {
    marginTop: 0,
    border: "0.5pt solid black",
    borderTopWidth: 0,
    padding: "4mm",
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  footer: {
    marginTop: "4mm",
    border: "0.5pt solid black",
    height: "12mm",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "3mm",
    justifyContent: "space-between",
  },
  afipSim: {
    width: "20mm",
    height: "8mm",
    border: "0.5pt solid black",
    justifyContent: "center",
    alignItems: "center",
  }
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
  const dateStr = new Date().toLocaleDateString("es-AR");
  
  const subtotal = concepts.reduce((acc, c) => {
    const price = parseFloat(c.price.replace(".", "").replace(",", "."));
    return acc + (price * c.quantity);
  }, 0);
  
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const formatCurrency = (num: number) => 
    num.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Document title={`Presupuesto - ${client.name}`}>
      <Page size="A4" style={styles.page}>
        {/* Título Original */}
        <View style={styles.headerOriginal}>
          <Text style={styles.headerOriginalText}>Presupuesto</Text>
        </View>

        {/* Bloque Superior */}
        <View style={styles.topBlock}>
          {/* Central Square "P" for Presupuesto (instead of C) */}
          <View style={styles.centralSquare}>
            <Text style={styles.centralLetter}>P</Text>
            <Text style={styles.centralCode}>DOC. NO VALIDO COMO FACTURA</Text>
          </View>

          <View style={styles.issuerColumn}>
            <Text style={[styles.fieldLabel, { fontSize: 10 }]}>{userProfile.company || userProfile.name}</Text>
            <Text style={{ marginTop: 4 }}>Razon Social: {userProfile.name}</Text>
            <Text>Domicilio: {userProfile.address || "S/D"}</Text>
            <Text style={{ marginTop: 4 }}>Condición IVA: Responsable Monotributo</Text>
          </View>

          <View style={styles.infoColumn}>
            <Text style={styles.invoiceTitle}>PRESUPUESTO</Text>
            <View style={{ width: "100%", paddingLeft: 20 }}>
              <Text>Nro: 0001 - 00000001</Text>
              <Text>Fecha: {dateStr}</Text>
              <Text>CUIT: {userProfile.cuit || "00-00000000-0"}</Text>
              <Text>Ingresos Brutos: {userProfile.cuit || "Exento"}</Text>
              <Text>Inicio de Actividades: 01/01/2024</Text>
            </View>
          </View>
        </View>

        {/* Bloque Comprador */}
        <View style={styles.buyerBlock}>
          <View style={styles.buyerRow}>
            <Text style={{ width: "50%" }}>CUIT: 00-00000000-0</Text>
            <Text>Cliente: {client.name}</Text>
          </View>
          <View style={styles.buyerBottomRow}>
            <View style={{ width: "50%" }}>
              <Text>Condición IVA: Consumidor Final</Text>
              <Text style={{ marginTop: 4 }}>Condición de venta: Contado</Text>
            </View>
            <View>
              <Text>Domicilio: {client.email || "S/D"}</Text>
              <Text style={{ marginTop: 4 }}>Trabajo: {job?.name || "General"}</Text>
            </View>
          </View>
        </View>

        {/* Tabla de Items */}
        <View style={styles.tableHeader}>
          <View style={[styles.column, styles.colCode]}><Text style={{ fontWeight: "bold" }}>Cant.</Text></View>
          <View style={[styles.column, styles.colDesc]}><Text style={{ fontWeight: "bold" }}>Producto / Servicio</Text></View>
          <View style={[styles.column, styles.colUnit]}><Text style={{ fontWeight: "bold" }}>U. Medida</Text></View>
          <View style={[styles.column, styles.colPrice]}><Text style={{ fontWeight: "bold" }}>Precio Unit.</Text></View>
          <View style={[styles.column, styles.colTotal]}><Text style={{ fontWeight: "bold" }}>Subtotal</Text></View>
        </View>

        {concepts.map((concept, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={[styles.column, styles.colCode]}><Text>{concept.quantity.toFixed(2)}</Text></View>
            <View style={[styles.column, styles.colDesc]}><Text>{concept.name}</Text></View>
            <View style={[styles.column, styles.colUnit]}><Text>{concept.unit}</Text></View>
            <View style={[styles.column, styles.colPrice]}><Text>{concept.price}</Text></View>
            <View style={[styles.column, styles.colTotal]}><Text>{concept.amount}</Text></View>
          </View>
        ))}

        {/* Espacio vacío para completar la hoja si hay pocos items */}
        <View style={[styles.itemsArea, { height: Math.max(0, 100 - concepts.length * 7) + "mm" }]} />

        {/* Bloque Totales */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>Subtotal: $ </Text>
            <Text style={{ width: "30mm", textAlign: "right" }}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={{ fontWeight: "bold" }}>IVA (21%): $ </Text>
            <Text style={{ width: "30mm", textAlign: "right" }}>{formatCurrency(iva)}</Text>
          </View>
          <View style={[styles.totalRow, { marginTop: 4 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>Importe Total: $ </Text>
            <Text style={{ width: "30mm", textAlign: "right", fontSize: 10, fontWeight: "bold" }}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Pie */}
        <View style={styles.footer}>
          <View style={styles.afipSim}>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>PRESUPUESTITO</Text>
          </View>
          <Text>Pág. 1/1</Text>
          <Text style={{ fontSize: 6, width: "40mm", textAlign: "right" }}>
            Documento generado digitalmente por Presupuestito. 
            No válido como factura fiscal.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
