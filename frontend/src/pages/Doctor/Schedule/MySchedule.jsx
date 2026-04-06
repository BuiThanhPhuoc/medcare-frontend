import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './MySchedule.css';

const MySchedule = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [mySchedules, setMySchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMySchedules = async () => {
            if (!user.id) return;
            try {
                const res = await api.get(`/api/doctor/schedules/my-schedules/${user.id}`);
                setMySchedules(res.data.schedules || []);
                setLoading(false);
            } catch (error) { 
                console.error("Lỗi", error); setLoading(false); 
            }
        };
        fetchMySchedules();
    }, [user.id]);

    // 🔥 GOM NHÓM THEO NGÀY ĐỂ VẼ THỜI KHÓA BIỂU
    const scheduleByDate = mySchedules.reduce((acc, sch) => {
        const dateStr = new Date(sch.work_date).toLocaleDateString('vi-VN');
        if (!acc[dateStr]) acc[dateStr] = { morning: false, afternoon: false };
        if (sch.shift === 'morning') acc[dateStr].morning = true;
        if (sch.shift === 'afternoon') acc[dateStr].afternoon = true;
        return acc;
    }, {});

    return (
        <div className="doctor-schedule-container container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-calendar-check"></i> Lịch Làm Việc Đã Duyệt
            </h2>

            <div className="schedule-card-wrapper">
                <div className="card-body">
                    
                    {loading ? (
                        <div className="schedule-loading"><div className="spinner-border"></div></div>
                    ) : Object.keys(scheduleByDate).length === 0 ? (
                        <div className="schedule-empty">
                            <i className="fas fa-calendar-times"></i>
                            <h5>Chưa có lịch làm việc nào sắp tới!</h5>
                            <p>Bạn chưa đăng ký lịch, hoặc Admin chưa phê duyệt.</p>
                            <a href="/doctor/schedules/register" className="btn btn-primary mt-3 px-4 rounded-pill shadow-sm">
                                <i className="fas fa-plus me-2"></i> Đăng ký lịch ngay
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="schedule-info-alert">
                                <i className="fas fa-info-circle"></i>
                                <div>
                                    <strong>Đây là thời khóa biểu chính thức của bạn.</strong>
                                    <span>Hệ thống đã tự động mở các Slot 30 phút trong những ca này để bệnh nhân bắt đầu đặt lịch khám.</span>
                                </div>
                            </div>

                            {/* GIAO DIỆN DẠNG LƯỚI (GRID) */}
                            <div className="schedule-grid">
                                {Object.keys(scheduleByDate).map((date, index) => {
                                    const dayData = scheduleByDate[date];
                                    return (
                                        <div className="schedule-day-card" key={index}>
                                            <div className="schedule-card-header">
                                                <i className="far fa-calendar-alt"></i> Ngày {date}
                                            </div>
                                            <div className="schedule-card-body">
                                                {dayData.morning ? (
                                                    <div className="shift-container shift-morning">
                                                        <i className="fas fa-sun shift-icon"></i>
                                                        <div className="shift-title">Ca Sáng</div>
                                                        <div className="shift-time">08:00 - 12:00</div>
                                                    </div>
                                                ) : (
                                                    <div className="shift-off">
                                                        <i className="fas fa-times-circle"></i> Nghỉ Sáng
                                                    </div>
                                                )}

                                                {dayData.afternoon ? (
                                                    <div className="shift-container shift-afternoon">
                                                        <i className="fas fa-cloud-sun shift-icon"></i>
                                                        <div className="shift-title">Ca Chiều</div>
                                                        <div className="shift-time">13:00 - 17:00</div>
                                                    </div>
                                                ) : (
                                                    <div className="shift-off">
                                                        <i className="fas fa-times-circle"></i> Nghỉ Chiều
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MySchedule;