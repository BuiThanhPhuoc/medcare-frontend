import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import '../CSS/BookAppointment.css';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]); // Slots đã được đặt
    const [loading, setLoading] = useState(false);
    const [doctorLoading, setDoctorLoading] = useState(true);
    const [doctorError, setDoctorError] = useState(null);
    
    const navigate = useNavigate();

    // Danh sách các giờ làm việc (8:00 - 17:00, mỗi 30 phút)
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Lấy danh sách bác sĩ
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setDoctorLoading(true);
                setDoctorError(null);
                const res = await api.get('/api/appointments/doctors');
                console.log('Doctors response:', res.data); // Debug log
                if (res.data.doctors && res.data.doctors.length > 0) {
                    setDoctors(res.data.doctors);
                    setDoctorId(res.data.doctors[0].id);
                } else {
                    setDoctorError('❌ Không có bác sĩ nào đang hoạt động!');
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách bác sĩ:', error);
                const errorMsg = error.response?.data?.message || error.message || 'Không thể lấy danh sách bác sĩ!';
                setDoctorError(errorMsg);
                setDoctors([]);
            } finally {
                setDoctorLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Lấy danh sách slots đã đặt khi chọn doctor hoặc date
    useEffect(() => {
        if (doctorId && date) {
            fetchBookedSlots();
        }
    }, [doctorId, date]);

    const fetchBookedSlots = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/appointments/booked-slots', {
                params: {
                    doctor_id: doctorId,
                    appointment_date: date
                }
            });
            setBookedSlots(res.data.bookedTimes || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách slots:', error);
            setBookedSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const isSlotBooked = (slotTime) => {
        return bookedSlots.includes(slotTime);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/appointments', {
                doctor_id: doctorId,
                appointment_date: date,
                appointment_time: time,
                reason: reason
            });

            alert('🎉 Đặt lịch khám thành công!');
            navigate('/patient-dashboard');
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể đặt lịch'));
        }
    };

    return (
        <div className="book-container">
            {/* LOADING STATE */}
            {doctorLoading && (
                <div className="alert alert-info">
                    <p>⏳ Đang tải danh sách bác sĩ...</p>
                </div>
            )}

            {/* ERROR STATE */}
            {doctorError && (
                <div className="alert alert-danger">
                    <p>❌ {doctorError}</p>
                    <button 
                        type="button" 
                        className="btn btn-sm btn-warning mt-2"
                        onClick={() => window.location.reload()}
                    >
                        🔄 Tải lại
                    </button>
                </div>
            )}

            {/* FORM - chỉ show khi không lỗi */}
            {!doctorError && (
            <form className="book-form" onSubmit={handleSubmit}>
                <h2>🗓️ Đặt Lịch Khám Bệnh</h2>
                
                <div className="form-group">
                    <label>Chọn Bác Sĩ: {doctorLoading && <span className="spinner-border spinner-border-sm ms-2"></span>}</label>
                    <select 
                        value={doctorId} 
                        onChange={(e) => setDoctorId(e.target.value)} 
                        required
                        disabled={doctorLoading || doctors.length === 0}
                    >
                        <option value="">-- Chọn bác sĩ --</option>
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>Bác sĩ {doc.username}</option>
                        ))}
                    </select>
                    {doctors.length === 0 && !doctorLoading && <small className="text-danger">Không có bác sĩ nào đang hoạt động</small>}
                </div>

                <div className="form-group">
                    <label>Ngày khám:</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required 
                    />
                </div>

                {/* TIME SLOTS PICKER */}
                <div className="form-group">
                    <label>Giờ khám: {loading && '⏳ Đang tải...'}</label>
                    <div className="time-slots-grid">
                        {timeSlots.map((slot) => {
                            const isBooked = isSlotBooked(slot);
                            return (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`time-slot ${isBooked ? 'booked disabled' : ''} ${time === slot ? 'selected' : ''}`}
                                    onClick={() => !isBooked && setTime(slot)}
                                    disabled={isBooked}
                                    title={isBooked ? 'Slot này đã được đặt' : 'Click để chọn'}
                                >
                                    {slot}
                                    {isBooked && <span className="badge">Đã đặt</span>}
                                </button>
                            );
                        })}
                    </div>
                    {!time && <p className="error-msg">⚠️ Vui lòng chọn giờ khám</p>}
                </div>

                <div className="form-group">
                    <label>Lý do / Triệu chứng:</label>
                    <textarea 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        placeholder="Ví dụ: Đau đầu, sốt cao..." 
                        required 
                    />
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-btn" disabled={!time || doctorLoading}>Xác nhận Đặt lịch</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/patient-dashboard')}>Hủy bỏ</button>
                </div>
            </form>
            )}
        </div>
    );
};

export default BookAppointment;