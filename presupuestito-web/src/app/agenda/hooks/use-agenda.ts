import { useState } from "react";
import { useDataStore } from "@/lib/store";
import { Visit, VisitStatus } from "@/types";

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
  const {
    visits,
    jobs,
    clients,
    addVisit,
    updateVisit,
    removeVisit,
  } = useDataStore();

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

  const handleDelete = (id: string) => {
    if (window.confirm("¿Eliminar esta visita?")) {
      removeVisit(id);
    }
  };

  const handleStatusToggle = (visit: Visit) => {
    const next: Record<VisitStatus, VisitStatus> = {
      planificada: "realizada",
      realizada: "cancelada",
      cancelada: "planificada",
    };
    updateVisit(visit.id, { estado: next[visit.estado] });
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
      getJobInfo,
      handleDelete,
      handleStatusToggle,
      addVisit,
      updateVisit,
      removeVisit,
    },
  };
}
