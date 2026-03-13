import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css'; // Dùng chung 1 file CSS cho Layout nếu muốn, hoặc tách riêng

const PatientLayout = ({ children, pageTitle = "Dashboard" }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    return (
        <div className="app-wrapper patient-theme">
            {/* SIDEBAR */}
            <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand">
                    <i className="fas fa-hospital-alt fs-3 mb-2"></i>
                    <h4>MedCare</h4>
                    <small>Phòng khám</small>
                </div>
                
                <div className="sidebar-user-info">
                    <div className="avatar-circle">{user.username?.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>{user.username}</strong>
                        <small>Bệnh nhân</small>
                    </div>
                </div>

                <nav className="sidebar-menu">
                    <Link to="/patient-home" className={location.pathname === '/patient-home' ? 'active' : ''}><i className="fas fa-th-large"></i> Tổng quan</Link>
                    <Link to="/book-appointment" className={location.pathname === '/book-appointment' ? 'active' : ''}><i className="fas fa-calendar-check"></i> Lịch hẹn khám</Link>
                    <Link to="/medical-history" className={location.pathname === '/medical-history' ? 'active' : ''}><i className="fas fa-file-medical"></i> Hồ sơ bệnh án</Link>
                    <hr />
                    <button onClick={handleLogout} className="btn-logout-sidebar"><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
                </nav>
            </aside>

            {/* TOPBAR & CONTENT */}
            <div className="main-content">
                <header className="topbar">
                    <div className="d-flex align-items-center gap-3">
                        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}><i className="fas fa-bars"></i></button>
                        <div>
                            <h2 className="page-title">{pageTitle}</h2>
                            <p className="page-subtitle text-muted mb-0">Chào mừng bạn trở lại</p>
                        </div>
                    </div>
                    <div className="topbar-actions">
                        <button className="btn-notification"><i className="fas fa-bell"></i></button>
                        <div className="avatar-small">{user.username?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>

                {/* VỊ TRÍ NHÉT RUỘT (DASHBOARD) */}
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </div>
    );
};
export default PatientLayout;