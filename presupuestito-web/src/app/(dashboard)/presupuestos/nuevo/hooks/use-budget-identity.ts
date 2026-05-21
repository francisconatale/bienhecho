import { useState } from "react";
import { useBudgetStore } from "./use-budget";
import { useDataStore } from "@/lib/store";

export function useBudgetIdentity() {
  const { clientId, projectId, setClient, setProject } = useBudgetStore();
  const { clients, projects } = useDataStore();

  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedProject = projects.find((p) => p.id === projectId);
  
  const clientProjects = projects.filter((p) => p.clientId === clientId);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || 
    c.email?.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredProjects = clientProjects.filter(p => 
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const handleToggleClients = () => {
    setIsProjectListOpen(false);
    setIsClientListOpen(!isClientListOpen);
    setClientSearch("");
  };

  const handleToggleProjects = () => {
    setIsClientListOpen(false);
    setIsProjectListOpen(!isProjectListOpen);
    setProjectSearch("");
  };

  const handleSelectClient = (id: string) => {
    setClient(id);
    setIsClientListOpen(false);
  };

  const handleSelectProject = (id: string) => {
    setProject(id);
    setIsProjectListOpen(false);
  };

  const openNewClientModal = () => setIsNewClientModalOpen(true);
  const closeNewClientModal = () => setIsNewClientModalOpen(false);
  
  const openNewProjectModal = () => setIsNewProjectModalOpen(true);
  const closeNewProjectModal = () => setIsNewProjectModalOpen(false);

  return {
    // Data
    clientId,
    projectId,
    selectedClient,
    selectedProject,
    filteredClients,
    filteredProjects,
    
    // UI State
    isClientListOpen,
    isProjectListOpen,
    isNewClientModalOpen,
    isNewProjectModalOpen,
    clientSearch,
    projectSearch,
    
    // Actions
    setClientSearch,
    setProjectSearch,
    handleToggleClients,
    handleToggleProjects,
    handleSelectClient,
    handleSelectProject,
    openNewClientModal,
    closeNewClientModal,
    openNewProjectModal,
    closeNewProjectModal,
  };
}
