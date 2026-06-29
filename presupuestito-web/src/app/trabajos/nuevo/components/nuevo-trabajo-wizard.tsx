"use client";

import { useNuevoTrabajo, questions } from "../hooks/use-nuevo-trabajo";
import { WizardProgress } from "./wizard-progress";
import { WizardNavigation } from "./wizard-navigation";
import { StepCliente } from "./step-cliente";
import { StepTitulo } from "./step-titulo";
import { StepDireccion } from "./step-direccion";
import { StepPresupuesto } from "./step-presupuesto";
import { StepFechas } from "./step-fechas";
import { StepResumen } from "./step-resumen";

export function NuevoTrabajoWizard() {
  const { state, actions } = useNuevoTrabajo();
  const { currentQ, question, isLast, canSave, canAdvance } = state;
  const { prev, next, handleSave } = actions;

  return (
    <div className="bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-outline-variant/20 shadow-sm">
      <WizardProgress currentQ={currentQ} />

      <div className="min-h-[260px] flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
            Paso {currentQ + 1} de {questions.length}
          </span>
        </div>

        <h2 className="text-lg font-bold tracking-tight text-on-surface mb-1">
          {question.question}
        </h2>
        <p className="text-sm text-on-surface-variant/50 mb-5">
          {question.hint}
        </p>

        <div className="flex-1 space-y-3">
          {currentQ === 0 && (
            <StepCliente
              clients={state.clients}
              clienteId={state.clienteId}
              setClienteId={actions.setClienteId}
            />
          )}

          {currentQ === 1 && (
            <StepTitulo
              titulo={state.titulo}
              setTitulo={actions.setTitulo}
              descripcion={state.descripcion}
              setDescripcion={actions.setDescripcion}
            />
          )}

          {currentQ === 2 && (
            <StepDireccion
              direccion={state.direccion}
              setDireccion={actions.setDireccion}
            />
          )}

          {currentQ === 3 && (
            <StepPresupuesto
              presupuesto={state.presupuesto}
              setPresupuesto={actions.setPresupuesto}
            />
          )}

          {currentQ === 4 && (
            <StepFechas
              fechaInicio={state.fechaInicio}
              setFechaInicio={actions.setFechaInicio}
              fechaFinEstimada={state.fechaFinEstimada}
              setFechaFinEstimada={actions.setFechaFinEstimada}
            />
          )}

          {currentQ === 5 && (
            <StepResumen state={state} />
          )}
        </div>
      </div>

      <WizardNavigation
        currentQ={currentQ}
        isLast={isLast}
        canAdvance={canAdvance}
        canSave={canSave}
        prev={prev}
        next={next}
        handleSave={handleSave}
      />
    </div>
  );
}
