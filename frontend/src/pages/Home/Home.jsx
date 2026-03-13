import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="landing-page">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="brand-logo">
                        <i className="fas fa-heartbeat"></i>
                        <span>MedCare</span>
                    </Link>

                    <div className="nav-links">
                        <a href="#services">Dịch vụ</a>
                        <a href="#features">Chuyên khoa</a>
                        
                        {/* Khu vực Auth */}
                        {user ? (
                            <div className="user-menu">
                                <span className="welcome-text">
                                    <i className="fas fa-user-circle me-1"></i> Xin chào, <strong>{user.username}</strong>
                                </span>
                                <button onClick={handleLogout} className="btn-logout">
                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/register" className="btn-register">Đăng Ký</Link>
                                <Link to="/login" className="btn-login">
                                    <i className="fas fa-sign-in-alt"></i> Đăng Nhập
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Chăm Sóc Sức Khỏe <br/> Toàn Diện cùng <span className="highlight-yellow">MedCare</span></h1>
                        <p>
                            Đội ngũ bác sĩ chuyên nghiệp – Trang thiết bị hiện đại – Dịch vụ y tế uy tín chuẩn quốc tế. Đặt lịch khám online nhanh chóng và tiện lợi.
                        </p>
                        
                        <div className="hero-actions">
                            {/* NẾU CHƯA ĐĂNG NHẬP */}
                            {!user ? (
                                <>
                                    <Link to="/login" className="btn-primary-lg">
                                        <i className="fas fa-calendar-check"></i> Đặt Lịch Ngay
                                    </Link>
                                    <a href="#services" className="btn-outline-lg">Tìm Hiểu Thêm</a>
                                </>
                            ) : (
                                /* NẾU ĐÃ ĐĂNG NHẬP -> Hiện nút điều hướng về Nhà Riêng theo Role */
                                <Link 
                                    to={
                                        user.role === 'doctor' ? '/doctor-home' : 
                                        user.role === 'receptionist' ? '/reception-home' : 
                                        user.role === 'admin' ? '/admin-home' : '/patient-home'
                                    } 
                                    className="btn-primary-lg"
                                >
                                    <i className="fas fa-desktop"></i> Vào Bảng Điều Khiển Của Bạn
                                </Link>
                            )}
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <h3>50+</h3>
                                <p>Bác Sĩ Chuyên Khoa</p>
                            </div>
                            <div className="stat-item">
                                <h3>10k+</h3>
                                <p>Bệnh Nhân Tin Tưởng</p>
                            </div>
                            <div className="stat-item">
                                <h3>99%</h3>
                                <p>Hài Lòng Dịch Vụ</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-image">
                        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="MedCare Clinic" />
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" className="services-section">
                <div className="section-header">
                    <h2>Cam Kết Điều Trị Toàn Diện</h2>
                    <p>Trải nghiệm dịch vụ y tế hiện đại – an toàn – tận tâm</p>
                </div>

                <div className="services-grid">
                    <div className="service-card">
                        <div className="icon-box"><i className="fas fa-calendar-alt"></i></div>
                        <h3>Đăng Ký Khám</h3>
                        <p>Đặt lịch online nhanh chóng, chọn bác sĩ và giờ phù hợp không cần chờ đợi.</p>
                    </div>
                    <div className="service-card">
                        <div className="icon-box"><i className="fas fa-user-md"></i></div>
                        <h3>Đội Ngũ Chuyên Gia</h3>
                        <p>Khám và điều trị bởi các bác sĩ đầu ngành, nhiều năm kinh nghiệm.</p>
                    </div>
                    <div className="service-card">
                        <div className="icon-box"><i className="fas fa-pills"></i></div>
                        <h3>Nhà Thuốc Đạt Chuẩn</h3>
                        <p>Cung cấp thuốc chính hãng, giá cả minh bạch, tư vấn liều dùng tận tình.</p>
                    </div>
                    <div className="service-card">
                        <div className="icon-box"><i className="fas fa-laptop-medical"></i></div>
                        <h3>Hồ Sơ Điện Tử</h3>
                        <p>Lưu trữ bệnh án an toàn, bệnh nhân dễ dàng tra cứu lịch sử mọi lúc mọi nơi.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2><i className="fas fa-heartbeat"></i> MedCare</h2>
                        <p>Dịch vụ chăm sóc sức khỏe toàn diện với hệ thống điều trị hiện đại, an toàn và tận tâm.</p>
                    </div>
                    <div className="footer-contact">
                        <h3>Liên Hệ</h3>
                        <p><i className="fas fa-map-marker-alt"></i> Khu Công Nghệ Cao, TP.Thủ Đức</p>
                        <p><i className="fas fa-phone"></i> Hotline: 1900 1234</p>
                        <p><i className="fas fa-envelope"></i> Email: support@medcare.vn</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 MedCare Clinic. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;