import { useState, useEffect } from 'react';
import ReceptionHeader from './components/ReceptionHeader';
import QuickActionsBar from './components/QuickActionsBar';
import QuickStats from './components/QuickStats';
import PersonalInfo from './components/PersonalInfo';
import { TodayShifts, WeeklySchedule } from './components/ScheduleWidgets';
import QuickActionCheckInModal from './components/QuickActionCheckInModal';
import NotificationCenter from '../../components/NotificationCenter';
import { useReceptionUser } from './hooks/useReceptionUser';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useNotificationSystem } from '../../hooks/useNotificationSystem';
import api from '../../lib/api';
import { receptionService } from './services/receptionService';
import './ReceptionDashboard.css';

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

// Quick actions navigation
const QUICK_ACTIONS = [
    {
        id: 1,
        label: 'Check-in Bệnh nhân',
        icon: 'fas fa-user-check',
        path: '/reception/checkin',
        className: 'soft-btn btn-coral-soft'
    },
    {
        id: 2,
        label: 'Quầy Thu ngân',
        icon: 'fas fa-file-invoice-dollar',
        path: '/billing',
        className: 'soft-btn btn-outline-soft'
    }
];

const ReceptionDashboard = () => {
    const { user, isLoading, handleLogout } = useReceptionUser();
    const currentTime = useCurrentTime();
    const [schedules, setSchedules] = useState([]);
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [showQuickCheckInModal, setShowQuickCheckInModal] = useState(false);
    const { requestPermission, notifyNewPatient, notifyPrescriptionReady, notifyPaymentComplete } = useNotificationSystem();
    const [notifications, setNotifications] = useState([]); // In-app notifications

    // Fetch stats từ API
    const fetchStats = async () => {
        try {
            const statsData = await receptionService.getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Lỗi tải stats:', error);
            setStats(null);
        } finally {
            setStatsLoading(false);
        }
    };

    // Fetch schedules từ API
    const fetchSchedules = async () => {
        try {
            const schedulesData = await receptionService.getMySchedule();
            setSchedules(schedulesData);
        } catch (error) {
            console.error('Lỗi tải lịch làm việc:', error);
            setSchedules([]);
        }
    };

    // Add in-app notification
    const addNotification = (type, title, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, title, message, timestamp: new Date() }]);
        
        // Auto remove after 5s
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    // Request notification permission on mount
    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    useEffect(() => {
        if (user?.id) {
            fetchStats();
            fetchSchedules();
        }
    }, [user?.id]);

    // Nếu chưa load xong user → show loading
    if (isLoading || statsLoading) {
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
        fullName: user.username || 'Nhân viên',
        position: user.role || 'Lễ Tân / Thu Ngân',
        email: user.email || 'user@medcare.vn',
        phone: user.phone || 'N/A'
    };

    // Fallback stats nếu API gặp lỗi
    const displayStats = stats || {
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    totalRevenue: 0
};

    return (
        <div className="reception-layout">
            <div className="mc-dash-hero mb-3">
                <h2>Quầy lễ tân &amp; thu ngân</h2>
                <p>Đón tiếp bệnh nhân, check-in và thu phí — giao diện đã được đồng bộ với MedCare.</p>
            </div>
            {/* Header: Welcome + Time + Logout */}
            <ReceptionHeader 
                user={user} 
                currentTime={currentTime} 
                onLogout={handleLogout}
            />

            {/* Quick Actions Bar */}
            <QuickActionsBar 
                actions={QUICK_ACTIONS}
                onQuickCheckIn={() => setShowQuickCheckInModal(true)}
            />

            {/* Stats Grid */}
            <QuickStats stats={displayStats} />

            {/* Split Content: Today Shifts + Personal Info */}
            <div className="content-grid-half mb-4">
                <TodayShifts currentTime={currentTime} schedules={schedules} />
                <PersonalInfo personalInfo={personalInfo} />
            </div>

            {/* Weekly Schedule - Full Width */}
            <WeeklySchedule currentTime={currentTime} schedules={schedules} />

            {/* Quick Check-in Modal */}
            <QuickActionCheckInModal 
                show={showQuickCheckInModal}
                onHide={() => setShowQuickCheckInModal(false)}
                onSuccess={() => {
                    // Tải lại stats
                    fetchStats();
                    // Demo: show notification
                    addNotification('new-patient', 'Bệnh nhân mới', 'Có bệnh nhân mới vừa đặt lịch');
                    notifyNewPatient('Nguyễn Văn A', 'Nội khoa');
                }}
            />

            {/* Notification Center */}
            <NotificationCenter 
                notifications={notifications}
                onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            />

            {/* Demo: Notification Buttons (xoá sau khi test) */}
            <div style={{ 
                position: 'fixed', 
                bottom: 20, 
                left: 20, 
                zIndex: 1000,
                display: process.env.NODE_ENV === 'development' ? 'flex' : 'none',
                gap: 8,
                flexDirection: 'column'
            }}>
                <button 
                    className="btn btn-sm btn-info"
                    onClick={() => {
                        addNotification('new-patient', '🎉 Bệnh nhân mới', 'Nguyễn Văn A - Nội khoa');
                        notifyNewPatient('Nguyễn Văn A', 'Nội khoa');
                    }}
                >
                    Test: Bệnh nhân mới
                </button>
                <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => {
                        addNotification('prescription', '💊 Đơn thuốc sẵn sàng', 'Đơn của Trần Thị B đã xong');
                        notifyPrescriptionReady('Trần Thị B');
                    }}
                >
                    Test: Đơn thuốc
                </button>
                <button 
                    className="btn btn-sm btn-success"
                    onClick={() => {
                        addNotification('payment', '✅ Thanh toán hoàn tất', 'Lê Văn C - 500.000 VNĐ');
                        notifyPaymentComplete('Lê Văn C', '500000');
                    }}
                >
                    Test: Thanh toán
                </button>
            </div>
        </div>
    );
};

export default ReceptionDashboard;
