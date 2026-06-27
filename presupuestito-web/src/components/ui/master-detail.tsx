"use client";

import { ReactNode, useState, useEffect } from "react";
import { Search, Plus, ChevronsRight, ChevronsLeft, ChevronLeft } from "lucide-react";
import { UsePaginationResult } from "@/hooks/use-pagination";
import { PaginationButtons } from "./pagination-buttons";
import { Header } from "@/components/layout/header";
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

  /** Title shown in the mobile detail Header */
  detailTitle?: (item: T) => string;
  /** Right action slot in the mobile detail Header */
  detailRightAction?: (item: T) => ReactNode;

  renderItem: (item: T, isSelected: boolean) => ReactNode;
  renderRailItem: (item: T, isActive: boolean) => ReactNode;
  renderDetail: (item: T) => ReactNode;
  emptyDetail: ReactNode;

  pagination: UsePaginationResult<T>;
  showCreationForm?: boolean;
  onToggleCreation?: () => void;
  creationHref?: string;
  renderCreationForm?: () => ReactNode;

  emptyState?: ReactNode;
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
  detailTitle,
  detailRightAction,
  showCreationForm = false,
  onToggleCreation,
  creationHref,
  renderCreationForm,
  emptyState,
}: MasterDetailProps<T>) {
  const hasDetail = selectedId || showCreationForm;

  const [isListExpanded, setIsListExpanded] = useState(false);

  useEffect(() => {
    if (hasDetail) {
      setIsListExpanded(false);
    }
  }, [hasDetail]);

  const isCollapsed = hasDetail && !isListExpanded;

  const selectedItem = selectedId
    ? items.find((i) => getItemId(i) === selectedId) ?? null
    : null;

  return (
    <>
      {/* Mobile PageHeader — hide when detail is active */}
      <div className={`${hasDetail ? "hidden" : "block"} md:hidden pt-8 pb-2 px-4 relative z-10`}>
        <div>
          <h1 className="text-xl font-black text-on-surface tracking-tight">{mobileTitle}</h1>
          {mobileDescription && <p className="text-xs text-on-surface-variant mt-0.5">{mobileDescription}</p>}
        </div>
      </div>

      {/* Mobile Detail Header — shown only on mobile when a detail is selected */}
      {selectedItem && detailTitle && (
        <div className="md:hidden relative z-50">
          <Header
            title={detailTitle(selectedItem)}
            leftAction={
              <button
                onClick={() => onSelectedChange(null)}
                aria-label="Volver"
                className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-on-surface" />
              </button>
            }
            rightAction={detailRightAction ? detailRightAction(selectedItem) : undefined}
            actionContainerClassName="flex items-center shrink-0 w-auto min-w-[40px]"
          />
        </div>
      )}

      {/* SEARCH/FILTER HEADER — hide on mobile when detail is active */}
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
      <div className={`flex-1 grid grid-cols-1 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-0 ${isCollapsed ? "md:grid-cols-[64px_1fr]" : "md:grid-cols-[360px_1fr]"}`}>

        {/* LIST PANE */}
        <div
          className={`${
            selectedId && !showCreationForm ? "hidden md:flex" : "flex"
          } flex-col border-r border-outline-variant/10 bg-transparent relative z-10 md:bg-surface overflow-hidden`}
        >
          {/* COLLAPSED RAIL */}
          {isCollapsed && (
            <div className="hidden md:flex flex-col items-center py-3 gap-2 h-full w-full">
              <button
                onClick={() => setIsListExpanded(true)}
                className="w-9 h-9 rounded-xl bg-on-surface/5 hover:bg-on-surface/10 flex items-center justify-center transition-all active:scale-90 cursor-pointer mb-2 shrink-0"
                title="Expandir lista"
              >
                <ChevronsRight className="w-4 h-4 text-on-surface-variant" />
              </button>
              <div className="flex-1 overflow-y-auto flex flex-col items-center gap-1.5 scrollbar-none py-1 w-full">
                {items.map((item) => {
                  const isActive = selectedId === getItemId(item);
                  return (
                    <div key={getItemId(item)}>
                      {renderRailItem(item, isActive)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FULL LIST */}
          {!isCollapsed && (
            <>
              <div className="flex items-center justify-between px-4 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/6 bg-surface/50 backdrop-blur-xl md:bg-transparent">
                <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {pagination.totalItems} {countLabel}
                </span>
                {hasDetail && isListExpanded && (
                  <button
                    onClick={() => setIsListExpanded(false)}
                    className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-on-surface/5 hover:bg-on-surface/10 text-on-surface-variant transition-colors cursor-pointer active:scale-95"
                    title="Minimizar lista"
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Ocultar</span>
                  </button>
                )}
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
            </>
          )}
        </div>

        {/* DETAIL PANE */}
        <div
          className={`${
            hasDetail ? "flex" : "hidden md:flex"
          } flex-col bg-grouped-bg-light min-w-0 transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] md:opacity-100`}
        >
          {showCreationForm && renderCreationForm ? (
            renderCreationForm()
          ) : selectedItem ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {renderDetail(selectedItem)}
            </div>
          ) : emptyState ? (
            emptyState
          ) : (
            emptyDetail
          )}
        </div>
      </div>
    </>
  );
}
