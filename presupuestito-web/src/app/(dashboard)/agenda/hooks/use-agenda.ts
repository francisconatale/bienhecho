import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { visitsService_getByRange, visitsService_create, visitsService_update, visitsService_delete } from "@/actions/visits.actions";
import { jobsService_getAll } from "@/actions/jobs.actions";
import { clientsService_getAll } from "@/actions/clients.actions";
import { Visit, VisitStatus } from "@/types";
import { VisitWithJob } from "@/services/visits.service";
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

export interface AgendaInitialData {
  visits?: VisitWithJob[];
  jobs?: any[];
  clients?: any[];
}

export function useAgenda(initialData?: AgendaInitialData) {
  const queryClient = useQueryClient();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [pendingVisitId, setPendingVisitId] = useState<string | null>(null);

  const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month + 1).padStart(2, "0")}-${String(new Date(year, month + 1, 0).getDate()).padStart(2, "0")}`;

  const { data: visits = [], isLoading: isLoadingVisits } = useQuery({
    queryKey: ["visits", year, month],
    queryFn: () => visitsService_getByRange(monthStart, monthEnd),
    initialData: initialData?.visits,
  });
  const { data: jobs = [], isLoading: isLoadingJobs } = useQuery({ queryKey: ["jobs"], queryFn: jobsService_getAll, initialData: initialData?.jobs });
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({ queryKey: ["clients"], queryFn: clientsService_getAll, initialData: initialData?.clients });

  const addVisitMutation = useMutation({
    mutationFn: visitsService_create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["smart-suggestions"] });
    },
  });

  const updateVisitMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => visitsService_update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["smart-suggestions"] });
    },
  });

  const removeVisitMutation = useMutation({
    mutationFn: visitsService_delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["smart-suggestions"] });
    },
  });

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
          if (filterClient && v.job?.cliente_id !== filterClient) return false;
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

  const getJobInfo = (visit: VisitWithJob) => ({
    titulo: visit.job?.titulo || "—",
    cliente: visit.job?.clientes?.nombre || "—",
    direccion: visit.job?.direccion || "",
  });

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
    setPendingVisitId(visit.id);
    try {
      await updateVisitMutation.mutateAsync({ id: visit.id, data: { estado: next[visit.estado] } });
    } finally {
      setPendingVisitId(null);
    }
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
      pendingVisitId,
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
