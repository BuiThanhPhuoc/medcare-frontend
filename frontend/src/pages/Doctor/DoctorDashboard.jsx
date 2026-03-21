import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Thêm i18n
import './CSS/DoctorHome.css';

const DoctorDashboard = () => {
    const { t } = useTranslation(); // 2. Lấy hàm t
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <div className="dashboard-content">
            {/* Header Dashboard */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1">
                                {t('doctor.welcome', { name: user.username || 'Guest' })} <i className="fas fa-hand-sparkles text-success"></i>
                            </h2>
                            <p className="text-muted mb-0">{t('doctor.overview_subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 Quick Actions Bar */}
            <div className="quick-actions-bar bg-white p-3 rounded-3 shadow-sm mb-4 d-flex gap-3 align-items-center flex-wrap">
                <strong className="text-success"><i className="fas fa-bolt me-1"></i> {t('doctor.quick_actions')}:</strong>
                <Link to="/examine" className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-users me-1"></i> {t('doctor.examine_queue')}
                </Link>
                <button className="btn btn-outline-success btn-sm">
                    <i className="fas fa-file-medical me-1"></i> {t('doctor.create_medical_record')}
                </button>

                <div className="vr d-none d-md-block mx-2"></div>

                <Link to="/doctor/schedules/register" className="btn btn-warning btn-sm text-dark fw-bold shadow-sm">
                    <i className="fas fa-calendar-plus me-1"></i> {t('doctor.register_schedule')}
                </Link>

                <Link to="/doctor/schedule" className="btn btn-outline-info btn-sm fw-bold shadow-sm">
                    <i className="fas fa-calendar-alt me-1"></i> {t('doctor.view_my_schedule')}
                </Link>
            </div>

            {/* 4 Cards Thống kê */}
            <div className="row g-3 mb-4">
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1 small">{t('doctor.today_appointments')}</p>
                                <h3 className="fw-bold text-success mb-0">12</h3>
                            </div>
                            <div className="p-3 bg-success bg-opacity-10 rounded text-success">
                                <i className="fas fa-calendar-check fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1 small">{t('doctor.total_patients')}</p>
                                <h3 className="fw-bold text-primary mb-0">1,204</h3>
                            </div>
                            <div className="p-3 bg-primary bg-opacity-10 rounded text-primary">
                                <i className="fas fa-user-injured fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;