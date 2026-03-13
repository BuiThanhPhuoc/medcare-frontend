import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css';

const AdminLayout = ({ children, pageTitle = "Quản trị Phòng khám" }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="app-wrapper admin-theme">
            {/* SIDEBAR ADMIN (Trắng đơn giản) */}
            <aside className={`sidebar bg-white border-end ${isMobileOpen ? 'mobile-open' : ''}`} style={{width: '250px', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto'}}>
                <div className="p-4">
                    <h5 className="fw-bold mb-4 text-dark">
                        <i className="fas fa-clinic-medical text-primary me-2"></i> Quản trị
                    </h5>

                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <Link to="/admin-home" className={`d-block p-2 rounded text-decoration-none ${location.pathname === '/admin-home' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                                <i className="fas fa-chart-line me-2"></i> Dashboard
                            </Link>
                        </li>
                        <li className="mb-4">
                            <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none p-2 w-100 text-start">
                                <i className="fas fa-lock me-2"></i> Đăng xuất
                            </button>
                        </li>

                        <hr />

                        <li className="mb-2 text-muted small fw-bold text-uppercase">Quản lý kho</li>
                        <li className="mb-2">
                            <Link to="/admin" className={`d-block p-2 rounded text-decoration-none ${location.pathname === '/admin' ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                                <i className="fas fa-pills me-2 text-success"></i> Thuốc
                            </Link>
                        </li>

                        <hr />

                        <li className="mb-2 text-muted small fw-bold text-uppercase">Quản lý nhân sự</li>
                        <li className="mb-2">
                            <Link to="/admin/doctors" className={`d-block p-2 rounded text-decoration-none ${location.pathname.includes('/admin/doctors') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                                <i className="fas fa-user-md me-2 text-info"></i> Bác sĩ
                            </Link>
                        </li>

                        <hr />

                        <li className="mb-2 text-muted small fw-bold text-uppercase">Quản lý nội dung</li>
                        <li className="mb-2">
                            <Link to="/admin/posts" className={`d-block p-2 rounded text-decoration-none ${location.pathname.includes('/admin/posts') ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}>
                                <i className="fas fa-newspaper me-2 text-warning"></i> Bài viết
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* MAIN CONTENT ADMIN */}
            <div className="main-content">
                <header className="topbar shadow-sm">
                    <div className="d-flex align-items-center">
                        <button className="mobile-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <h2 className="page-title">{pageTitle}</h2>
                    </div>
                    <div className="topbar-actions">
                        <div className="d-flex flex-column text-end">
                            <strong>{user.username}</strong>
                            <small className="text-muted">Admin</small>
                        </div>
                        <div className="avatar-small">{user.username?.charAt(0).toUpperCase()}</div>
                    </div>
                </header>

                <div className="content-wrapper">
                    {children}
                </div>
            </div>
            {isMobileOpen && <div className="sidebar-overlay position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 z-3" onClick={() => setIsMobileOpen(false)}></div>}
        </div>
    );
};

export default AdminLayout;