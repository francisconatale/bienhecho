"use client";

import { useState, useCallback, useEffect } from "react";

export interface UseServerPaginationResult {
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

export function useServerPagination(
  totalItems: number,
  pageSize: number = 10
): UseServerPaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / internalPageSize));
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
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
