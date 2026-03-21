import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import hook
import './CSS/PatientHome.css';

const PatientDashboard = () => {
    const { t, i18n } = useTranslation(); // 2. Lấy hàm t và i18n
    const user = JSON.parse(localStorage.getItem('user')) || {};

    // Tự động lấy locale dựa trên ngôn ngữ i18n hiện tại
    const currentLocale = i18n.language === 'vn' ? 'vi-VN' : 'en-US';

    return (
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
                        </div>
                    </div>
                </div>
            </div>

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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
