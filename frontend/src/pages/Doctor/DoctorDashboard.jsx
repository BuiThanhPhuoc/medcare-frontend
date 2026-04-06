import { Link } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const todayLabel = new Date().toLocaleDateString('vi-VN', { 
        weekday: 'short',
        year: 'numeric', 
        month: '2-digit',
        day: '2-digit'
    });

    return (
        <div className="dashboard-content">
            {/* Hero Section */}
            <div className="mc-dash-hero mb-4">
                <div>
                    <h2>👋 Chào BS. {user.username || 'bác sĩ'}</h2>
                    <p>
                        Tổng quan hoạt động khám chữa bệnh hôm nay · <strong>{todayLabel}</strong>
                    </p>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="quick-actions-bar mb-4">
                <strong className="action-label">
                    <i className="fas fa-bolt me-1" /> Hành động nhanh:
                </strong>

                <Link to="/examine" className="soft-btn btn-primary-soft">
                    <i className="fas fa-users" /> Hàng đợi khám
                </Link>

                <button type="button" className="soft-btn btn-outline-soft">
                    <i className="fas fa-file-medical" /> Tạo bệnh án
                </button>

                <Link
                    to="/doctor/schedules/register"
                    className="soft-btn btn-primary-soft"
                >
                    <i className="fas fa-calendar-plus" /> Đăng ký lịch
                </Link>

                <Link to="/doctor/schedule" className="soft-btn btn-outline-soft">
                    <i className="fas fa-calendar-alt" /> Lịch của tôi
                </Link>

                <Link to="/doctor/medical-records" className="soft-btn btn-outline-soft">
                    <i className="fas fa-file-medical-alt" /> Bệnh án
                </Link>

                <Link to="/doctor/lab-results" className="soft-btn btn-outline-soft">
                    <i className="fas fa-vials" /> Xét nghiệm
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid mb-4">
                <div className="soft-stat-card">
                    <div className="stat-content">
                        <p>Lịch hẹn hôm nay</p>
                        <h3>12</h3>
                        <small>Ca trực đang mở</small>
                    </div>
                    <div className="stat-icon bg-blue-light text-blue">
                        <i className="fas fa-calendar-check" />
                    </div>
                </div>

                <div className="soft-stat-card">
                    <div className="stat-content">
                        <p>Bệnh nhân khám</p>
                        <h3>8</h3>
                        <small>Hôm nay đã khám</small>
                    </div>
                    <div className="stat-icon bg-emerald-light text-emerald">
                        <i className="fas fa-user-check" />
                    </div>
                </div>

                <div className="soft-stat-card">
                    <div className="stat-content">
                        <p>Tổng bệnh nhân</p>
                        <h3>1,204</h3>
                        <small>Lũy kế từ hệ thống</small>
                    </div>
                    <div className="stat-icon bg-blue-light text-blue">
                        <i className="fas fa-user-injured" />
                    </div>
                </div>

                <div className="soft-stat-card">
                    <div className="stat-content">
                        <p>Xét nghiệm chờ</p>
                        <h3>5</h3>
                        <small>Kết quả chưa có</small>
                    </div>
                    <div className="stat-icon bg-emerald-light text-emerald">
                        <i className="fas fa-vials" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
