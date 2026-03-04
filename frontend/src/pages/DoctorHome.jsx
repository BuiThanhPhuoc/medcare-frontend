import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorHome.css';

const DoctorHome = () => {
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
        navigate('/login');
    };

    return (
        <div className="doctor-layout">
            <nav className="doctor-topbar">
                <div className="doctor-brand"><i className="fas fa-user-md"></i> Cổng Chuyên Gia MedCare</div>
                <div className="doctor-profile">
                    <span>BS. {user.username}</span>
                    <button onClick={handleLogout} className="btn-doctor-logout"><i className="fas fa-sign-out-alt"></i> Thoát</button>
                </div>
            </nav>

            <div className="doctor-dashboard">
                <div className="welcome-card">
                    <h2>Chào mừng trở lại ca trực! 🏥</h2>
                    <p>Chúc bác sĩ một ngày làm việc hiệu quả và mang lại nhiều sức khỏe cho bệnh nhân.</p>
                </div>

                <div className="doctor-actions">
                    <Link to="/examine" className="action-card primary-action">
                        <i className="fas fa-stethoscope action-icon"></i>
                        <h3>Vào Phòng Khám</h3>
                        <p>Xem danh sách bệnh nhân chờ khám và ghi bệnh án.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DoctorHome;