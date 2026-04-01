import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BookAppointment.css';

const BookAppointment = () => {
    // State for specialties
    const [specialties, setSpecialties] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [specialtyLoading, setSpecialtyLoading] = useState(true);
    const [specialtyError, setSpecialtyError] = useState(null);
    
    // State for doctors (filtered by specialty)
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [doctorError, setDoctorError] = useState(null);
    
    // State for appointment details
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]); // Slots đã được đặt
    const [slotLoading, setSlotLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const navigate = useNavigate();

    // Danh sách các giờ làm việc (8:00 - 17:00, mỗi 30 phút)
    const timeSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // STEP 1: Fetch danh sách chuyên khoa
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                setSpecialtyLoading(true);
                setSpecialtyError(null);
                const res = await api.get('/api/appointments/specialties');
                if (res.data.specialties && res.data.specialties.length > 0) {
                    setSpecialties(res.data.specialties);
                } else {
                    setSpecialtyError('❌ Không có chuyên khoa nào!');
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách chuyên khoa:', error);
                const errorMsg = error.response?.data?.message || 'Không thể lấy danh sách chuyên khoa!';
                setSpecialtyError(errorMsg);
                toast.error(errorMsg);
            } finally {
                setSpecialtyLoading(false);
            }
        };
        fetchSpecialties();
    }, []);

    // STEP 2: Fetch danh sách bác sĩ khi chuyên khoa thay đổi
    useEffect(() => {
        if (selectedSpecialty) {
            fetchDoctorsBySpecialty();
        } else {
            setDoctors([]);
            setDoctorId('');
            setDate('');
            setTime('');
        }
    }, [selectedSpecialty]);

    const fetchDoctorsBySpecialty = async () => {
        try {
            setDoctorLoading(true);
            setDoctorError(null);
            const res = await api.get('/api/appointments/doctors', {
                params: { specialty: selectedSpecialty }
            });
            if (res.data.doctors && res.data.doctors.length > 0) {
                setDoctors(res.data.doctors);
                setDoctorId(res.data.doctors[0].id);
            } else {
                setDoctorError(`❌ Không có bác sĩ nào trong chuyên khoa ${selectedSpecialty}!`);
                setDoctors([]);
                setDoctorId('');
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách bác sĩ:', error);
            const errorMsg = error.response?.data?.message || 'Không thể lấy danh sách bác sĩ!';
            setDoctorError(errorMsg);
            toast.error(errorMsg);
            setDoctors([]);
        } finally {
            setDoctorLoading(false);
        }
    };

    // STEP 3: Lấy danh sách slots đã đặt khi chọn doctor hoặc date
    useEffect(() => {
        if (doctorId && date) {
            fetchBookedSlots();
        }
    }, [doctorId, date]);

    const fetchBookedSlots = async () => {
        try {
            setSlotLoading(true);
            const res = await api.get('/api/appointments/booked-slots', {
                params: {
                    doctor_id: doctorId,
                    appointment_date: date
                }
            });
            setBookedSlots(res.data.bookedTimes || []);
        } catch (error) {
            console.error('Lỗi lấy danh sách slots:', error);
            toast.error('Không thể tải giờ khám có sẵn');
            setBookedSlots([]);
        } finally {
            setSlotLoading(false);
        }
    };

    const isSlotBooked = (slotTime) => {
        return bookedSlots.includes(slotTime);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedSpecialty || !doctorId || !date || !time || !reason) {
            toast.error('⚠️ Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post('/api/appointments', {
                doctor_id: doctorId,
                appointment_date: date,
                appointment_time: time,
                reason: reason
            });

            toast.success('🎉 Đặt lịch khám thành công!');
            setTimeout(() => navigate('/patient-dashboard'), 1500);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Không thể đặt lịch';
            toast.error('❌ Lỗi: ' + errorMsg);
            console.error('Lỗi đặt lịch:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="book-appointment-container">
            <div className="book-form-wrapper">
                {/* SPECIALTY LOADING STATE */}
                {specialtyLoading && (
                    <div className="alert-modern alert-loading">
                        <div className="spinner-dot"></div>
                        <p>⏳ Đang tải danh sách chuyên khoa...</p>
                    </div>
                )}

                {/* SPECIALTY ERROR STATE */}
                {specialtyError && !specialtyLoading && (
                    <div className="alert-modern alert-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{specialtyError}</p>
                        <button 
                            type="button" 
                            className="btn-reload"
                            onClick={() => window.location.reload()}
                        >
                            🔄 Tải lại
                        </button>
                    </div>
                )}

                {/* DOCTOR ERROR STATE */}
                {doctorError && selectedSpecialty && (
                    <div className="alert-modern alert-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{doctorError}</p>
                    </div>
                )}

                {/* FORM - chỉ show khi không lỗi */}
                {!specialtyError && specialties.length > 0 && (
                <form className="book-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2>🗓️ Đặt Lịch Khám Bệnh</h2>
                        <p>Vui lòng chọn chuyên khoa → bác sĩ → ngày giờ khám</p>
                    </div>
                
                    {/* STEP 1: Chọn chuyên khoa */}
                    <div className="form-group">
                        <label>🏥 Chuyên Khoa: <span className="required">*</span></label>
                        <select 
                            value={selectedSpecialty} 
                            onChange={(e) => setSelectedSpecialty(e.target.value)} 
                            required
                            disabled={specialtyLoading}
                            className={selectedSpecialty ? 'selected' : ''}
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {specialties.map(spec => (
                                <option key={spec.id} value={spec.name}>{spec.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* STEP 2: Chọn bác sĩ (hiển thị khi đã chọn chuyên khoa) */}
                    {selectedSpecialty && (
                        <div className="form-group">
                            <label>👨‍⚕️ Bác Sĩ: <span className="required">*</span> {doctorLoading && <span className="spinner-border spinner-border-sm ms-2"></span>}</label>
                            <select 
                                value={doctorId} 
                                onChange={(e) => setDoctorId(e.target.value)} 
                                required
                                disabled={doctorLoading || doctors.length === 0}
                                className={doctorId ? 'selected' : ''}
                            >
                                <option value="">-- Chọn bác sĩ --</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                                ))}
                            </select>
                            {doctors.length === 0 && !doctorLoading && doctorError && <small className="text-danger">{doctorError}</small>}
                            {!doctorId && selectedSpecialty && <small className="text-muted">Vui lòng chọn bác sĩ</small>}
                        </div>
                    )}

                    {/* STEP 3: Chọn ngày (hiển thị khi đã chọn bác sĩ) */}
                    {doctorId && (
                        <div className="form-group">
                            <label>📅 Ngày Khám: <span className="required">*</span></label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                                disabled={!doctorId}
                                min={new Date().toISOString().split('T')[0]}
                                className={date ? 'selected' : ''}
                            />
                            {!date && <small className="text-muted">Vui lòng chọn ngày khám</small>}
                        </div>
                    )}

                    {/* STEP 4: Chọn giờ khám (hiển thị khi đã chọn ngày) */}
                    {doctorId && date ? (
                        <div className="form-group">
                            <label>🕐 Giờ Khám: <span className="required">*</span> {slotLoading && '⏳ Đang tải...'}</label>
                            <div className="time-slots-grid">
                                {timeSlots.map((slot) => {
                                    const isBooked = isSlotBooked(slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            className={`time-slot ${isBooked ? 'booked disabled' : ''} ${time === slot ? 'selected' : ''}`}
                                            onClick={() => !isBooked && setTime(slot)}
                                            disabled={isBooked || slotLoading}
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
                    ) : (
                        doctorId && (
                            <div className="alert-modern alert-loading">
                                <i className="fas fa-info-circle"></i>
                                <p>ℹ️ Vui lòng chọn ngày khám để xem giờ khám có sẵn</p>
                            </div>
                        )
                    )}

                    {/* STEP 5: Lý do khám */}
                    {time && (
                        <div className="form-group">
                            <label>📝 Lý Do / Triệu Chứng: <span className="required">*</span></label>
                            <textarea 
                                value={reason} 
                                onChange={(e) => setReason(e.target.value)} 
                                placeholder="Ví dụ: Đau đầu, sốt cao, khó ngủ..." 
                                required 
                                rows="4"
                                className={reason ? 'selected' : ''}
                            />
                        </div>
                    )}

                    {/* BUTTONS */}
                    <div className="button-group">
                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={!selectedSpecialty || !doctorId || !date || !time || !reason || isSubmitting}
                        >
                            {isSubmitting ? '⏳ Đang xử lý...' : '✅ Xác Nhận Đặt Lịch'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={() => navigate('/patient-dashboard')}
                            disabled={isSubmitting}
                        >
                            ❌ Hủy Bỏ
                        </button>
                    </div>

                    {/* PROGRESS INDICATOR */}
                    <div className="booking-progress">
                        <div className={`progress-item ${selectedSpecialty ? 'active' : ''}`}>
                            <span className="progress-number">1</span>
                            <span className="progress-label">Chuyên Khoa</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-item ${doctorId ? 'active' : ''}`}>
                            <span className="progress-number">2</span>
                            <span className="progress-label">Bác Sĩ</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-item ${date ? 'active' : ''}`}>
                            <span className="progress-number">3</span>
                            <span className="progress-label">Ngày</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-item ${time ? 'active' : ''}`}>
                            <span className="progress-number">4</span>
                            <span className="progress-label">Giờ</span>
                        </div>
                    </div>
                </form>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
