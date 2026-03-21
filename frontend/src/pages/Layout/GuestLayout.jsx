import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../lib/LanguageSwitcher';
import './CSS/GuestLayout.css';

const GuestLayout = ({ children }) => {
    const { t } = useTranslation();
    return (
        <div className="guest-layout">
            {/* NAVBAR DÙNG CHUNG CHO KHÁCH */}
            <nav className="guest-navbar">
                <div className="nav-container">
                    <Link to="/" className="brand-logo">
                        <i className="fas fa-heartbeat"></i>
                        <span>MedCare</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/">{t('common.home')}</Link>
                        <a href="#services">{t('common.services')}</a>
                        <LanguageSwitcher />
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login-outline">{t('auth.loginButton')}</Link>
                            <Link to="/register" className="btn-register-solid">{t('auth.registerButton')}</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* NỘI DUNG TRANG (Home, Login, Register sẽ đổ vào đây) */}
            <main className="guest-main">
                {children}
            </main>

            {/* FOOTER DÙNG CHUNG */}
            <footer className="guest-footer">
                <div className="footer-content">
                    <div>
                        <h3 className="footer-brand"><i className="fas fa-heartbeat"></i> MedCare</h3>
                        <p>Hệ thống chăm sóc sức khỏe toàn diện và hiện đại.</p>
                    </div>
                    <div>
                        <h4>Liên hệ</h4>
                        <p><i className="fas fa-phone"></i> Hotline: 1900 1234</p>
                        <p><i className="fas fa-envelope"></i> Email: contact@medcare.vn</p>
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