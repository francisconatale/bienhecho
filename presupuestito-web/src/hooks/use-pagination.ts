"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";

export interface UsePaginationResult<T> {
  paginatedItems: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  items: T[],
  pageSize: number = 10
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const itemsRef = useRef(items);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / internalPageSize));

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * internalPageSize;
    return items.slice(start, start + internalPageSize);
  }, [items, currentPage, internalPageSize]);

  // Eliminamos el reseteo automático por referencia porque rompía la paginación 
  // al actualizarse el store o al memoizar el array.
  // El useEffect de abajo ya se encarga de ajustar la página si totalPages baja.

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (!isLastPage) setCurrentPage((p) => p + 1);
  }, [isLastPage]);

  const prevPage = useCallback(() => {
    if (!isFirstPage) setCurrentPage((p) => p - 1);
  }, [isFirstPage]);

  return {
    paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize: internalPageSize,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    prevPage,
    setPageSize: setInternalPageSize,
  };
}
