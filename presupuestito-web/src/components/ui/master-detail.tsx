"use client";

import { ReactNode } from "react";
import { Search, Plus, ChevronsRight } from "lucide-react";
import { UsePaginationResult } from "@/hooks/use-pagination";
import { PaginationButtons } from "./pagination-buttons";
import Link from "next/link";

export interface MasterDetailProps<T> {
  selectedId: string | null;
  onSelectedChange: (id: string | null) => void;

  items: T[];
  getItemId: (item: T) => string;

  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;

  countLabel: string;

  mobileTitle: string;
  mobileDescription?: string;

  renderItem: (item: T, isSelected: boolean) => ReactNode;
  renderRailItem: (item: T, isActive: boolean) => ReactNode;
  renderDetail: (item: T) => ReactNode;
  emptyDetail: ReactNode;

  pagination: UsePaginationResult<T>;
  showCreationForm?: boolean;
  onToggleCreation?: () => void;
  creationHref?: string;
  renderCreationForm?: () => ReactNode;
}

export function MasterDetail<T>({
  selectedId,
  onSelectedChange,
  items,
  getItemId,
  search,
  onSearchChange,
  searchPlaceholder,
  countLabel,
  renderItem,
  renderRailItem,
  renderDetail,
  emptyDetail,
  pagination,
  mobileTitle,
  mobileDescription,
  showCreationForm = false,
  onToggleCreation,
  creationHref,
  renderCreationForm,
}: MasterDetailProps<T>) {
  const hasDetail = selectedId || showCreationForm;

  return (
    <>
      {/* Mobile PageHeader — hide when detail is active */}
      <div className={`${hasDetail ? "hidden" : "block"} md:hidden pt-8 pb-2 px-4 relative z-10`}>
        <div>
          <h1 className="text-xl font-black text-on-surface tracking-tight">{mobileTitle}</h1>
          {mobileDescription && <p className="text-xs text-on-surface-variant mt-0.5">{mobileDescription}</p>}
        </div>
      </div>

      {/* HEADER */}
      <div className={`${hasDetail ? "hidden md:block" : "block"} px-4 md:px-5 py-3 bg-surface/30 dark:bg-surface/10 backdrop-blur-md md:bg-background border-b border-outline-variant/10 relative z-10`}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-outline pointer-events-none" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-grouped-bg-light rounded-lg pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20 border-0"
            />
          </div>
          {creationHref ? (
            <Link
              href={creationHref}
              className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            </Link>
          ) : onToggleCreation ? (
            <button
              onClick={onToggleCreation}
              className={`h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                showCreationForm
                  ? "bg-outline-variant/15 text-on-surface"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {showCreationForm ? (
                <span className="text-lg md:text-xl leading-none">&times;</span>
              ) : (
                <Plus className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* MASTER-DETAIL GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] min-h-0">

        {/* LIST PANE */}
        <div
          className={`${
            selectedId && !showCreationForm ? "hidden md:flex" : "flex"
          } flex-col border-r border-outline-variant/10 bg-transparent relative z-10 md:bg-surface`}
        >
          <div className="px-4 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/6 bg-surface/50 backdrop-blur-xl md:bg-transparent">
            <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              {pagination.totalItems} {countLabel}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-4 md:px-0 py-4 md:py-0 space-y-3 md:space-y-0">
            {pagination.paginatedItems.length > 0 ? (
              pagination.paginatedItems.map((item) => (
                <div key={getItemId(item)}>
                  {renderItem(item, selectedId === getItemId(item))}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-on-surface-variant">
                <p className="text-xs md:text-sm">Sin resultados</p>
              </div>
            )}
          </div>
          <PaginationButtons
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={pagination.goToPage}
            className="px-4 md:px-5 pb-4 pt-2 md:pt-0"
          />
        </div>

        {/* DETAIL PANE */}
        <div
          className={`${
            hasDetail ? "flex" : "hidden md:flex"
          } flex-col bg-grouped-bg-light min-w-0 transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${hasDetail ? "md:opacity-100" : "md:opacity-0"}`}
        >
          {showCreationForm && renderCreationForm ? (
            renderCreationForm()
          ) : selectedId ? (
            <div className="flex-1 flex flex-col">
              <div className="md:hidden px-5 py-3 border-b border-outline-variant/8 bg-surface flex items-center gap-2.5">
                <button
                  onClick={() => onSelectedChange(null)}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-lg hover:bg-outline-variant/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="text-on-surface-variant text-lg">&larr;</span>
                </button>
                <h2 className="text-sm md:text-lg font-bold text-on-surface">Detalle</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {renderDetail(
                  items.find((i) => getItemId(i) === selectedId) as T
                )}
              </div>
            </div>
          ) : (
            emptyDetail
          )}
        </div>
      </div>
    </>
  );
}
