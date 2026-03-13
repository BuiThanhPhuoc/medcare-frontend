import { Link } from 'react-router-dom';
import './CSS/PatientHome.css';

const PatientHome = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <div className="dashboard-content">
            {/* Welcome Section */}
            <div className="welcome-card mb-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="welcome-title mb-2">
                            <span className="wave-emoji">👋</span> Xin chào, {user.username}!
                        </h2>
                        <p className="welcome-text mb-0">Chào mừng bạn quay trở lại hệ thống quản lý sức khỏe</p>
                    </div>
                    <div className="text-end d-none d-md-block">
                        <div className="fs-5 fw-bold">{new Date().toLocaleDateString('vi-VN')}</div>
                        <div>{new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card bg-primary-gradient text-white p-3 rounded-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="mb-1 opacity-75">Lịch Hẹn Sắp Tới</p>
                                <h3 className="mb-0">2</h3>
                            </div>
                            <i className="fas fa-calendar-check fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="stat-card bg-success-gradient text-white p-3 rounded-3">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="mb-1 opacity-75">Hồ Sơ Bệnh Án</p>
                                <h3 className="mb-0">5</h3>
                            </div>
                            <i className="fas fa-file-medical fs-1 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Các Khối Thông tin khác (Biểu đồ, Lịch sử khám...) */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0"><i className="fas fa-calendar-alt text-primary me-2"></i> Lịch hẹn sắp tới</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted text-center py-3">Bạn chưa có lịch hẹn nào sắp tới</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0"><i className="fas fa-heartbeat text-danger me-2"></i> Chỉ số sức khỏe</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-2"><span>Cân nặng:</span> <strong>65 kg</strong></div>
                            <div className="d-flex justify-content-between mb-2"><span>Chiều cao:</span> <strong>170 cm</strong></div>
                            <div className="d-flex justify-content-between"><span>Nhóm máu:</span> <strong className="text-danger">O+</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHome;