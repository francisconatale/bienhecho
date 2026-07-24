"use client";

import type { ReactNode } from "react";
import type { UsePaginationResult } from "@/hooks/use-pagination";
import { PaginationButtons } from "@/components/ui/pagination-buttons";

export interface Column<T> {
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  items: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  pagination?: UsePaginationResult<T>;
  title?: string;
  actions?: ReactNode;
  emptyMessage?: string;
  topContent?: ReactNode;
  footerRow?: ReactNode;
  renderRow?: (item: T) => ReactNode;
  rowLabel?: (item: T) => string;
}

export function DataTable<T>({
  columns,
  items,
  keyExtractor,
  onRowClick,
  pagination,
  title,
  actions,
  emptyMessage = "No hay datos.",
  topContent,
  footerRow,
  renderRow,
  rowLabel,
}: DataTableProps<T>) {
  return (
    <div className="bg-surface/80 dark:bg-surface/50 backdrop-blur-sm rounded-xl overflow-hidden border border-outline-variant/15 shadow-sm">
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-outline-variant/10 bg-surface-container-low/50 dark:bg-surface-container-low/30">
          {title && (
            <h2 className="text-[13px] font-bold text-on-surface-variant uppercase tracking-widest">
              {title}
            </h2>
          )}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      {topContent}

      <div className="overflow-x-auto w-full">
        <table className="w-full">
          {title && <caption className="sr-only">{title}</caption>}
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-outline-variant/20 bg-surface-variant/20">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={[
                    "text-[11px] font-bold text-on-surface-variant uppercase tracking-widest px-4 py-2 text-left",
                    col.headerClassName,
                  ].filter(Boolean).join(" ")}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/10">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-5 text-[13px] text-on-surface-variant/60 text-center italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : renderRow ? (
              items.map((item) => (
                <tr key={keyExtractor(item)} className="group">
                  <td colSpan={columns.length} className="p-0">
                    {renderRow(item)}
                  </td>
                </tr>
              ))
            ) : (
              items.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className={[
                    "group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-xl",
                    onRowClick && "cursor-pointer hover:bg-primary/5",
                  ].filter(Boolean).join(" ")}
                  {...(onRowClick
                    ? {
                        onClick: () => onRowClick(item),
                        onKeyDown: (e: React.KeyboardEvent) =>
                          e.key === "Enter" && onRowClick(item),
                        tabIndex: 0,
                        role: "button",
                        "aria-label": rowLabel ? `Ver detalle de ${rowLabel(item)}` : undefined,
                      }
                    : {})}
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={["px-4 py-2.5 md:py-3", col.className].filter(Boolean).join(" ")}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
            {footerRow && (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  {footerRow}
                </td>
              </tr>
            )}
          </tbody>

          {pagination && (
            <tfoot>
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-3 border-t border-outline-variant/10"
                >
                  <PaginationButtons
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={pagination.goToPage}
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
