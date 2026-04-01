/**
 * usePagination Hook
 * Quản lý state pagination cho API calls
 */

import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialLimit = 10) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Tính toán derived values
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Handler để đổi trang
    const goToPage = useCallback((newPage) => {
        const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
        setPage(validPage);
    }, [totalPages]);

    // Handler để đến trang trước
    const previousPage = useCallback(() => {
        if (hasPrevPage) {
            goToPage(page - 1);
        }
    }, [page, hasPrevPage, goToPage]);

    // Handler để đến trang sau
    const nextPage = useCallback(() => {
        if (hasNextPage) {
            goToPage(page + 1);
        }
    }, [page, hasNextPage, goToPage]);

    // Handler để đổi số items per page
    const setPageSize = useCallback((newLimit) => {
        setLimit(Math.max(1, Math.min(100, newLimit))); // Max 100
        setPage(1); // Reset về trang 1 khi đổi page size
    }, []);

    // Reset pagination
    const reset = useCallback(() => {
        setPage(initialPage);
        setLimit(initialLimit);
        setTotal(0);
        setData([]);
        setError(null);
    }, [initialPage, initialLimit]);

    // Update data
    const setApiData = useCallback((responseData, responseTotal) => {
        setData(responseData);
        setTotal(responseTotal);
    }, []);

    return {
        // State
        page,
        limit,
        offset,
        total,
        totalPages,
        data,
        loading,
        error,
        
        // Flags
        hasNextPage,
        hasPrevPage,
        
        // Setters
        setPage: goToPage,
        setPageSize,
        setLoading,
        setError,
        setData: setApiData,
        setTotal,
        
        // Navigation
        goToPage,
        previousPage,
        nextPage,
        
        // Utilities
        reset,
        
        // Query params để dùng trong API call
        queryParams: {
            page,
            limit,
            offset
        }
    };
};

export default usePagination;
