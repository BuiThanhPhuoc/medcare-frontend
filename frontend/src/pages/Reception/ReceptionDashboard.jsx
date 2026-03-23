import { useState, useEffect } from 'react';
import ReceptionHeader from './components/ReceptionHeader';
import QuickActionsBar from './components/QuickActionsBar';
import QuickStats from './components/QuickStats';
import PersonalInfo from './components/PersonalInfo';
import { TodayShifts, WeeklySchedule } from './components/ScheduleWidgets';
import { useReceptionUser } from './hooks/useReceptionUser';
import { useCurrentTime } from './hooks/useCurrentTime';
import api from '../../lib/api';
import { MOCK_STATS, MOCK_PERSONAL_INFO, QUICK_ACTIONS } from './constants/mockData';
import './CSS/Reception.css';

/**
 * Reception Dashboard - Main container component
 * Tập hợp tất cả các sub-components
 * 
 * Layout:
 * - Header (Chào mừng + Time + Logout)
 * - Quick Actions Bar
 * - Stats Grid
 * - Today Shifts (left) | Personal Info (right)
 * - Weekly Schedule (full width)
 */
const ReceptionDashboard = () => {
    const { user, isLoading, handleLogout } = useReceptionUser();
    const currentTime = useCurrentTime();
    const [schedules, setSchedules] = useState([]);
    const [loadingSchedules, setLoadingSchedules] = useState(true);

    // Fetch receptionist schedules from API
    useEffect(() => {
        if (user?.id) {
            fetchSchedules();
        }
    }, [user?.id]);

    const fetchSchedules = async () => {
        try {
            setLoadingSchedules(true);
            const response = await api.get('/api/reception/my-schedule');
            setSchedules(response.data.schedules || []);
        } catch (error) {
            console.error('Lỗi tải lịch làm việc:', error);
            setSchedules([]);
        } finally {
            setLoadingSchedules(false);
        }
    };

    // Nếu chưa load xong user → show loading
    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Merge user data vào personalInfo (để dùng user data thay vì hardcoded)
    const personalInfo = {
        ...MOCK_PERSONAL_INFO,
        fullName: user.username || MOCK_PERSONAL_INFO.fullName,
        email: user.email || MOCK_PERSONAL_INFO.email,
        phone: user.phone || MOCK_PERSONAL_INFO.phone
    };

    return (
        <div className="reception-layout">
            {/* Header: Welcome + Time + Logout */}
            <ReceptionHeader 
                user={user} 
                currentTime={currentTime} 
                onLogout={handleLogout}
            />

            {/* Quick Actions Bar */}
            <QuickActionsBar actions={QUICK_ACTIONS} />

            {/* Stats Grid */}
            <QuickStats stats={MOCK_STATS} />

            {/* Split Content: Today Shifts + Personal Info */}
            <div className="content-grid-half mb-4">
                <TodayShifts currentTime={currentTime} schedules={schedules} />
                <PersonalInfo personalInfo={personalInfo} />
            </div>

            {/* Weekly Schedule - Full Width */}
            <WeeklySchedule currentTime={currentTime} schedules={schedules} />
        </div>
    );
};

export default ReceptionDashboard;
