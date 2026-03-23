import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import './CSS/PatientHome.css';

const PatientDashboard = () => {
    const { t, i18n } = useTranslation(); // 2. Lấy hàm t và i18n
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleDateString('vi-VN', { weekday: 'long' });
    const dateStr = currentDate.toLocaleDateString('vi-VN');

    // Tự động lấy locale dựa trên ngôn ngữ i18n hiện tại
    const currentLocale = i18n.language === 'vn' ? 'vi-VN' : 'en-US';

    return (
<<<<<<< HEAD
        <div className="patient-dashboard">
            {/* Welcome Section with gradient */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">👋 Xin chào, <span className="user-name">{user.username}</span>!</h1>
                        <p className="welcome-subtitle">Chúc bạn một ngày khỏe mạnh và vui vẻ</p>
                    </div>
                    <div className="welcome-date">
                        <div className="date-day">{currentDate.getDate()}</div>
                        <div className="date-info">
                            <div className="date-month">Tháng {currentDate.getMonth() + 1}</div>
                            <div className="date-weekday">{dayOfWeek}</div>
=======
        <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="welcome-card mb-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="welcome-title mb-2">
                            <span className="wave-emoji">👋</span> {t('patient.welcome_user', { name: user.username })}
                        </h2>
                        <p className="welcome-text mb-0">{t('patient.welcome_subtitle')}</p>
                    </div>
                    <div className="text-end d-none d-md-block">
                        <div className="fs-5 fw-bold">
                            {new Date().toLocaleDateString(currentLocale)}
                        </div>
                        <div className="text-capitalize">
                            {new Date().toLocaleDateString(currentLocale, { weekday: 'long' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card bg-primary-gradient text-white p-3 rounded-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="mb-1 opacity-75">{t('patient.upcoming_appointment')}</p>
                                <h3 className="mb-0">2</h3>
                            </div>
                            <i className="fas fa-calendar-check fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card bg-success-gradient text-white p-3 rounded-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="mb-1 opacity-75">{t('patient.history')}</p>
                                <h3 className="mb-0">5</h3>
                            </div>
                            <i className="fas fa-file-medical fs-1 opacity-50"></i>
>>>>>>> 488d556c37a28732ee10c077185157bae5eed8d9
                        </div>
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h3 className="section-title">⚡ Hành động nhanh</h3>
                <div className="actions-grid">
                    <Link to="/patient-dashboard/book" className="action-card book-action">
                        <i className="fas fa-calendar-plus"></i>
                        <span>Đặt lịch khám</span>
                    </Link>
                    <Link to="/patient-dashboard/history" className="action-card history-action">
                        <i className="fas fa-history"></i>
                        <span>Lịch sử khám bệnh</span>
                    </Link>
                    <Link to="/patient-profile" className="action-card medical-action">
                        <i className="fas fa-user-circle"></i>
                        <span>Hồ sơ cá nhân</span>
                    </Link>
                    <Link to="#" className="action-card report-action">
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
                            <div className="stat-value">2</div>
                        </div>
                    </div>
                    <div className="stat-card records-stat">
                        <div className="stat-icon">
                            <i className="fas fa-file-medical"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Hồ sơ khám</div>
                            <div className="stat-value">5</div>
                        </div>
                    </div>
                    <div className="stat-card prescription-stat">
                        <div className="stat-icon">
                            <i className="fas fa-prescription"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Đơn thuốc</div>
                            <div className="stat-value">3</div>
                        </div>
                    </div>
                    <div className="stat-card completed-stat">
                        <div className="stat-icon">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">Hoàn thành</div>
                            <div className="stat-value">12</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointments & Health Info */}
            <div className="info-section">
                <div className="info-row">
                    <div className="info-card upcoming-appointments">
                        <div className="card-header-modern">
                            <h4>📅 Lịch hẹn sắp tới</h4>
                            <a href="#" className="view-all">Xem tất cả →</a>
                        </div>
                        <div className="card-body-modern">
                            <div className="empty-state">
                                <i className="fas fa-calendar-times"></i>
                                <p>Bạn chưa có lịch hẹn nào sắp tới</p>
                                <Link to="/patient-dashboard/book" className="btn-primary-outline">Đặt lịch ngay</Link>
                            </div>
                        </div>
                    </div>

                    <div className="info-card health-info">
                        <div className="card-header-modern">
                            <h4>❤️ Chỉ số sức khỏe</h4>
                        </div>
                        <div className="card-body-modern">
                            <div className="health-item">
                                <span className="health-label">Cân nặng</span>
                                <span className="health-value">65 kg</span>
                            </div>
                            <div className="health-item">
                                <span className="health-label">Chiều cao</span>
                                <span className="health-value">170 cm</span>
                            </div>
                            <div className="health-item">
                                <span className="health-label">Nhóm máu</span>
                                <span className="health-value blood-type">O+</span>
                            </div>
                            <div className="health-item">
                                <span className="health-label">BMI</span>
                                <span className="health-value bmi-value">22.5</span>
=======
            {/* Row Content */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="fas fa-calendar-alt text-primary me-2"></i> 
                                {t('patient.upcoming_appointment')}
                            </h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted text-center py-3">{t('patient.no_appointments')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">
                                <i className="fas fa-heartbeat text-danger me-2"></i> 
                                {t('patient.health_stats')}
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                                <span>{t('patient.weight')}:</span> <strong>65 kg</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>{t('patient.height')}:</span> <strong>170 cm</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>{t('patient.blood_type')}:</span> 
                                <strong className="text-danger">O+</strong>
>>>>>>> 488d556c37a28732ee10c077185157bae5eed8d9
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
