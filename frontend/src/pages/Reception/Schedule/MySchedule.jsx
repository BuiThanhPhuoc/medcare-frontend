import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './MySchedule.css';

/**
 * Reception - My Schedule Page
 * Lễ tân xem lịch làm việc của chính mình
 * View only - không thể edit (Admin edit bằng ReceptionistSchedule)
 */
const ReceptionMySchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await api.get('/api/reception/my-schedule');
                setSchedules(res.data.schedules || []);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi tải lịch:', error);
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    // Gom nhóm theo ngày để hiển thị
    const scheduleByDate = schedules.reduce((acc, sch) => {
        const dateStr = new Date(sch.work_date).toLocaleDateString('vi-VN');
        if (!acc[dateStr]) {
            acc[dateStr] = { morning: false, afternoon: false, date: sch.work_date };
        }
        if (sch.shift === 'morning') acc[dateStr].morning = true;
        if (sch.shift === 'afternoon') acc[dateStr].afternoon = true;
        return acc;
    }, {});

    const scheduleDates = Object.keys(scheduleByDate).sort((a, b) => {
        return new Date(scheduleByDate[a].date) - new Date(scheduleByDate[b].date);
    });

    return (
        <div className="reception-schedule-container container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-calendar-check"></i> Lịch Làm Việc Của Tôi
            </h2>

            <div className="reception-schedule-wrapper">
                <div className="card-body">
                    {loading ? (
                        <div className="reception-schedule-loading">
                            <div className="spinner-border"></div>
                        </div>
                    ) : scheduleDates.length === 0 ? (
                        <div className="reception-schedule-empty">
                            <i className="fas fa-calendar-times"></i>
                            <h5>Chưa có lịch làm việc nào!</h5>
                            <p>Admin sẽ gán lịch cho bạn. Vui lòng chờ.</p>
                        </div>
                    ) : (
                        <>
                            <div className="reception-schedule-alert">
                                <i className="fas fa-info-circle"></i>
                                <div>
                                    <strong>Đây là lịch làm việc chính thức của bạn.</strong>
                                    <span>Bạn cần làm việc vào những ca được liệt kê dưới đây.</span>
                                </div>
                            </div>

                            <div className="reception-schedule-grid">
                                {scheduleDates.map((dateStr, idx) => {
                                    const schedData = scheduleByDate[dateStr];
                                    const dateObj = new Date(schedData.date);
                                    const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

                                    return (
                                        <div className="reception-day-card" key={idx}>
                                            {/* Card Header */}
                                            <div className="reception-card-header">
                                                <i className="far fa-calendar-alt"></i> <span className="date-label">{dayName}</span>
                                                <div className="date-small">{dateStr}</div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="reception-card-body">
                                                {/* Morning Shift */}
                                                {schedData.morning ? (
                                                    <div className="reception-shift-container reception-shift-morning">
                                                        <i className="fas fa-sun shift-icon"></i>
                                                        <div className="shift-title">Ca Sáng</div>
                                                        <div className="shift-time">08:00 - 12:00</div>
                                                    </div>
                                                ) : (
                                                    <div className="reception-shift-off">
                                                        <i className="fas fa-times-circle"></i> Nghỉ Sáng
                                                    </div>
                                                )}

                                                {/* Afternoon Shift */}
                                                {schedData.afternoon ? (
                                                    <div className="reception-shift-container reception-shift-afternoon">
                                                        <i className="fas fa-cloud-sun shift-icon"></i>
                                                        <div className="shift-title">Ca Chiều</div>
                                                        <div className="shift-time">13:00 - 17:00</div>
                                                    </div>
                                                ) : (
                                                    <div className="reception-shift-off">
                                                        <i className="fas fa-times-circle"></i> Nghỉ Chiều
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="reception-schedule-summary">
                                <h6>
                                    <i className="fas fa-chart-bar"></i> Tổng Cộng
                                </h6>
                                <p>
                                    Bạn có <strong>{scheduleDates.length}</strong> ngày làm việc, tổng cộng <strong>{schedules.length}</strong> ca làm việc.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionMySchedule;
