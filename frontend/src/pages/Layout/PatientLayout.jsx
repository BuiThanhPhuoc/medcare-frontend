import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Thêm i18n
import LanguageSwitcher from '../../lib/LanguageSwitcher';
import './CSS/Layout.css';

const PatientLayout = ({ children, pageTitle }) => {
    const { t } = useTranslation(); // 2. Lấy hàm t
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => { 
        localStorage.clear(); 
        navigate('/login'); 
    };

    return (
        <div className="app-wrapper patient-theme">
            {/* SIDEBAR */}
            <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <i className="fas fa-hospital-alt fs-3 mb-2"></i>
                    <h4>MedCare</h4>
                    <small>{t('common.clinic')}</small>
                </div>
                
                <div className="sidebar-user-info">
                    <div className="avatar-circle">{user.username?.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>{user.username}</strong>
                        <small>{t('patient.role_name')}</small>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <Link to="/patient-dashboard" className={location.pathname === '/patient-dashboard' ? 'active' : ''}>
                        <i className="fas fa-th-large"></i> {t('common.dashboard')}
                    </Link>
                    <Link to="/book-appointment" className={location.pathname === '/book-appointment' ? 'active' : ''}>
                        <i className="fas fa-calendar-check"></i> {t('patient.bookAppointment')}
                    </Link>
                    <Link to="/medical-history" className={location.pathname === '/medical-history' ? 'active' : ''}>
                        <i className="fas fa-file-medical"></i> {t('patient.history')}
                    </Link>
                    <hr />
<<<<<<< HEAD
                    <Link to="/patient-profile" className={location.pathname === '/patient-profile' ? 'active' : ''}><i className="fas fa-user-edit"></i> Hồ sơ cá nhân</Link>
                    <hr />
                    <button onClick={handleLogout} className="btn-logout-sidebar"><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
=======
                    <button onClick={handleLogout} className="btn-logout-sidebar">
                        <i className="fas fa-sign-out-alt"></i> {t('common.logout')}
                    </button>
>>>>>>> 488d556c37a28732ee10c077185157bae5eed8d9
                </nav>
            </aside>

            {/* TOPBAR & CONTENT */}
            <div className="main-content">
                <header className="topbar">
                    <div className="d-flex align-items-center gap-3">
                        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <div>
                            {/* Dùng t() để dịch tiêu đề trang từ App.js truyền vào */}
                            <h2 className="page-title">{t(pageTitle) || pageTitle}</h2>
                            <p className="page-subtitle text-muted mb-0">{t('patient.welcome_back')}</p>
                        </div>
                    </div>
                    <div className="topbar-actions">
                        <LanguageSwitcher />
                        <button className="btn-notification"><i className="fas fa-bell"></i></button>
                        <div className="avatar-small">{user.username?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>

                <div className="content-wrapper">
                    {children}
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </div>
    );
};
export default PatientLayout;