import '../CSS/Reception.css';

/**
 * QuickStats Component
 * Hiển thị 4 thẻ thống kê chính
 */
const QuickStats = ({ stats }) => {
    return (
        <div className="stats-grid mb-4">
            {/* Ca hôm nay */}
            <div className="soft-stat-card border-top-purple">
                <div className="stat-content">
                    <p>Ca hôm nay</p>
                    <h3 className="text-purple">{stats.todayShifts}</h3>
                </div>
                <div className="stat-icon bg-purple-light text-purple">
                    <i className="fas fa-calendar-check"></i>
                </div>
            </div>

            {/* Ca tuần này */}
            <div className="soft-stat-card border-top-emerald">
                <div className="stat-content">
                    <p>Ca tuần này</p>
                    <h3 className="text-emerald">{stats.weeklyShifts}</h3>
                </div>
                <div className="stat-icon bg-emerald-light text-emerald">
                    <i className="fas fa-calendar-week"></i>
                </div>
            </div>

            {/* Trạng thái */}
            <div className="soft-stat-card border-top-amber">
                <div className="stat-content">
                    <p>Trạng thái</p>
                    <h3 className="text-amber fs-5 mt-1">{stats.status}</h3>
                </div>
                <div className="stat-icon bg-amber-light text-amber">
                    <i className="fas fa-user-check"></i>
                </div>
            </div>

            {/* Tổng giờ tuần */}
            <div className="soft-stat-card border-top-blue">
                <div className="stat-content">
                    <p>Tổng giờ tuần</p>
                    <h3 className="text-blue">
                        {stats.totalHours} <span className="fs-6 fw-normal">giờ</span>
                    </h3>
                </div>
                <div className="stat-icon bg-blue-light text-blue">
                    <i className="fas fa-clock"></i>
                </div>
            </div>
        </div>
    );
};

export default QuickStats;