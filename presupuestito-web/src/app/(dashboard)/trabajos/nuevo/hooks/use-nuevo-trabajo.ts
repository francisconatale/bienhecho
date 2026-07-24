import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/clients.service";
import { jobsService } from "@/services/jobs.service";;
import { toast } from "sonner";
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
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: jobsService.create,
    onSuccess: (newJob) => {
      queryClient.setQueryData(["jobs"], (old: any) => old ? [newJob, ...old] : [newJob]);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

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

  const handleSave = async () => {
    if (!canSave) return;
    try {
      const newJob = await createMutation.mutateAsync({
        cliente_id: clienteId,
        titulo: titulo.trim(),
        direccion: direccion.trim(),
        descripcion: descripcion.trim() || undefined,
        presupuesto: presupuesto ? Number(presupuesto) : 0,
        estado: "borrador",
        fecha_inicio: fechaInicio || undefined,
        fecha_fin_estimada: fechaFinEstimada || undefined,
      });
      toast.success("Proyecto creado correctamente");
      router.push(`/trabajos/${newJob.id}`);
    } catch (error) {
      toast.error("Error al crear el proyecto");
    }
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
      isLoading: isLoadingClients || createMutation.isPending,
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
