import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store";

export const questions = [
  { id: "cliente", question: "¿Para qué cliente es este trabajo?", hint: "Seleccioná un cliente existente" },
  { id: "titulo", question: "¿Cómo se llama el trabajo?", hint: "Dale un nombre descriptivo" },
  { id: "direccion", question: "¿Dónde se realiza?", hint: "Dirección del trabajo (opcional)" },
  { id: "presupuesto", question: "¿Cuál es el presupuesto?", hint: "Monto total estimado" },
  { id: "fechas", question: "¿Cuándo arranca y termina?", hint: "Fechas estimadas (opcional)" },
  { id: "resumen", question: "Revisá los datos antes de crear", hint: "Todo en orden?" },
];

export function useNuevoTrabajo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clients, addJob } = useDataStore();

  const preselectId = searchParams.get("clienteId");
  const [currentQ, setCurrentQ] = useState(preselectId ? 1 : 0);
  const [clienteId, setClienteId] = useState(preselectId || "");
  const [titulo, setTitulo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinEstimada, setFechaFinEstimada] = useState("");

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const canSave = clienteId !== "" && titulo.trim() !== "";

  const canAdvance = () => {
    if (currentQ === 0) return clienteId !== "";
    if (currentQ === 1) return titulo.trim() !== "";
    return true;
  };

  const next = () => {
    if (currentQ < questions.length - 1) setCurrentQ((q) => q + 1);
  };

  const prev = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  };

  const handleSave = () => {
    if (!canSave) return;
    const newJob = addJob({
      cliente_id: clienteId,
      titulo: titulo.trim(),
      direccion: direccion.trim(),
      descripcion: descripcion.trim() || undefined,
      presupuesto: presupuesto ? Number(presupuesto) : 0,
      fecha_inicio: fechaInicio || undefined,
      fecha_fin_estimada: fechaFinEstimada || undefined,
    });
    router.push(`/trabajos/${newJob.id}`);
  };

  return {
    state: {
      preselectId,
      currentQ,
      clienteId,
      titulo,
      direccion,
      descripcion,
      presupuesto,
      fechaInicio,
      fechaFinEstimada,
      question,
      isLast,
      canSave,
      canAdvance,
      clients,
    },
    actions: {
      setClienteId,
      setTitulo,
      setDireccion,
      setDescripcion,
      setPresupuesto,
      setFechaInicio,
      setFechaFinEstimada,
      next,
      prev,
      handleSave,
    },
  };
}
