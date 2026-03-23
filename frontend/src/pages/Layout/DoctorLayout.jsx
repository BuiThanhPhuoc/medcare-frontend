import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Thêm i18n
import LanguageSwitcher from '../../lib/LanguageSwitcher';
import './CSS/Layout.css';

const DoctorLayout = ({ children, pageTitle }) => {
    const { t } = useTranslation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    return (
        <div className="app-wrapper doctor-theme">
            <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <i className="fas fa-heartbeat fs-3 mb-2"></i>
                    <h4>MedCare</h4>
                    <small>{t('doctor.role_name')}</small>
                </div>
                <nav className="sidebar-menu">
                    <Link to="/doctor-dashboard" className={location.pathname === '/doctor-dashboard' ? 'active' : ''}>
                        <i className="fas fa-chart-line"></i> {t('common.dashboard')}
                    </Link>
                    <Link to="/examine" className={location.pathname === '/examine' ? 'active' : ''}>
                        <i className="fas fa-users"></i> {t('doctor.examine_queue')}
                    </Link>
                    <Link to="/doctor/schedules/register" className={location.pathname === '/doctor/schedules/register' ? 'active' : ''}>
                        <i className="fas fa-calendar-plus"></i> {t('doctor.register_schedule')}
                    </Link>
                    <Link to="/doctor/schedule" className={location.pathname === '/doctor/schedule' ? 'active' : ''}>
                        <i className="fas fa-calendar-alt"></i> {t('doctor.my_schedule')}
                    </Link>
                    <hr />
                    <button onClick={handleLogout} className="btn-logout-sidebar">
                        <i className="fas fa-sign-out-alt"></i> {t('common.logout')}
                    </button>
                </nav>
            </aside>

            <div className="main-content">
                <header className="topbar shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2 className="page-title">{t(pageTitle) || pageTitle}</h2>
                    </div>
                    <div className="topbar-actions">
                        <LanguageSwitcher />
                        <div className="d-flex flex-column text-end">
                            <strong>{t('doctor.prefix')} {user.username}</strong>
                        </div>
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
export default DoctorLayout;