import { useState } from 'react';
import api from '../../../lib/api';

const ScheduleRegister = () => {
    // 🔥 TỰ ĐỘNG LẤY THÔNG TIN BÁC SĨ ĐANG ĐĂNG NHẬP
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const doctorId = user.id; // Lấy ID của bác sĩ

    // State lưu trữ các ô tick chọn
    // 1: Thứ 2, 2: Thứ 3, ..., 6: Thứ 7
    const [schedule, setSchedule] = useState({
        1: { morning: false, afternoon: false },
        2: { morning: false, afternoon: false },
        3: { morning: false, afternoon: false },
        4: { morning: false, afternoon: false },
        5: { morning: false, afternoon: false },
        6: { morning: false, afternoon: false },
    });

    const days = [
        { id: 1, name: 'Thứ 2' }, { id: 2, name: 'Thứ 3' }, { id: 3, name: 'Thứ 4' },
        { id: 4, name: 'Thứ 5' }, { id: 5, name: 'Thứ 6' }, { id: 6, name: 'Thứ 7' }
    ];

    // Hàm xử lý khi tick vào checkbox
    const handleCheckboxChange = (dayId, shift) => {
        setSchedule(prev => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                [shift]: !prev[dayId][shift]
            }
        }));
    };

    // Hàm tìm ngày Thứ 2 của tuần tiếp theo
    const getNextMonday = () => {
        const d = new Date();
        d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
        return d.toISOString().split('T')[0];
    };

    // Gửi API lên Backend
    const submitSchedule = async (weeks) => {
        if (!doctorId) return alert('Lỗi: Không nhận diện được Bác sĩ. Vui lòng đăng nhập lại!');

        // Ép kiểu dữ liệu schedule về dạng Backend cần
        const schedule_pattern = {};
        for (let i = 1; i <= 6; i++) {
            schedule_pattern[i] = [];
            if (schedule[i].morning) schedule_pattern[i].push('morning');
            if (schedule[i].afternoon) schedule_pattern[i].push('afternoon');
        }

        const payload = {
            doctor_id: doctorId, 
            start_date: getNextMonday(), 
            weeks: weeks, 
            schedule_pattern: schedule_pattern
        };

        try {
            // 🔥 ĐÃ ĐỔI TỪ ADMIN SANG DOCTOR Ở ĐÂY
            const res = await api.post('/api/doctor/schedules/register', payload);
            alert(res.data.message);
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi đăng ký lịch!');
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-calendar-alt text-primary me-2"></i> Đăng ký Lịch làm việc
            </h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    
                    {/* THÔNG TIN BÁC SĨ ĐANG ĐĂNG NHẬP */}
                    <div className="d-flex align-items-center mb-4 p-3 bg-light rounded border">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px', fontSize: '20px'}}>
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div>
                            <h5 className="mb-1 fw-bold text-dark">BS. {user.username || 'Khách'}</h5>
                            <span className="text-muted small">Hãy chọn các ca khám bạn muốn làm việc bên dưới</span>
                        </div>
                    </div>

                    <div className="alert alert-info border-0 shadow-sm">
                        <i className="fas fa-info-circle me-2"></i> Lịch sẽ được tự động áp dụng bắt đầu từ <b>Thứ 2 tuần sau ({getNextMonday()})</b>.
                    </div>

                    {/* BẢNG TICK CHỌN LỊCH */}
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th width="20%">Ngày trong tuần</th>
                                    <th width="40%">Buổi Sáng (08:00 - 12:00)</th>
                                    <th width="40%">Buổi Chiều (13:00 - 17:00)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {days.map(day => (
                                    <tr key={day.id}>
                                        <td className="fw-bold">{day.name}</td>
                                        <td>
                                            <div className="form-check form-switch d-flex justify-content-center">
                                                <input className="form-check-input" type="checkbox" style={{width: '40px', height: '20px', cursor:'pointer'}}
                                                    checked={schedule[day.id].morning}
                                                    onChange={() => handleCheckboxChange(day.id, 'morning')}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-check form-switch d-flex justify-content-center">
                                                <input className="form-check-input" type="checkbox" style={{width: '40px', height: '20px', cursor:'pointer'}}
                                                    checked={schedule[day.id].afternoon}
                                                    onChange={() => handleCheckboxChange(day.id, 'afternoon')}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button onClick={() => submitSchedule(1)} className="btn btn-outline-primary me-3 px-4 py-2">
                            <i className="fas fa-calendar-week me-2"></i> Đăng ký cho Tuần sau
                        </button>
                        <button onClick={() => submitSchedule(4)} className="btn btn-primary px-4 py-2 shadow-sm">
                            <i className="fas fa-sync-alt me-2"></i> Lặp lại 4 tuần (Repeat Weekly)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ScheduleRegister;