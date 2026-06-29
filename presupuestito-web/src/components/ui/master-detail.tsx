"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { Search, Plus, ChevronsRight, ChevronsLeft, ChevronLeft } from "lucide-react";
import { UsePaginationResult } from "@/hooks/use-pagination";
import { PaginationButtons } from "./pagination-buttons";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  detailAnimationClass?: string;
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
  detailAnimationClass = "animate-fade-in-up",
}: MasterDetailProps<T>) {
  const hasDetail = selectedId || showCreationForm;

  const isCollapsed = false;

  const selectedItem = selectedId
    ? items.find((i) => getItemId(i) === selectedId) ?? null
    : null;

  const activeContent = showCreationForm && renderCreationForm
    ? renderCreationForm()
    : selectedItem
    ? renderDetail(selectedItem)
    : null;

  const lastActiveId = useRef<string | null>(selectedId);
  if (selectedId) lastActiveId.current = selectedId;
  else if (showCreationForm) lastActiveId.current = "create";

  const prevContentRef = useRef<ReactNode>(null);
  useEffect(() => {
    if (activeContent) {
      prevContentRef.current = activeContent;
    }
  }, [activeContent]);

  const contentToRender = activeContent || prevContentRef.current;

  return (
    <>
      {/* Mobile PageHeader — hide when detail is active */}
      <div className={`${hasDetail ? "hidden" : "block"} md:hidden pt-8 pb-2 px-4 relative z-10`}>
        <h1 className="text-[34px] font-bold text-on-surface tracking-tight leading-tight">{mobileTitle}</h1>
        {mobileDescription && <p className="text-[15px] font-medium text-on-surface-variant mt-1">{mobileDescription}</p>}
      </div>

      {/* Mobile Detail Back Button — shown only on mobile when a detail is selected */}
      {selectedItem && detailTitle && (
        <div className="md:hidden px-4 py-2.5 relative z-50 flex items-center justify-between">
          <button
            onClick={() => onSelectedChange(null)}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant font-medium cursor-pointer hover:text-on-surface transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </button>
          {detailRightAction && detailRightAction(selectedItem)}
        </div>
      )}

      {/* MASTER-DETAIL WRAPPER */}
      <div className="flex-1 relative flex min-h-0 overflow-hidden">

        {/* LIST PANE */}
        <div
          className={`absolute inset-0 md:relative flex-shrink-0 flex flex-col border-r border-outline-variant/10 bg-transparent md:bg-surface overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 w-full md:w-[360px] ${
            hasDetail ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          } ${isCollapsed ? "md:!w-[64px]" : ""}`}
        >
          {/* SEARCH BAR — always inside the list pane, hidden in rail mode */}
          {!isCollapsed && (
            <div className="px-4 md:px-5 py-3 bg-surface/80 md:bg-surface border-b border-outline-variant/10">
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
          )}
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
              <div className="flex items-center justify-between px-4 md:px-5 py-2.5 md:py-3 border-b border-outline-variant/6 bg-surface/80 md:bg-transparent">
                <span className="text-[12px] md:text-sm font-medium text-on-surface-variant/80">
                  {pagination.totalItems} {countLabel}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-4 md:py-0">
                {pagination.paginatedItems.length > 0 ? (
                  <>
                    {/* Mobile: grouped iOS-style container */}
                    <div className="md:hidden mx-4 bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-[24px] border border-outline-variant/20 shadow-sm overflow-hidden">
                      {pagination.paginatedItems.map((item, index) => (
                        <div
                          key={getItemId(item)}
                          className={index !== pagination.paginatedItems.length - 1 ? "border-b border-outline-variant/15" : ""}
                        >
                          {renderItem(item, selectedId === getItemId(item))}
                        </div>
                      ))}
                    </div>
                    {/* Desktop: plain list */}
                    <div className="hidden md:block">
                      {pagination.paginatedItems.map((item) => (
                        <div key={getItemId(item)}>
                          {renderItem(item, selectedId === getItemId(item))}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-on-surface-variant">
                    <p className="text-xs md:text-sm">Sin resultados</p>
                  </div>
                )}
                {/* Pagination inside scroll — always reachable on mobile */}
                <div className="md:hidden pb-28">
                  <PaginationButtons
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={pagination.goToPage}
                    className="px-4 pt-2"
                  />
                </div>
              </div>
              {/* Desktop pagination: pinned at bottom of pane */}
              <div className="hidden md:block">
                <PaginationButtons
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  pageSize={pagination.pageSize}
                  onPageChange={pagination.goToPage}
                  className="px-5 pb-4 pt-0"
                />
              </div>
            </>
          )}
        </div>

        {/* DETAIL PANE */}
        <div
          className={`absolute inset-0 md:relative flex-1 flex flex-col bg-transparent min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 ${
            hasDetail ? "translate-x-0" : "translate-x-full md:translate-x-0"
          } ${hasDetail ? "" : "max-md:pointer-events-none"}`}
        >
          {/* DESKTOP (Instant Swap) */}
          <div className="hidden md:flex flex-1 flex-col overflow-y-auto h-full">
            {hasDetail ? (
              <div key={selectedId || (showCreationForm ? "create" : "empty")} className="flex-1 flex flex-col overflow-y-auto h-full">
                {activeContent}
              </div>
            ) : (
              emptyState || emptyDetail
            )}
          </div>

          {/* MOBILE (Retain Content for Slide Out) */}
          <div className="flex md:hidden relative flex-1 flex-col min-h-0 overflow-hidden">
            {!hasDetail && (
              <div className="absolute inset-0 flex flex-col z-0">
                {emptyState || emptyDetail}
              </div>
            )}
            <div className={`absolute inset-0 flex flex-col z-10 bg-grouped-bg-light transition-opacity duration-300 ${
              !hasDetail ? "pointer-events-none" : ""
            }`}>
              {contentToRender && (
                <div key={lastActiveId.current || "empty"} className={`flex-1 flex flex-col overflow-y-auto h-full ${hasDetail ? detailAnimationClass : ""}`}>
                  {contentToRender}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
