import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css';

const LabTechnicianLayout = ({ children, pageTitle = 'Xét nghiệm' }) => {
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
            <aside className={`sidebar bg-white border-end ${isMobileOpen ? 'mobile-open' : ''}`}>
                <Link
                    to="/lab-dashboard"
                    className="sidebar-brand text-decoration-none"
                    onClick={() => setIsMobileOpen(false)}
                >
                    <div className="sidebar-brand-header">
                        <i className="fas fa-flask fs-3"></i>
                        <small>XÉT NGHIỆM</small>
                    </div>
                    <h4>MedCare Lab</h4>
                    <small className="sidebar-brand-desc">Phòng khám</small>
                </Link>
                <nav className="sidebar-menu p-3">
                    <Link
                        to="/lab-dashboard"
                        className={`menu-item text-dark rounded mb-2 p-2 text-decoration-none d-flex align-items-center ${
                            location.pathname === '/lab-dashboard' || location.pathname.startsWith('/lab/order/')
                                ? 'bg-primary bg-opacity-10 text-primary fw-bold border-start border-primary border-4'
                                : ''
                        }`}
                    >
                        <i className="fas fa-list me-2" style={{ width: '20px' }}></i> Hàng chờ xét nghiệm
                    </Link>
                    <Link
                        to="/lab/all-results"
                        className={`menu-item text-dark rounded mb-2 p-2 text-decoration-none d-flex align-items-center ${
                            location.pathname === '/lab/all-results'
                                ? 'bg-primary bg-opacity-10 text-primary fw-bold border-start border-primary border-4'
                                : ''
                        }`}
                    >
                        <i className="fas fa-vials me-2" style={{ width: '20px' }}></i> Danh sách xét nghiệm
                    </Link>
                    <hr className="my-4" />
                    <button onClick={handleLogout} className="btn btn-light text-danger w-100 text-start fw-bold">
                        <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                    </button>
                </nav>
            </aside>
            <div className="main-content">
                <header className="topbar shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <button className="mobile-toggle" type="button" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2 className="page-title">{pageTitle}</h2>
                    </div>
                    <div className="topbar-actions">
                        <strong>{user.username}</strong>
                    </div>
                </header>
                <div className="content-wrapper">
                    <div className="mc-view-root">{children}</div>
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />}
        </div>
    );
};

export default LabTechnicianLayout;
