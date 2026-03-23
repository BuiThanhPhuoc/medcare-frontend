import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook để quản lý user authentication
 * Lấy user từ localStorage, handle logout
 */
export const useReceptionUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
            // Không có user → redirect về login
            navigate('/login');
            setIsLoading(false);
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
        } catch (error) {
            console.error('Lỗi parse user data:', error);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return { user, isLoading, handleLogout };
};
