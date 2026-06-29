"use client";

import { Header } from "@/components/layout/header";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationButtons } from "@/components/ui/pagination-buttons";
import { useTareas } from "./hooks/use-tareas";
import { TareasFilter } from "./components/tareas-filter";
import { TareasList } from "./components/tareas-list";

export default function TareasPage() {
  const {
    filter,
    setFilter,
    pendingCount,
    completedCount,
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    goToPage,
    toggleTask,
  } = useTareas();

  return (
    <>
      <div className="md:hidden">
        <Header title="Tareas" />
      </div>
      <main className="flex-1 px-4 py-6 space-y-6 mt-20 md:mt-10 pb-24 max-w-3xl mx-auto w-full">
        <div className="md:hidden">
          <PageHeader
            title="Tareas"
            description="Seguimiento de tareas de todos tus trabajos."
          />
        </div>
        
        <div className="hidden md:block">
          <h1 className="text-3xl font-bold text-on-surface">Tareas</h1>
          <p className="text-on-surface-variant/60 mt-1">
            Seguimiento de tareas de todos tus trabajos.
          </p>
        </div>

        <TareasFilter
          filter={filter}
          setFilter={setFilter}
          pendingCount={pendingCount}
          completedCount={completedCount}
        />

        <TareasList
          items={paginatedItems}
          filter={filter}
          onToggle={toggleTask}
        />

        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={goToPage}
        />
      </main>
    </>
  );
}
