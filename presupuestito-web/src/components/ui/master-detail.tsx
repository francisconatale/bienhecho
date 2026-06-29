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
      {/* Mobile Detail Back Button — floating over detail pane */}
      {hasDetail && (
        <div className="md:hidden px-4 pt-12 pb-3 absolute top-0 left-0 w-full z-50 flex items-center justify-between bg-transparent pointer-events-none">
          <button
            onClick={() => {
              if (selectedItem) onSelectedChange(null);
              else if (showCreationForm && onToggleCreation) onToggleCreation();
            }}
            className="w-10 h-10 rounded-full bg-surface/50 backdrop-blur-xl border border-outline-variant/20 shadow-sm flex items-center justify-center text-primary cursor-pointer hover:bg-surface transition-colors active:scale-95 pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6 -ml-0.5" strokeWidth={2.5} />
          </button>

          <div className="flex items-center justify-end pointer-events-auto">
            {selectedItem && detailRightAction ? detailRightAction(selectedItem) : null}
          </div>
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
            <div className="hidden md:block px-5 py-3 bg-surface border-b border-outline-variant/10 z-20">
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
                {/* Desktop creation button */}
                {creationHref ? (
                  <Link
                    href={creationHref}
                    className="hidden md:flex h-9 w-9 rounded-lg bg-primary text-white items-center justify-center hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                  </Link>
                ) : onToggleCreation ? (
                  <button
                    onClick={onToggleCreation}
                    className={`hidden md:flex h-9 w-9 rounded-lg items-center justify-center transition-colors cursor-pointer ${
                      showCreationForm
                        ? "bg-outline-variant/15 text-on-surface"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {showCreationForm ? (
                      <span className="text-xl leading-none">&times;</span>
                    ) : (
                      <Plus className="w-5 h-5" strokeWidth={2.5} />
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
                onClick={() => {}}
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
              <div className="hidden md:flex items-center justify-between px-5 py-3 border-b border-outline-variant/6 bg-transparent">
                <span className="text-sm font-medium text-on-surface-variant/80">
                  {pagination.totalItems} {countLabel}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-2 md:py-0 overscroll-contain">
                {/* Mobile PageHeader — inside scroll so it scrolls away */}
                {!hasDetail && (
                  <>
                    <div className="md:hidden flex pt-14 pb-4 px-4 items-center justify-between">
                      <h1 className="text-[34px] font-bold text-on-surface tracking-tight leading-tight">{mobileTitle}</h1>
                      {creationHref ? (
                        <Link
                          href={creationHref}
                          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                        >
                          <Plus className="w-5 h-5" strokeWidth={2.5} />
                        </Link>
                      ) : onToggleCreation ? (
                        <button
                          onClick={onToggleCreation}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform ${
                            showCreationForm
                              ? "bg-outline-variant/15 text-on-surface"
                              : "bg-primary text-white"
                          }`}
                        >
                          {showCreationForm ? (
                            <span className="text-xl leading-none">&times;</span>
                          ) : (
                            <Plus className="w-5 h-5" strokeWidth={2.5} />
                          )}
                        </button>
                      ) : null}
                    </div>
                    {/* Mobile Search Bar */}
                    <div className="md:hidden px-4 pb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" strokeWidth={2} />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => onSearchChange(e.target.value)}
                          placeholder={searchPlaceholder}
                          className="w-full bg-surface/70 dark:bg-surface/40 backdrop-blur-xl border border-outline-variant/20 shadow-sm rounded-lg pl-9 pr-3 py-2.5 text-[15px] text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </>
                )}
                {pagination.paginatedItems.length > 0 ? (
                  <>
                    {/* Mobile: table style list */}
                    <div className="md:hidden px-4 pb-20">
                      <div className="flex flex-col bg-surface/70 dark:bg-surface/40 backdrop-blur-xl rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
                        <div className="flex flex-col divide-y divide-outline-variant/10">
                          {pagination.paginatedItems.map((item) => (
                            <div key={getItemId(item)} className="bg-transparent">
                              {renderItem(item, selectedId === getItemId(item))}
                            </div>
                          ))}
                        </div>
                      </div>
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
                <div className="md:hidden pb-28 pt-6 flex flex-col items-center gap-4">
                  <span className="text-[13px] font-medium text-on-surface-variant/50">
                    {pagination.totalItems} {countLabel} en total
                  </span>
                  <PaginationButtons
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={pagination.goToPage}
                    className="px-4"
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
          <div className="flex md:hidden relative flex-1 flex-col min-h-0">
            {!hasDetail && (
              <div className="absolute inset-0 flex flex-col z-0">
                {emptyState || emptyDetail}
              </div>
            )}
            <div className={`absolute inset-0 flex flex-col z-10 bg-grouped-bg-light transition-opacity duration-300 ${
              !hasDetail ? "pointer-events-none" : ""
            }`}>
              {contentToRender && (
                <div key={lastActiveId.current || "empty"} className={`flex-1 flex flex-col overflow-y-auto h-full overscroll-contain ${hasDetail ? detailAnimationClass : ""}`}>
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
