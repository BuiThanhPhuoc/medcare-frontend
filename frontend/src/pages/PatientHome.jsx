import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorHome.css'; // Tái sử dụng layout dùng chung của các role

const PatientHome = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) navigate('/login');
        else setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="doctor-layout">
            {/* Topbar màu Xanh Ngọc của MedCare */}
            <nav className="doctor-topbar" style={{backgroundColor: '#10b981'}}>
                <div className="doctor-brand">
                    <Link to="/" style={{color: 'white', textDecoration: 'none'}}>
                        <i className="fas fa-heartbeat"></i> Cổng Bệnh Nhân MedCare
                    </Link>
                </div>
                <div className="doctor-profile">
                    <span>Xin chào, {user.username}</span>
                    <button onClick={handleLogout} className="btn-doctor-logout"><i className="fas fa-sign-out-alt"></i> Thoát</button>
                </div>
            </nav>

            <div className="doctor-dashboard">
                <div className="welcome-card" style={{borderLeftColor: '#10b981'}}>
                    <h2>Sức khỏe của bạn là ưu tiên hàng đầu! 🌿</h2>
                    <p>Chào mừng bạn đến với bảng điều khiển cá nhân. Bạn có thể đặt lịch khám hoặc theo dõi hồ sơ bệnh án tại đây.</p>
                </div>

                <div className="doctor-actions">
                    <Link to="/book-appointment" className="action-card" style={{borderColor: '#10b981'}}>
                        <i className="fas fa-calendar-plus action-icon" style={{color: '#10b981'}}></i>
                        <h3 style={{color: '#059669'}}>Đặt Lịch Khám</h3>
                        <p style={{color: '#64748b'}}>Chọn chuyên khoa, bác sĩ và thời gian khám phù hợp với bạn.</p>
                    </Link>

                    <Link to="/medical-history" className="action-card" style={{borderColor: '#f59e0b'}}>
                        <i className="fas fa-notes-medical action-icon" style={{color: '#f59e0b'}}></i>
                        <h3 style={{color: '#d97706'}}>Lịch Sử & Đơn Thuốc</h3>
                        <p style={{color: '#64748b'}}>Xem lại kết quả chẩn đoán và toa thuốc bác sĩ đã kê.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;