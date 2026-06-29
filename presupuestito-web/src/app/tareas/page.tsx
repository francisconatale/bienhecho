"use client";

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
      <main className="flex-1 px-4 py-6 space-y-6 md:mt-10 pb-24 max-w-3xl mx-auto w-full transition-all">
        <PageHeader
          title="Tareas"
          description="Seguimiento de tareas de todos tus trabajos."
        />

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
