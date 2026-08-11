"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

export function PaginationButtons({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationButtonsProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const btnBase =
    "flex items-center justify-center min-w-[36px] h-9 px-3 rounded-[12px] text-[11px] font-bold transition-all duration-200 select-none";

  return (
    <div className={cn("flex flex-col items-center gap-3 pt-6", className)}>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            btnBase,
            "gap-1 px-3.5",
            currentPage === 1
              ? "text-on-surface-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-95"
          )}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline text-[11px]">Anterior</span>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-[30px] h-9 text-[11px] font-bold text-on-surface-variant/40 select-none"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  btnBase,
                  page === currentPage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-95"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            btnBase,
            "gap-1 px-3.5",
            currentPage === totalPages
              ? "text-on-surface-variant/30 cursor-not-allowed"
              : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface active:scale-95"
          )}
        >
          <span className="hidden sm:inline text-[11px]">Siguiente</span>
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <span className="text-[11px] font-medium text-on-surface-variant/50">
        Mostrando {startItem}–{endItem} de {totalItems} resultados
      </span>
    </div>
  );
}
