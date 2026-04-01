import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    // Không cần check user ở đây nữa vì đã có PublicRoute bảo vệ ở ngoài App.jsx rồi
    return (
        <div className="landing-page">
            {/* HERO SECTION (Đã xóa Navbar đi vì GuestLayout đã lo việc đó) */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1>Chăm Sóc Sức Khỏe <br/> Toàn Diện cùng <span className="highlight-yellow">MedCare</span></h1>
                        <p>
                            Đội ngũ bác sĩ chuyên nghiệp – Trang thiết bị hiện đại – Dịch vụ y tế uy tín chuẩn quốc tế. Đặt lịch khám online nhanh chóng và tiện lợi.
                        </p>
                        
                        <div className="hero-actions">
                            <Link to="/login" className="btn-primary-lg">
                                <i className="fas fa-calendar-check"></i> Đặt Lịch Ngay
                            </Link>
                            <a href="#services" className="btn-outline-lg">Tìm Hiểu Thêm</a>
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
            
            {/* Đã xóa Footer đi vì GuestLayout đã lo việc đó */}
        </div>
    );
};

export default Home;