import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublishedPosts = async () => {
            try {
                const response = await api.get('/api/health/posts/published?limit=6');
                setPosts(response.data.posts || []);
            } catch (error) {
                console.error('Lỗi fetch bài viết:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPublishedPosts();
    }, []);

    return (
        <div className="landing-page">
            {/* HERO SECTION */}
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

            {/* BLOG SECTION */}
            {posts.length > 0 && (
                <section className="blog-section">
                    <div className="section-header">
                        <h2>Bài Viết Sức Khỏe Hữu Ích</h2>
                        <p>Cập nhật kiến thức y tế, chăm sóc sức khỏe và lối sống lành mạnh</p>
                    </div>

                    <div className="blog-grid">
                        {posts.map((post) => (
                            <Link key={post.id} to={`/post/${post.id}`} className="blog-card-link">
                                <div className="blog-card">
                                    {post.thumbnail && (
                                        <div className="blog-image">
                                            <img src={post.thumbnail} alt={post.title} />
                                        </div>
                                    )}
                                    <div className="blog-content">
                                        {post.category_name && (
                                            <span className="blog-category">{post.category_name}</span>
                                        )}
                                        <h3>{post.title}</h3>
                                        <p>{post.excerpt || 'Bài viết sức khỏe'}</p>
                                        <div className="blog-meta">
                                            <small>
                                                {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;