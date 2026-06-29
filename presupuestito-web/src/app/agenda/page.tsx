"use client";

import { toast } from "sonner";

import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { useAgenda } from "./hooks/use-agenda";
import { AgendaCalendar } from "./components/agenda-calendar";
import { AgendaFilters } from "./components/agenda-filters";
import { VisitList } from "./components/visit-list";
import { VisitForm } from "./components/visit-form";
import { SmartSuggestions } from "./components/smart-suggestions";
import { StatsCards } from "./components/stats-cards";
import { useState } from "react";
import { SuccessModal } from "@/components/ui/success-modal";

export default function AgendaPage() {
  const { state, actions } = useAgenda();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  return (
    <main className="flex-1 pb-32 w-full pt-10 transition-all max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 xl:px-16">
      <PageHeader
        title="Agenda"
        description="Gestioná las visitas a obra."
        action={
          <button
            onClick={() => actions.setShowNewModal(true)}
            className="h-12 px-5 rounded-2xl bg-primary text-white font-bold text-sm inline-flex items-center gap-2 hover:bg-primary-dark active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Nueva Visita
          </button>
        }
      />

      {/* Stats */}
      <StatsCards dayVisits={state.dayVisits} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Calendar */}
        <div className="w-full lg:w-[480px] shrink-0">
          <AgendaCalendar
            year={state.year}
            month={state.month}
            selectedDay={state.selectedDay}
            onSelectDay={actions.setSelectedDay}
            onPrevMonth={actions.prevMonth}
            onNextMonth={actions.nextMonth}
            onGoToday={actions.goToday}
            visitCountForDay={actions.visitCountForDay}
            visitCountForDate={actions.visitCountForDate}
            onSelectDate={actions.selectDate}
          />

          <AgendaFilters
            clients={state.clients}
            filterClient={state.filterClient}
            setFilterClient={actions.setFilterClient}
            filterStatus={state.filterStatus}
            setFilterStatus={actions.setFilterStatus}
          />
        </div>

        {/* Right Column: Visits grouped by status */}
        <div className="flex-1 min-w-0">
          <VisitList
            selectedDate={state.selectedDate}
            selectedDay={state.selectedDay}
            month={state.month}
            year={state.year}
            dayVisits={state.dayVisits}
            getJobInfo={actions.getJobInfo}
            handleStatusToggle={actions.handleStatusToggle}
            setEditingVisit={actions.setEditingVisit}
            handleDelete={actions.handleDelete}
            setShowNewModal={actions.setShowNewModal}
          />
        </div>
      </div>

      {/* Suggestions — full width below layout */}
      <div className="mt-6">
        <SmartSuggestions />
      </div>

      {/* Modals */}
      <Modal
        isOpen={state.showNewModal}
        onClose={() => actions.setShowNewModal(false)}
        title="Nueva Visita"
      >
        <VisitForm
          jobs={state.jobs}
          clients={state.clients}
          defaultFecha={state.selectedDate || undefined}
          onSubmit={async (data) => {
            try {
              await actions.addVisit(data);
              actions.setShowNewModal(false);
              setShowSuccessModal(true);
            } catch (error) {
              toast.error("Error al crear la visita");
            }
          }}
          onCancel={() => actions.setShowNewModal(false)}
        />
      </Modal>

      <Modal
        isOpen={!!state.editingVisit}
        onClose={() => actions.setEditingVisit(null)}
        title="Editar Visita"
      >
        {state.editingVisit && (
          <VisitForm
            jobs={state.jobs}
            clients={state.clients}
            initial={state.editingVisit}
            onSubmit={async (data) => {
              try {
                await actions.updateVisit(state.editingVisit!.id, data);
                toast.success("Visita actualizada");
                actions.setEditingVisit(null);
              } catch (error) {
                toast.error("Error al actualizar la visita");
              }
            }}
            onCancel={() => actions.setEditingVisit(null)}
          />
        )}
      </Modal>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Visita Programada!"
        description="La visita se agregó a la agenda correctamente. Recordá que podés editarla o marcarla como completada más adelante."
        primaryButtonText="Cerrar"
      />
      <actions.ConfirmDialog />
    </main>
  );
}
