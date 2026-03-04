import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorHome.css'; // Tái sử dụng CSS layout, chỉ ghi đè màu

const ReceptionHome = () => {
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
            <nav className="doctor-topbar" style={{backgroundColor: '#e67e22'}}>
                <div className="doctor-brand"><i className="fas fa-desktop"></i> Quầy Lễ Tân MedCare</div>
                <div className="doctor-profile">
                    <span>Xin chào, {user.username}</span>
                    <button onClick={handleLogout} className="btn-doctor-logout"><i className="fas fa-sign-out-alt"></i> Thoát</button>
                </div>
            </nav>

            <div className="doctor-dashboard">
                <div className="welcome-card" style={{borderLeftColor: '#e67e22'}}>
                    <h2>Bắt đầu ca làm việc mới! 👩‍💻</h2>
                    <p>Hãy luôn giữ nụ cười để tiếp đón bệnh nhân thật chu đáo nhé.</p>
                </div>

                <div className="doctor-actions">
                    <Link to="/reception" className="action-card" style={{borderColor: '#f39c12'}}>
                        <i className="fas fa-user-check action-icon" style={{color: '#f39c12'}}></i>
                        <h3 style={{color: '#d35400'}}>Check-in Bệnh Nhân</h3>
                        <p style={{color: '#7f8c8d'}}>Tìm kiếm lịch hẹn và điều phối vào phòng khám.</p>
                    </Link>

                    <Link to="/billing" className="action-card" style={{borderColor: '#e74c3c'}}>
                        <i className="fas fa-cash-register action-icon" style={{color: '#e74c3c'}}></i>
                        <h3 style={{color: '#c0392b'}}>Quầy Thu Ngân</h3>
                        <p style={{color: '#7f8c8d'}}>Thu tiền khám và xuất hóa đơn cho bệnh nhân.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReceptionHome;