import { useState, useEffect } from 'react';

/**
 * Custom hook để quản lý thời gian hiện tại
 * Tự động cập nhật mỗi 60 giây
 */
export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Set lần đầu ngay lập tức
        setCurrentTime(new Date());

        // Setup interval update mỗi 60s
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Cleanup
        return () => clearInterval(timer);
    }, []);

    return currentTime;
};
