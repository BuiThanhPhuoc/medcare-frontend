import { Link } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const todayLabel = new Date().toLocaleDateString('vi-VN');

    return (
        <div className="dashboard-content">
            <div className="dashboard-header mb-4">
                <div className="header-left">
                    <h2 className="mb-1">
                        Chào mừng, BS. {user.username || 'Khách'} <i className="fas fa-hand-sparkles text-emerald" />
                    </h2>
                    <p className="mb-0">Đây là tổng quan hoạt động của bạn</p>
                </div>

                <div className="header-right">
                    <div className="time-display">
                        <div className="time-text">Hôm nay</div>
                        <div className="date-text">{todayLabel}</div>
                    </div>
                </div>
            </div>

            <div className="quick-actions-bar mb-4">
                <strong className="action-label">
                    <i className="fas fa-bolt me-1 text-emerald" /> Hành động nhanh:
                </strong>

                <Link to="/examine" className="soft-btn btn-outline-soft">
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
            </div>

            <div className="stats-grid mb-4">
                <div className="soft-stat-card">
                    <div className="stat-content">
                        <p>Lịch hẹn hôm nay</p>
                        <h3>12</h3>
                        <small>Ca trực đang mở</small>
                    </div>
                    <div className="stat-icon bg-emerald-light text-emerald">
                        <i className="fas fa-calendar-check" />
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
            </div>
        </div>
    );
};

export default DoctorDashboard;
