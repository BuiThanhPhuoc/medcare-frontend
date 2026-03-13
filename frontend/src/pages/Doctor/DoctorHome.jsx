import { Link } from 'react-router-dom';
import './CSS/DoctorHome.css';

const DoctorHome = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <div className="dashboard-content">
            {/* Header Dashboard */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1">Chào mừng, BS. {user.username} <i className="fas fa-hand-sparkles text-success"></i></h2>
                            <p className="text-muted mb-0">Đây là tổng quan hoạt động của bạn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="quick-actions-bar bg-white p-3 rounded-3 shadow-sm mb-4 d-flex gap-3 align-items-center">
                <strong className="text-success"><i className="fas fa-bolt"></i> Hành động nhanh:</strong>
                <Link to="/examine" className="btn btn-outline-primary btn-sm"><i className="fas fa-users"></i> Hàng đợi khám</Link>
                <button className="btn btn-outline-success btn-sm"><i className="fas fa-file-medical"></i> Tạo bệnh án</button>
            </div>

            {/* 4 Cards Thống kê */}
            <div className="row g-3 mb-4">
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1 small">Lịch hẹn hôm nay</p>
                                <h3 className="fw-bold text-success mb-0">12</h3>
                            </div>
                            <div className="p-3 bg-success bg-opacity-10 rounded text-success">
                                <i className="fas fa-calendar-check fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1 small">Tổng bệnh nhân</p>
                                <h3 className="fw-bold text-primary mb-0">1,204</h3>
                            </div>
                            <div className="p-3 bg-primary bg-opacity-10 rounded text-primary">
                                <i className="fas fa-user-injured fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Lịch hẹn chi tiết bên dưới */}
            {/* ... */}
        </div>
    );
};

export default DoctorHome;