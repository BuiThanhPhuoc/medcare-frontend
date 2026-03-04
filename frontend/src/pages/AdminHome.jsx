import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorHome.css'; 

const AdminHome = () => {
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
            <nav className="doctor-topbar" style={{backgroundColor: '#6b21a8'}}>
                <div className="doctor-brand"><i className="fas fa-user-shield"></i> Trung Tâm Quản Trị</div>
                <div className="doctor-profile">
                    <span>Quản trị viên: {user.username}</span>
                    <button onClick={handleLogout} className="btn-doctor-logout"><i className="fas fa-sign-out-alt"></i> Thoát</button>
                </div>
            </nav>

            <div className="doctor-dashboard">
                <div className="welcome-card" style={{borderLeftColor: '#6b21a8'}}>
                    <h2>Tổng Hành Dinh MedCare ⚙️</h2>
                    <p>Quản lý mọi hoạt động của hệ thống tại đây.</p>
                </div>

                <div className="doctor-actions">
                    <Link to="/admin" className="action-card" style={{borderColor: '#8b5cf6'}}>
                        <i className="fas fa-pills action-icon" style={{color: '#8b5cf6'}}></i>
                        <h3 style={{color: '#5b21b6'}}>Quản Lý Kho Thuốc</h3>
                        <p style={{color: '#64748b'}}>Nhập thuốc mới và theo dõi số lượng tồn kho.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;