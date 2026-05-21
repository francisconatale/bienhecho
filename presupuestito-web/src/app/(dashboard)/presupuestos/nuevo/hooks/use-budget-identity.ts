import { useState, useMemo } from "react";
import { useBudgetStore } from "./use-budget";
import { useDataStore } from "@/lib/store";

export function useBudgetIdentity() {
  const { clientId, jobId, setClient, setJob } = useBudgetStore();
  const { clients, jobs, addClient, addJob } = useDataStore();

  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isJobListOpen, setIsJobListOpen] = useState(false);
  
  const [clientSearch, setClientSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedJob = jobs.find((j) => j.id === jobId);

  const filteredClients = useMemo(() => {
    return clients.filter((c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const filteredJobs = useMemo(() => {
    // Solo mostramos trabajos del cliente seleccionado
    return jobs.filter((j) =>
      j.clientId === clientId &&
      j.name.toLowerCase().includes(jobSearch.toLowerCase())
    );
  }, [jobs, clientId, jobSearch]);

  const handleToggleClients = () => {
    setIsClientListOpen(!isClientListOpen);
    setIsJobListOpen(false);
  };

  const handleToggleJobs = () => {
    setIsJobListOpen(!isJobListOpen);
    setIsClientListOpen(false);
  };

  const handleSelectClient = (id: string) => {
    setClient(id);
    setIsClientListOpen(false);
  };

  const handleSelectJob = (id: string) => {
    setJob(id);
    setIsJobListOpen(false);
  };

  const openNewClientModal = () => setIsNewClientModalOpen(true);
  const closeNewClientModal = () => setIsNewClientModalOpen(false);
  
  const openNewJobModal = () => setIsNewJobModalOpen(true);
  const closeNewJobModal = () => setIsNewJobModalOpen(false);

  return {
    clientId,
    jobId,
    selectedClient,
    selectedJob,
    isClientListOpen,
    isJobListOpen,
    clientSearch,
    jobSearch,
    filteredClients,
    filteredJobs,
    isNewClientModalOpen,
    isNewJobModalOpen,
    setClientSearch,
    setJobSearch,
    handleToggleClients,
    handleToggleJobs,
    handleSelectClient,
    handleSelectJob,
    openNewClientModal,
    closeNewClientModal,
    openNewJobModal,
    closeNewJobModal,
  };
}
