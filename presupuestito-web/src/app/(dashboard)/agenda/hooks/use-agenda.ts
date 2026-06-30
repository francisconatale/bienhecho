import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitsService, jobsService, clientsService } from "@/services";
import { Visit, VisitStatus } from "@/types";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

export const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const STATUS_OPTIONS: { value: VisitStatus; label: string }[] = [
  { value: "planificada", label: "Planificada" },
  { value: "realizada", label: "Realizada" },
  { value: "cancelada", label: "Cancelada" },
];

export function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function useAgenda() {
  const queryClient = useQueryClient();
  const { data: visits = [], isLoading: isLoadingVisits } = useQuery({ queryKey: ["visits"], queryFn: visitsService.getAll });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService.getAll });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService.getAll });

  const addVisitMutation = useMutation({
    mutationFn: visitsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits"] }),
  });

  const updateVisitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => visitsService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits"] }),
  });

  const removeVisitMutation = useMutation({
    mutationFn: visitsService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["visits"] }),
  });

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [filterClient, setFilterClient] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<VisitStatus | "">("");

  const selectedDate = selectedDay ? formatDate(year, month, selectedDay) : null;

  const dayVisits = selectedDate
    ? visits
        .filter((v) => v.fecha === selectedDate)
        .filter((v) => {
          if (filterStatus && v.estado !== filterStatus) return false;
          if (filterClient) {
            const job = jobs.find((j) => j.id === v.trabajo_id);
            if (!job || job.cliente_id !== filterClient) return false;
          }
          return true;
        })
        .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    : [];

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(null);
  };

  const goToday = () => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelectedDay(d.getDate());
  };

  const visitCountForDay = (day: number) => {
    const date = formatDate(year, month, day);
    return visits.filter((v) => v.fecha === date).length;
  };

  const visitCountForDate = (y: number, m: number, d: number) => {
    const date = formatDate(y, m, d);
    return visits.filter((v) => v.fecha === date).length;
  };

  const getJobInfo = (trabajoId: string) => {
    const job = jobs.find((j) => j.id === trabajoId);
    if (!job) return { titulo: "—", cliente: "—", direccion: "" };
    const client = clients.find((c) => c.id === job.cliente_id);
    return {
      titulo: job.titulo,
      cliente: client?.nombre || "—",
      direccion: job.direccion,
    };
  };

  const [ConfirmDialog, confirm] = useConfirm();

  const handleDelete = (id: string) => {
    confirm({
      title: "Eliminar Visita",
      description: "¿Estás seguro de que querés eliminar esta visita de la agenda?",
      confirmText: "Eliminar",
      variant: "danger",
      action: async () => {
        await removeVisitMutation.mutateAsync(id);
        toast.success("Visita eliminada");
      }
    });
  };

  const handleStatusToggle = async (visit: Visit) => {
    const next: Record<VisitStatus, VisitStatus> = {
      planificada: "realizada",
      realizada: "cancelada",
      cancelada: "planificada",
    };
    await updateVisitMutation.mutateAsync({ id: visit.id, data: { estado: next[visit.estado] } });
  };

  const addVisit = async (data: Omit<Visit, "id" | "created_at">) => {
    return await addVisitMutation.mutateAsync(data);
  };

  const updateVisit = async (id: string, data: Partial<Visit>) => {
    await updateVisitMutation.mutateAsync({ id, data });
  };

  const removeVisit = async (id: string) => {
    await removeVisitMutation.mutateAsync(id);
  };

  return {
    state: {
      year,
      month,
      selectedDay,
      selectedDate,
      showNewModal,
      editingVisit,
      filterClient,
      filterStatus,
      dayVisits,
      jobs,
      clients,
    },
    actions: {
      setYear,
      setMonth,
      setSelectedDay,
      setShowNewModal,
      setEditingVisit,
      setFilterClient,
      setFilterStatus,
      prevMonth,
      nextMonth,
      goToday,
      visitCountForDay,
      visitCountForDate,
      getJobInfo,
      ConfirmDialog,
      handleDelete,
      handleStatusToggle,
      addVisit,
      updateVisit,
      removeVisit,
      selectDate: (y: number, m: number, d: number) => {
        setYear(y);
        setMonth(m);
        setSelectedDay(d);
      },
    },
    isLoading: isLoadingVisits || isLoadingJobs || isLoadingClients,
  };
}
