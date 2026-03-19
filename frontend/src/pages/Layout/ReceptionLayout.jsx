import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css'; // Dùng chung file CSS layout

const ReceptionLayout = ({ children, pageTitle = "Dashboard" }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="app-wrapper staff-theme">
            {/* SIDEBAR */}
            <aside className={`sidebar bg-white border-end ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-brand bg-success-gradient text-white p-4 text-center border-bottom">
                    <i className="fas fa-hospital fs-3 mb-2"></i>
                    <h4 className="mb-0 fw-bold">MedCare</h4>
                    <small className="opacity-75">Hệ thống Nhân viên</small>
                </div>

                <nav className="sidebar-menu p-3">
                    <div className="menu-label text-muted fw-bold small text-uppercase mb-2"><i className="fas fa-th-large me-1"></i> Dashboard</div>
                    <Link to="/reception-dashboard" className={`menu-item text-dark rounded mb-2 p-2 text-decoration-none d-flex align-items-center ${location.pathname === '/reception-dashboard' ? 'bg-success bg-opacity-10 text-success fw-bold border-start border-success border-4' : ''}`}>
                        <i className="fas fa-tachometer-alt me-2" style={{width: '20px'}}></i> Tổng quan
                    </Link>

                    <div className="menu-label text-muted fw-bold small text-uppercase mb-2 mt-4"><i className="fas fa-id-badge me-1"></i> Tiếp tân</div>
                    <Link to="/reception" className={`menu-item text-dark rounded mb-2 p-2 text-decoration-none d-flex align-items-center ${location.pathname === '/reception' ? 'bg-success bg-opacity-10 text-success fw-bold border-start border-success border-4' : ''}`}>
                        <i className="fas fa-user-check me-2" style={{width: '20px'}}></i> Check-in Bệnh nhân
                    </Link>
                    <Link to="/billing" className={`menu-item text-dark rounded mb-2 p-2 text-decoration-none d-flex align-items-center ${location.pathname === '/billing' ? 'bg-success bg-opacity-10 text-success fw-bold border-start border-success border-4' : ''}`}>
                        <i className="fas fa-cash-register me-2" style={{width: '20px'}}></i> Quầy Thu Ngân
                    </Link>
                    
                    <hr className="my-4" />
                    <button onClick={handleLogout} className="btn btn-light text-danger w-100 text-start fw-bold">
                        <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <header className="topbar bg-white border-bottom shadow-sm px-4 py-3 d-flex justify-content-between align-items-center sticky-top">
                    <div className="d-flex align-items-center">
                        <button className="btn d-md-none me-3 border" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2 className="mb-0 fs-4 fw-bold text-dark">{pageTitle}</h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="text-end d-none d-md-block">
                            <div className="fw-semibold text-dark">{user.username}</div>
                            <small className="text-muted">Nhân viên Lễ tân</small>
                        </div>
                        <div className="avatar-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="content-wrapper p-4 bg-light min-vh-100">
                    {children}
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 z-3" onClick={() => setIsMobileOpen(false)}></div>}
        </div>
    );
};

export default ReceptionLayout;