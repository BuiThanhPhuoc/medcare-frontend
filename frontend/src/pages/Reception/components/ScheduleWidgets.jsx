import '../CSS/Reception.css';

/**
 * TodayShifts Component
 * Hiển thị bảng lịch ca làm việc hôm nay từ database
 */
export const TodayShifts = ({ currentTime, schedules = [] }) => {
    // Lấy ngày hôm nay định dạng YYYY-MM-DD
    const today = currentTime.toISOString().split('T')[0];
    
    // Lọc lịch hôm nay
    const todaySchedules = schedules.filter(s => s.work_date === today);

    // Nếu không có lịch hôm nay
    if (todaySchedules.length === 0) {
        return (
            <div className="soft-panel">
                <div className="panel-header">
                    <h5><i className="fas fa-calendar-day text-blue me-2"></i> Ca làm việc hôm nay</h5>
                    <small className="text-muted">{currentTime.toLocaleDateString('vi-VN')}</small>
                </div>
                <div className="panel-body">
                    <div className="alert alert-info mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Hôm nay không có lịch làm việc
                    </div>
                </div>
            </div>
        );
    }

    // Mapping shift times
    const shiftTimes = {
        morning: { start: '08:00', end: '12:00', label: 'Ca sáng' },
        afternoon: { start: '13:00', end: '17:00', label: 'Ca chiều' }
    };

    return (
        <div className="soft-panel">
            <div className="panel-header">
                <h5><i className="fas fa-calendar-day text-blue me-2"></i> Ca làm việc hôm nay</h5>
                <small className="text-muted">{currentTime.toLocaleDateString('vi-VN')}</small>
            </div>
            <div className="panel-body p-0">
                <table className="soft-table">
                    <thead>
                        <tr>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Ca làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todaySchedules.map((schedule, idx) => {
                            const shiftInfo = shiftTimes[schedule.shift];
                            return (
                                <tr key={idx}>
                                    <td><span className="time-badge bg-blue-light text-blue">{shiftInfo.start}</span></td>
                                    <td><span className="time-badge bg-emerald-light text-emerald">{shiftInfo.end}</span></td>
                                    <td className="text-muted">{shiftInfo.label}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/**
 * WeeklySchedule Component
 * Hiển thị bảng lịch làm việc hôm nay từ database
 * (Sửa từ "tuần này" thành "hôm nay")
 */
export const WeeklySchedule = ({ currentTime, schedules = [] }) => {
    const today = currentTime.toISOString().split('T')[0];
    const todaySchedules = schedules.filter(s => s.work_date === today);

    // Mapping shift times
    const shiftTimes = {
        morning: { start: '08:00', end: '12:00', label: 'Ca sáng' },
        afternoon: { start: '13:00', end: '17:00', label: 'Ca chiều' }
    };

    // Nếu không có lịch hôm nay
    if (todaySchedules.length === 0) {
        return (
            <div className="soft-panel">
                <div className="panel-header">
                    <h5><i className="fas fa-calendar-alt text-coral me-2"></i> Lịch làm việc hôm nay</h5>
                </div>
                <div className="panel-body">
                    <div className="alert alert-info mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        Hôm nay không có lịch làm việc
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="soft-panel">
            <div className="panel-header">
                <h5><i className="fas fa-calendar-alt text-coral me-2"></i> Lịch làm việc hôm nay</h5>
            </div>
            <div className="panel-body p-0">
                <table className="soft-table table-hover">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Thứ</th>
                            <th>Giờ làm việc</th>
                            <th>Ca làm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todaySchedules.map((schedule, idx) => {
                            const shiftInfo = shiftTimes[schedule.shift];
                            return (
                                <tr key={idx} className="row-highlight">
                                    <td><strong>Hôm nay</strong></td>
                                    <td>{currentTime.toLocaleDateString('vi-VN', { weekday: 'long' })}</td>
                                    <td>
                                        <span className="time-badge bg-blue-light text-blue">{shiftInfo.start}</span>
                                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                                        <span className="time-badge bg-emerald-light text-emerald">{shiftInfo.end}</span>
                                    </td>
                                    <td>{shiftInfo.label}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};