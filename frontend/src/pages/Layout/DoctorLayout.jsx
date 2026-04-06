import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css';

const DoctorLayout = ({ children, pageTitle = "Bác Sĩ" }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    const isExamineSection =
        location.pathname === '/examine' || location.pathname.startsWith('/doctor/examine/');

    return (
        <div className="app-wrapper doctor-theme">
            <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
                <Link
                    to="/doctor-dashboard"
                    className="sidebar-brand text-decoration-none"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <div className="sidebar-brand-header">
                        <i className="fas fa-heartbeat fs-3"></i>
                        <small>BÁC SĨ</small>
                    </div>
                    <h4>MedCare</h4>
                </Link>
                <nav className="sidebar-menu">
                    <Link to="/doctor-dashboard" className={location.pathname === '/doctor-dashboard' ? 'active' : ''}><i className="fas fa-chart-line"></i> Tổng quan</Link>
                    <Link to="/examine" className={isExamineSection ? 'active' : ''}><i className="fas fa-users"></i> Hàng đợi khám</Link>
                    <Link to="/doctor/schedules/register" className={location.pathname === '/doctor/schedules/register' ? 'active' : ''}><i className="fas fa-calendar-plus"></i> Đăng ký lịch</Link>
                    <Link to="/doctor/schedule" className={location.pathname === '/doctor/schedule' ? 'active' : ''}><i className="fas fa-calendar-alt"></i> Lịch của tôi</Link>
                    <Link to="/doctor/medical-records" className={location.pathname === '/doctor/medical-records' ? 'active' : ''}><i className="fas fa-file-medical-alt"></i> Bệnh án đã khám</Link>
                    <Link to="/doctor/lab-results" className={location.pathname === '/doctor/lab-results' ? 'active' : ''}><i className="fas fa-vials"></i> Xét nghiệm</Link>
                    <hr />
                    <button onClick={handleLogout} className="btn-logout-sidebar"><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
                </nav>
            </aside>

            <div className="main-content">
                <header className="topbar shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}><i className="fas fa-bars"></i></button>
                        <h2 className="page-title">{pageTitle}</h2>
                    </div>
                    <div className="topbar-actions">
                        <div className="d-flex flex-column text-end">
                            <strong>BS. {user.username}</strong>
                        </div>
                        <div className="avatar-small">{user.username?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <div className="mc-view-root">{children}</div>
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>}
        </div>
    );
};
export default DoctorLayout;