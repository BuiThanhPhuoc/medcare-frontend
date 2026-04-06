import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook để sử dụng toast notifications một cách dễ dàng
 */
export function useToast() {
    const success = useCallback((message, options = {}) => {
        toast.success(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options
        });
    }, []);

    const error = useCallback((message, options = {}) => {
        toast.error(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options
        });
    }, []);

    const info = useCallback((message, options = {}) => {
        toast.info(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options
        });
    }, []);

    const warning = useCallback((message, options = {}) => {
        toast.warning(message, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            ...options
        });
    }, []);

    return {
        success,
        error,
        info,
        warning,
        toast
    };
}
