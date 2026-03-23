import { useState, useEffect } from 'react';
import api from '../../lib/api';

/**
 * Reception - My Schedule Page
 * Lễ tân xem lịch làm việc của chính mình
 * View only - không thể edit (Admin edit bằng ReceptionistSchedule)
 */
const ReceptionMySchedule = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
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
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-calendar-check text-info me-2"></i> Lịch Làm Việc Của Tôi
            </h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : scheduleDates.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded border border-dashed">
                            <i className="fas fa-calendar-times fs-1 text-muted opacity-50 mb-3 d-block"></i>
                            <h5 className="text-secondary fw-bold">Chưa có lịch làm việc nào!</h5>
                            <p className="text-muted">Admin sẽ gán lịch cho bạn. Vui lòng chờ.</p>
                        </div>
                    ) : (
                        <>
                            <div className="alert alert-success border-0 shadow-sm d-flex align-items-center mb-4">
                                <i className="fas fa-info-circle fs-4 me-3"></i>
                                <div>
                                    <strong className="d-block">Đây là lịch làm việc chính thức của bạn.</strong>
                                    <span>Bạn cần làm việc vào những ca được liệt kê dưới đây.</span>
                                </div>
                            </div>

                            <div className="row g-3">
                                {scheduleDates.map((dateStr, idx) => {
                                    const schedData = scheduleByDate[dateStr];
                                    const dateObj = new Date(schedData.date);
                                    const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });

                                    return (
                                        <div className="col-lg-4 col-md-6" key={idx}>
                                            <div className="card h-100 border border-success border-opacity-25 shadow-sm rounded-3">
                                                {/* Card Header */}
                                                <div className="card-header bg-success bg-opacity-10 text-success fw-bold py-3 border-bottom-0 text-center rounded-top-3">
                                                    <i className="far fa-calendar-alt me-2"></i> {dayName}
                                                    <div className="small mt-1 opacity-75">{dateStr}</div>
                                                </div>

                                                {/* Card Body */}
                                                <div className="card-body p-4">
                                                    <div className="d-flex flex-column gap-3">
                                                        {/* Morning Shift */}
                                                        {schedData.morning ? (
                                                            <div className="bg-warning bg-opacity-15 border border-warning border-opacity-50 rounded-2 p-3 text-center">
                                                                <div className="text-dark fw-bold mb-2">
                                                                    <i className="fas fa-sun text-warning me-2" style={{ fontSize: '20px' }}></i> Ca Sáng
                                                                </div>
                                                                <div className="text-muted small">08:00 - 12:00</div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-light border border-dashed rounded-2 p-3 text-center text-muted">
                                                                <i className="fas fa-times-circle me-2"></i> Nghỉ Sáng
                                                            </div>
                                                        )}

                                                        {/* Afternoon Shift */}
                                                        {schedData.afternoon ? (
                                                            <div className="bg-info bg-opacity-15 border border-info border-opacity-50 rounded-2 p-3 text-center">
                                                                <div className="text-dark fw-bold mb-2">
                                                                    <i className="fas fa-cloud-sun text-info me-2" style={{ fontSize: '20px' }}></i> Ca Chiều
                                                                </div>
                                                                <div className="text-muted small">13:00 - 17:00</div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-light border border-dashed rounded-2 p-3 text-center text-muted">
                                                                <i className="fas fa-times-circle me-2"></i> Nghỉ Chiều
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary */}
                            <div className="mt-4 p-3 border border-info border-opacity-25 rounded-2 bg-info bg-opacity-5">
                                <h6 className="fw-bold text-info mb-2">
                                    <i className="fas fa-chart-bar me-2"></i> Tổng Cộng
                                </h6>
                                <p className="mb-0 text-muted">
                                    Bạn có <strong className="text-dark">{scheduleDates.length}</strong> ngày làm việc, tổng cộng <strong className="text-dark">{schedules.length}</strong> ca làm việc.
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
