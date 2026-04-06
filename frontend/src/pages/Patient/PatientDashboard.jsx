import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { usePatientHealth } from '../../hooks/usePatientHealth';
import api from '../../lib/api';
import './PatientHome.css';

const PatientDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleDateString('vi-VN', { weekday: 'long' });
    const dateStr = currentDate.toLocaleDateString('vi-VN');

    // Lấy dữ liệu sức khỏe
    const { healthData, loading: healthLoading, error: healthError, getBMIStatus } = usePatientHealth();

    // State cho stats
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        totalRecords: 0,
        totalPrescriptions: 0,
        completedAppointments: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    // State cho lịch hẹn sắp tới
    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);

    // Fetch stats từ API
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const response = await api.get('/api/patient/stats');
                setStats(response.data.stats || stats);
            } catch (err) {
                console.error('Lỗi lấy stats:', err);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch upcoming appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setAppointmentsLoading(true);
                const response = await api.get('/api/appointments/my-appointments');
                setAppointments(response.data.appointments || []);
            } catch (err) {
                console.error('Lỗi lấy lịch khám:', err);
            } finally {
                setAppointmentsLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    // Lọc upcoming appointments (chỉ lấy những lịch chưa qua và không bị hủy)
    const upcomingAppointments = useMemo(() => {
        const now = new Date();
        return appointments
            .filter(apt => {
                const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
                return appointmentDateTime > now && apt.status !== 'cancelled' && apt.status !== 'completed';
            })
            .sort((a, b) => {
                const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
                const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
                return dateA - dateB;
            })
            .slice(0, 3); // Hiển thị 3 lịch sắp tới
    }, [appointments]);

    // Format ngày và giờ
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', { 
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    };

    const bmiStatus = getBMIStatus(healthData.bmi);

    return (
        <div className="patient-dashboard">
            {/* Welcome Section with gradient */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">👋 Xin chào, <span className="user-name">{user.username}</span>!</h1>
                        <p className="welcome-subtitle">Chúc bạn một ngày khỏe mạnh và vui vẻ — {dateStr}</p>
                    </div>
                    <div className="welcome-date">
                        <div className="date-day">{currentDate.getDate()}</div>
                        <div className="date-info">
                            <div className="date-month">Tháng {currentDate.getMonth() + 1}</div>
                            <div className="date-weekday">{dayOfWeek}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h3 className="section-title">⚡ Hành động nhanh</h3>
                <div className="actions-grid">
                    <Link to="/book-appointment" className="action-card book-action">
                        <i className="fas fa-calendar-plus"></i>
                        <span>Đặt lịch khám</span>
                    </Link>
                    <Link to="/medical-history" className="action-card history-action">
                        <i className="fas fa-history"></i>
                        <span>Lịch sử khám bệnh</span>
                    </Link>
                    <Link to="/patient/medicines" className="action-card medicine-action">
                        <i className="fas fa-pills"></i>
                        <span>Mua thuốc online</span>
                    </Link>
                    <Link to="/patient/orders" className="action-card orders-action">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Lịch sử đơn hàng</span>
                    </Link>
                    <Link to="/patient/lab-results" className="action-card history-action">
                        <i className="fas fa-vials"></i>
                        <span>Xét nghiệm của tôi</span>
                    </Link>
                    <Link to="/patient-profile" className="action-card medical-action">
                        <i className="fas fa-user-circle"></i>
                        <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link to="/patient-profile" className="action-card report-action">
                        <i className="fas fa-chart-line"></i>
                        <span>Báo cáo sức khỏe</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-section">
                <h3 className="section-title">📊 Thống kê của bạn</h3>
                <div className="stats-grid">
                    <div className="stat-card appointments-stat">
                        <div className="stat-icon">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Lịch hẹn sắp tới</div>
                            <div className="stat-value">{statsLoading ? '...' : stats.upcomingAppointments}</div>
                        </div>
                    </div>
                    <div className="stat-card records-stat">
                        <div className="stat-icon">
                            <i className="fas fa-file-medical"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Hồ sơ khám</div>
                            <div className="stat-value">{statsLoading ? '...' : stats.totalRecords}</div>
                        </div>
                    </div>
                    <div className="stat-card prescription-stat">
                        <div className="stat-icon">
                            <i className="fas fa-prescription"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Đơn thuốc</div>
                            <div className="stat-value">{statsLoading ? '...' : stats.totalPrescriptions}</div>
                        </div>
                    </div>
                    <div className="stat-card completed-stat">
                        <div className="stat-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Hoàn thành</div>
                            <div className="stat-value">{statsLoading ? '...' : stats.completedAppointments}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Indicators */}
            {!healthError && (
                <div className="health-section">
                    <h3 className="section-title">💚 Chỉ số sức khỏe của bạn</h3>
                    <div className="health-indicators-grid">
                        <div className="health-indicator-card">
                            <div className="health-icon">
                                <i className="fas fa-ruler-vertical"></i>
                            </div>
                            <div className="health-content">
                                <div className="health-label">Chiều cao</div>
                                <div className="health-value">
                                    {healthLoading ? '...' : (healthData.height ? `${healthData.height} cm` : 'Chưa cập nhật')}
                                </div>
                            </div>
                        </div>
                        <div className="health-indicator-card">
                            <div className="health-icon">
                                <i className="fas fa-weight"></i>
                            </div>
                            <div className="health-content">
                                <div className="health-label">Cân nặng</div>
                                <div className="health-value">
                                    {healthLoading ? '...' : (healthData.weight ? `${healthData.weight} kg` : 'Chưa cập nhật')}
                                </div>
                            </div>
                        </div>
                        <div className="health-indicator-card">
                            <div className="health-icon">
                                <i className="fas fa-droplet"></i>
                            </div>
                            <div className="health-content">
                                <div className="health-label">Nhóm máu</div>
                                <div className="health-value">
                                    {healthLoading ? '...' : healthData.blood_type}
                                </div>
                            </div>
                        </div>
                        <div className="health-indicator-card bmi-card" style={{ borderLeftColor: bmiStatus.color }}>
                            <div className="health-icon">
                                <i className="fas fa-chart-pie"></i>
                            </div>
                            <div className="health-content">
                                <div className="health-label">BMI</div>
                                <div className="health-value">
                                    {healthLoading ? '...' : (healthData.bmi ? healthData.bmi : 'N/A')}
                                </div>
                                {healthData.bmi && (
                                    <div className="bmi-status" style={{ color: bmiStatus.color }}>
                                        {bmiStatus.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to="/patient-profile" className="update-health-link">
                        📝 Cập nhật thông tin sức khỏe
                    </Link>
                </div>
            )}

            {/* Appointments & Health Info */}
            <div className="info-section">
                <div className="info-row">
                    <div className="info-card upcoming-appointments">
                        <div className="card-header-modern">
                            <h4>📅 Lịch hẹn sắp tới</h4>
                            <Link to="/my-appointments" className="view-all">Xem tất cả →</Link>
                        </div>
                        <div className="card-body-modern">
                            {appointmentsLoading ? (
                                <div className="loading-state">
                                    <div className="spinner-small"></div>
                                    <p>Đang tải lịch hẹn...</p>
                                </div>
                            ) : upcomingAppointments.length > 0 ? (
                                <div className="appointments-list">
                                    {upcomingAppointments.map((apt, idx) => (
                                        <div key={apt.id} className="appointment-item">
                                            <div className="appointment-date">
                                                <div className="date-box">
                                                    <div className="date-day">{new Date(apt.appointment_date).getDate()}</div>
                                                    <div className="date-month">{new Date(apt.appointment_date).toLocaleDateString('vi-VN', { month: 'short' })}</div>
                                                </div>
                                            </div>
                                            <div className="appointment-info">
                                                <div className="appointment-time">
                                                    <i className="fas fa-clock"></i> {formatTime(apt.appointment_time)}
                                                </div>
                                                <div className="appointment-doctor">
                                                    <i className="fas fa-user-md"></i> {apt.doctor_name}
                                                </div>
                                                <div className="appointment-specialty">
                                                    <i className="fas fa-stethoscope"></i> {apt.specialty}
                                                </div>
                                                <div className={`appointment-status status-${apt.status}`}>
                                                    {apt.status === 'pending' && '⏳ Chờ xác nhận'}
                                                    {apt.status === 'approved' && '✅ Đã xác nhận'}
                                                    {apt.status === 'checked-in' && '📍 Đã check-in'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-calendar-times"></i>
                                    <p>Bạn chưa có lịch hẹn nào sắp tới</p>
                                    <Link to="/book-appointment" className="btn-primary-outline">Đặt lịch ngay</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
