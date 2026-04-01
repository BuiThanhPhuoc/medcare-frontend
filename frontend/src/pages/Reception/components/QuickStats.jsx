import '../ReceptionDashboard.css';

/**
 * QuickStats Component
 * Hiển thị 4 thẻ thống kê chính từ API thực tế
 */
const QuickStats = ({ stats }) => {
    return (
        <div className="stats-grid mb-4">
            {/* Tổng ca khám hôm nay */}
            <div className="soft-stat-card border-top-purple">
                <div className="stat-content">
                    <p>Tổng ca hôm nay</p>
                    <h3 className="text-purple">{stats?.todayAppointments || 0}</h3>
                </div>
                <div className="stat-icon bg-purple-light text-purple">
                    <i className="fas fa-users"></i>
                </div>
            </div>

            {/* Đã hoàn thành */}
            <div className="soft-stat-card border-top-emerald">
                <div className="stat-content">
                    <p>Đã hoàn thành</p>
                    <h3 className="text-emerald">{stats?.completedAppointments || 0}</h3>
                </div>
                <div className="stat-icon bg-emerald-light text-emerald">
                    <i className="fas fa-check-circle"></i>
                </div>
            </div>

            {/* Đang chờ khám */}
            <div className="soft-stat-card border-top-amber">
                <div className="stat-content">
                    <p>Chờ khám / Check-in</p>
                    <h3 className="text-amber fs-5 mt-1">{stats?.pendingAppointments || 0}</h3>
                </div>
                <div className="stat-icon bg-amber-light text-amber">
                    <i className="fas fa-hourglass-half"></i>
                </div>
            </div>

            {/* Tổng doanh thu */}
            <div className="soft-stat-card border-top-blue">
                <div className="stat-content">
                    <p>Doanh thu hôm nay</p>
                    <h3 className="text-blue fs-5">
                        {Number(stats?.totalRevenue || 0).toLocaleString('vi-VN')} <span className="fs-6 fw-normal">đ</span>
                    </h3>
                </div>
                <div className="stat-icon bg-blue-light text-blue">
                    <i className="fas fa-money-bill-wave"></i>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;