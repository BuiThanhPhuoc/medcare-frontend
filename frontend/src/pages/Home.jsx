import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra xem trong bộ nhớ trình duyệt có cục data 'user' nào không
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Có thì lấy ra dùng
        } else {
            navigate('/login'); // Không có (chưa đăng nhập) thì đá văng ra trang Login
        }
    }, [navigate]);

    const handleLogout = () => {
        // Xóa sạch Token và User khỏi bộ nhớ rồi quay về Login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null; // Đợi load dữ liệu chớp nhoáng

    return (
        <div className="home-container">
            {/* Thanh Header dùng chung */}
            <header className="home-header">
                <h1>Phòng Khám MedCare</h1>
                <div className="user-info">
                    <span>Xin chào, <strong>{user.username}</strong> ({user.role})</span>
                    <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                </div>
            </header>
            
            {/* Phần nội dung chính */}
            <main className="home-main">
                <h2>Chào mừng bạn đến với Hệ thống Quản lý</h2>
                
                <div className="menu-grid">
                    {/* Nếu là bệnh nhân thì hiện nút Đặt lịch và Xem lịch sử */}
                    {user.role === 'patient' && (
                        <>
                            <Link to="/book-appointment" className="menu-card">🗓️ Đặt lịch khám ngay</Link>
                            
                            {/* THÊM NÚT NÀY VÀO ĐÂY */}
                            <Link to="/medical-history" className="menu-card" style={{ backgroundColor: '#e67e22' }}>💊 Lịch sử & Đơn thuốc</Link>
                        </>
                    )}
                    
                    {/* Nếu là bác sĩ thì hiện nút Khám bệnh */}
                    {user.role === 'doctor' && (
                        <Link to="/examine" className="menu-card">🩺 Khám bệnh</Link>
                    )}

                    {/* Nếu là Lễ tân thì hiện nút Check-in & Thanh toán */}
                    {user.role === 'receptionist' && (
                        <Link to="/reception" className="menu-card">👩‍💻 Quầy Lễ tân</Link>
                    )}

                    {/* Nếu là Admin thì hiện nút Quản trị */}
                    {user.role === 'admin' && (
                        <Link to="/admin" className="menu-card">⚙️ Quản trị Hệ thống</Link>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;