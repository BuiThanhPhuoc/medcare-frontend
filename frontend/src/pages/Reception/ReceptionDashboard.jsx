import React from 'react';

const ReceptionDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    // Mock data theo chuẩn Laravel của bạn
    const stats = { caHomNay: 1, caTuanNay: 5, trangThai: 'Hoạt động', tongGio: 40 };
    const dateStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="dashboard-content">
            {/* Welcome Banner */}
            <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <div className="card-body text-white p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="mb-1 fw-bold">👋 Xin chào, {user.username}!</h2>
                        <p className="mb-0 opacity-75">Nhân viên Tiếp tân • {dateStr}</p>
                    </div>
                    <div className="text-end d-none d-md-block">
                        <div className="fs-1 fw-bold">{new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
                        <small className="opacity-75">Thời gian hiện tại</small>
                    </div>
                </div>
            </div>

            {/* Quick Stats (4 màu sắc gradient) */}
            <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100 text-white p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <div className="d-flex align-items-center">
                            <div className="p-3 rounded-circle bg-white bg-opacity-25"><i className="fas fa-calendar-check fs-2"></i></div>
                            <div className="ms-3">
                                <p className="mb-1 small opacity-75">Ca hôm nay</p>
                                <h3 className="mb-0 fw-bold">{stats.caHomNay}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100 text-white p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                        <div className="d-flex align-items-center">
                            <div className="p-3 rounded-circle bg-white bg-opacity-25"><i className="fas fa-calendar-week fs-2"></i></div>
                            <div className="ms-3">
                                <p className="mb-1 small opacity-75">Ca tuần này</p>
                                <h3 className="mb-0 fw-bold">{stats.caTuanNay}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100 text-white p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <div className="d-flex align-items-center">
                            <div className="p-3 rounded-circle bg-white bg-opacity-25"><i className="fas fa-user-check fs-2"></i></div>
                            <div className="ms-3">
                                <p className="mb-1 small opacity-75">Trạng thái</p>
                                <h3 className="mb-0 fw-bold fs-5 mt-1">{stats.trangThai}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6">
                    <div className="card border-0 h-100 text-white p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                        <div className="d-flex align-items-center">
                            <div className="p-3 rounded-circle bg-white bg-opacity-25"><i className="fas fa-clock fs-2"></i></div>
                            <div className="ms-3">
                                <p className="mb-1 small opacity-75">Tổng giờ tuần</p>
                                <h3 className="mb-0 fw-bold">{stats.tongGio} giờ</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Content */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100 rounded-4">
                        <div className="card-header bg-white border-0 pt-4 pb-3">
                            <h5 className="mb-0 fw-bold"><i className="fas fa-calendar-day text-primary me-2"></i>Ca làm việc hôm nay</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Giờ bắt đầu</th>
                                            <th>Giờ kết thúc</th>
                                            <th>Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span className="badge bg-primary px-3 py-2">07:00</span></td>
                                            <td><span className="badge bg-success px-3 py-2">15:00</span></td>
                                            <td>Trực quầy Check-in</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;
