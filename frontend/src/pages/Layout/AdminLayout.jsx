import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './CSS/Layout.css';
import './CSS/AdminLayout.css';

const AdminLayout = ({ children, pageTitle = 'Quản trị Phòng khám' }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [medicineMenuOpen, setMedicineMenuOpen] = useState(false);
    const [labTestsMenuOpen, setLabTestsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const path = location.pathname;

    useEffect(() => {
        if (path.startsWith('/admin/medicines')) setMedicineMenuOpen(true);
        if (path.startsWith('/admin/lab-test')) setLabTestsMenuOpen(true);
    }, [path]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const linkClass = (active) =>
        `admin-nav-link ${active ? 'admin-nav-link--active' : ''}`;

    const medicineSectionActive = path.startsWith('/admin/medicines');
    const labSectionActive = path.startsWith('/admin/lab-test');

    return (
        <div className="app-wrapper admin-theme">
            <aside
                className={`sidebar bg-white admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
                aria-label="Menu quản trị"
            >
                <div className="admin-sidebar-inner">
                    <div className="admin-sidebar-brand">
                        <Link to="/admin-dashboard" onClick={() => setIsMobileOpen(false)}>
                            <h1 className="admin-sidebar-brand-title">
                                <i className="fas fa-clinic-medical" aria-hidden />
                                Quản trị
                            </h1>
                            <div className="admin-sidebar-brand-sub">Phòng khám</div>
                        </Link>
                    </div>

                    <nav className="admin-sidebar-scroll" aria-label="Điều hướng chính">
                        <ul className="list-unstyled mb-0">
                            <li>
                                <Link
                                    to="/admin-dashboard"
                                    className={linkClass(path === '/admin-dashboard')}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-chart-line" aria-hidden />
                                    Tổng quan
                                </Link>
                            </li>

                            <li className="admin-nav-section-label">Kho &amp; xét nghiệm</li>
                            <li>
                                <button
                                    type="button"
                                    className={`admin-nav-link admin-nav-toggle ${medicineSectionActive ? 'admin-nav-link--active' : ''}`}
                                    onClick={() => setMedicineMenuOpen((o) => !o)}
                                    aria-expanded={medicineMenuOpen}
                                >
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="fas fa-pills text-success" aria-hidden />
                                        Thuốc &amp; kho
                                    </span>
                                    <i className="fas fa-chevron-right admin-nav-chevron" aria-hidden />
                                </button>
                                {medicineMenuOpen && (
                                    <ul className="admin-nav-submenu">
                                        <li>
                                            <Link
                                                to="/admin/medicines"
                                                className={linkClass(path === '/admin/medicines')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-th-large" aria-hidden />
                                                Tổng quan thuốc
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/medicines/inventory"
                                                className={linkClass(path === '/admin/medicines/inventory')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-dolly" aria-hidden />
                                                Quản lý kho
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/medicines/catalog"
                                                className={linkClass(path === '/admin/medicines/catalog')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-list" aria-hidden />
                                                Danh mục thuốc
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/medicines/batches"
                                                className={linkClass(path === '/admin/medicines/batches')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-boxes" aria-hidden />
                                                Lô thuốc
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className={`admin-nav-link admin-nav-toggle ${labSectionActive ? 'admin-nav-link--active' : ''}`}
                                    onClick={() => setLabTestsMenuOpen((o) => !o)}
                                    aria-expanded={labTestsMenuOpen}
                                >
                                    <span className="d-flex align-items-center gap-2">
                                        <i className="fas fa-flask text-info" aria-hidden />
                                        Xét nghiệm
                                    </span>
                                    <i className="fas fa-chevron-right admin-nav-chevron" aria-hidden />
                                </button>
                                {labTestsMenuOpen && (
                                    <ul className="admin-nav-submenu">
                                        <li>
                                            <Link
                                                to="/admin/lab-tests"
                                                className={linkClass(path === '/admin/lab-tests')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-vial" aria-hidden />
                                                Danh sách xét nghiệm
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin/lab-test-categories"
                                                className={linkClass(path === '/admin/lab-test-categories')}
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                <i className="fas fa-folder" aria-hidden />
                                                Danh mục
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>

                            <li className="admin-nav-section-label">Nhân sự</li>
                            <li>
                                <Link
                                    to="/admin/users"
                                    className={linkClass(path === '/admin/users')}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-users text-secondary" aria-hidden />
                                    Người dùng
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/doctors"
                                    className={linkClass(path.startsWith('/admin/doctors'))}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-user-md text-info" aria-hidden />
                                    Bác sĩ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/receptionists"
                                    className={linkClass(path.startsWith('/admin/receptionists'))}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-headset" aria-hidden />
                                    Lễ tân
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/lab-technicians"
                                    className={linkClass(path.startsWith('/admin/lab-technicians'))}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-flask" aria-hidden />
                                    KTV xét nghiệm
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/specialties"
                                    className={linkClass(path.startsWith('/admin/specialties'))}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-stethoscope text-success" aria-hidden />
                                    Chuyên khoa
                                </Link>
                            </li>

                            <li className="admin-nav-section-label">Lịch khám &amp; Lịch làm việc</li>
                            <li>
                                <Link
                                    to="/admin/appointments"
                                    className={linkClass(path === '/admin/appointments')}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-calendar text-primary" aria-hidden />
                                    Phê duyệt Lịch khám
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/schedules"
                                    className={linkClass(path === '/admin/schedules')}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-calendar-check text-danger" aria-hidden />
                                    Phê duyệt lịch bác sĩ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin/schedules/receptionists"
                                    className={linkClass(path === '/admin/schedules/receptionists')}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-calendar-alt text-warning" aria-hidden />
                                    Lịch lễ tân
                                </Link>
                            </li>

                            <li className="admin-nav-section-label">Nội dung</li>
                            <li>
                                <Link
                                    to="/admin/posts"
                                    className={linkClass(path.startsWith('/admin/posts'))}
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <i className="fas fa-newspaper text-warning" aria-hidden />
                                    Bài viết
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="admin-sidebar-footer">
                        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt" aria-hidden />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            <div className="main-content">
                <header className="topbar shadow-sm">
                    <div className="d-flex align-items-center min-w-0">
                        <button
                            type="button"
                            className="mobile-toggle"
                            onClick={() => setIsMobileOpen(!isMobileOpen)}
                            aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
                        >
                            <i className="fas fa-bars" aria-hidden />
                        </button>
                        <h2 className="page-title text-truncate">{pageTitle}</h2>
                    </div>
                    <div className="topbar-actions flex-shrink-0">
                        <div className="d-flex flex-column text-end d-none d-sm-flex">
                            <strong className="text-truncate" style={{ maxWidth: '160px' }}>
                                {user.username}
                            </strong>
                            <small className="text-muted">Quản trị viên</small>
                        </div>
                        <div className="avatar-small" title={user.username}>
                            {user.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">{children}</div>
            </div>

            {isMobileOpen && (
                <div
                    className="sidebar-overlay position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50"
                    onClick={() => setIsMobileOpen(false)}
                    onKeyDown={(e) => e.key === 'Escape' && setIsMobileOpen(false)}
                    role="presentation"
                    aria-hidden
                />
            )}
        </div>
    );
};

export default AdminLayout;
