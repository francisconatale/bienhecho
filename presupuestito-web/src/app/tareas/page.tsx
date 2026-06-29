"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useTareas } from "./hooks/use-tareas";
import { TareasFilter } from "./components/tareas-filter";
import { TareasList } from "./components/tareas-list";
import { FinancialSummary } from "./components/financial-summary";
import { ClientAlerts } from "./components/client-alerts";
import { ShoppingList } from "./components/shopping-list";

type TabType = "tareas" | "compras";

export default function TareasPage() {
  const [activeTab, setActiveTab] = useState<TabType>("tareas");
  const {
    filter,
    setFilter,
    pendingCount,
    completedCount,
    groupedTasks,
    toggleTask,
  } = useTareas();

  return (
    <>
      <main className="flex-1 px-4 py-6 space-y-6 md:mt-10 pb-24 max-w-3xl mx-auto w-full transition-all">
        <PageHeader
          title="Centro de Operaciones"
          description="Seguimiento de tareas, materiales y finanzas."
        />

        <div className="flex gap-2 p-1 bg-surface/50 backdrop-blur-xl rounded-2xl border border-outline-variant/10">
          <button
            onClick={() => setActiveTab("tareas")}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "tareas"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface hover:bg-surface"
            }`}
          >
            Tareas
          </button>
          <button
            onClick={() => setActiveTab("compras")}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === "compras"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface hover:bg-surface"
            }`}
          >
            Lista de Compras
          </button>
        </div>

        {activeTab === "tareas" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FinancialSummary />
            <ClientAlerts />

            <TareasFilter
              filter={filter}
              setFilter={setFilter}
              pendingCount={pendingCount}
              completedCount={completedCount}
            />

            <TareasList
              groupedTasks={groupedTasks}
              filter={filter}
              onToggle={toggleTask}
            />
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ShoppingList />
          </div>
        )}
      </main>
    </>
  );
}
