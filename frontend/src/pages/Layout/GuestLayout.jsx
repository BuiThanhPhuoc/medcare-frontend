import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CSS/GuestLayout.css';

const GuestLayout = ({ children }) => {
    const [navOpen, setNavOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setNavOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!navOpen) return;
        const onKey = (e) => e.key === 'Escape' && setNavOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [navOpen]);

    return (
        <div className={`guest-layout ${navOpen ? 'nav-open' : ''}`}>
            <nav className="guest-navbar" aria-label="Thanh điều hướng chính">
                <div className="nav-container">
                    <Link to="/" className="brand-logo">
                        <i className="fas fa-heartbeat" aria-hidden />
                        <span>MedCare</span>
                    </Link>
                    <button
                        type="button"
                        className="guest-nav-toggle"
                        aria-expanded={navOpen}
                        aria-controls="guest-nav-menu"
                        aria-label={navOpen ? 'Đóng menu' : 'Mở menu'}
                        onClick={() => setNavOpen((v) => !v)}
                    >
                        <i className={`fas ${navOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden />
                    </button>
                    <div id="guest-nav-menu" className="nav-links" role="navigation">
                        <Link to="/" onClick={() => setNavOpen(false)}>
                            Trang chủ
                        </Link>
                        <a href="/#services" onClick={() => setNavOpen(false)}>
                            Dịch vụ
                        </a>
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login-outline" onClick={() => setNavOpen(false)}>
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="btn-register-solid" onClick={() => setNavOpen(false)}>
                                Đăng ký
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div
                className="guest-nav-overlay"
                role="presentation"
                aria-hidden={!navOpen}
                onClick={() => setNavOpen(false)}
                onKeyDown={(e) => e.key === 'Enter' && setNavOpen(false)}
            />

            <main className="guest-main">{children}</main>

            <footer className="guest-footer">
                <div className="footer-content">
                    <div>
                        <h3 className="footer-brand">
                            <i className="fas fa-heartbeat" aria-hidden /> MedCare
                        </h3>
                        <p>Hệ thống chăm sóc sức khỏe — đặt lịch nhanh, minh bạch.</p>
                    </div>
                    <div>
                        <h4>Liên hệ</h4>
                        <p>
                            <i className="fas fa-phone" aria-hidden /> Hotline: 1900 1234
                        </p>
                        <p>
                            <i className="fas fa-envelope" aria-hidden /> contact@medcare.vn
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    &copy; {new Date().getFullYear()} MedCare Clinic. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default GuestLayout;
