import { useState, useEffect } from 'react';
import api from '../../../lib/api';

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
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-calendar-check text-success me-2"></i> Lịch Làm Việc Đã Duyệt
            </h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : Object.keys(scheduleByDate).length === 0 ? (
                        <div className="text-center py-5 bg-light rounded border border-dashed">
                            <i className="fas fa-calendar-times fs-1 text-muted opacity-50 mb-3 d-block"></i>
                            <h5 className="text-secondary fw-bold">Chưa có lịch làm việc nào sắp tới!</h5>
                            <p className="text-muted">Bạn chưa đăng ký lịch, hoặc Admin chưa phê duyệt.</p>
                            <a href="/doctor/schedules/register" className="btn btn-primary mt-3 px-4 rounded-pill shadow-sm">
                                <i className="fas fa-plus me-2"></i> Đăng ký lịch ngay
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="alert alert-success border-0 shadow-sm d-flex align-items-center">
                                <i className="fas fa-info-circle fs-4 me-3"></i>
                                <div>
                                    <strong className="d-block">Đây là thời khóa biểu chính thức của bạn.</strong>
                                    <span>Hệ thống đã tự động mở các Slot 30 phút trong những ca này để bệnh nhân bắt đầu đặt lịch khám.</span>
                                </div>
                            </div>

                            {/* GIAO DIỆN DẠNG LƯỚI (GRID) */}
                            <div className="row g-3 mt-3">
                                {Object.keys(scheduleByDate).map((date, index) => {
                                    const dayData = scheduleByDate[date];
                                    return (
                                        <div className="col-md-4 col-sm-6" key={index}>
                                            <div className="card h-100 border border-success border-opacity-25 shadow-sm">
                                                <div className="card-header bg-success bg-opacity-10 text-success fw-bold text-center py-2 border-bottom-0">
                                                    <i className="far fa-calendar-alt me-2"></i> Ngày {date}
                                                </div>
                                                <div className="card-body p-3 text-center">
                                                    <div className="d-flex flex-column gap-2">
                                                        {dayData.morning ? (
                                                            <div className="bg-warning bg-opacity-25 text-dark rounded py-2 fw-bold border border-warning border-opacity-50">
                                                                <i className="fas fa-sun text-warning me-2"></i> Ca Sáng (08:00 - 12:00)
                                                            </div>
                                                        ) : (
                                                            <div className="bg-light text-muted rounded py-2 border border-dashed">
                                                                Nghỉ Sáng
                                                            </div>
                                                        )}

                                                        {dayData.afternoon ? (
                                                            <div className="bg-info bg-opacity-25 text-dark rounded py-2 fw-bold border border-info border-opacity-50">
                                                                <i className="fas fa-cloud-sun text-info me-2"></i> Ca Chiều (13:00 - 17:00)
                                                            </div>
                                                        ) : (
                                                            <div className="bg-light text-muted rounded py-2 border border-dashed">
                                                                Nghỉ Chiều
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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