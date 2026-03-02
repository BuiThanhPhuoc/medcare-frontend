import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookAppointment.css';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    
    const navigate = useNavigate();

    // Vừa vào trang là gọi API lấy ngay danh sách bác sĩ đổ vào ô Chọn
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/appointments/doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(res.data.doctors);
                
                // Mặc định chọn bác sĩ đầu tiên trong danh sách
                if (res.data.doctors.length > 0) {
                    setDoctorId(res.data.doctors[0].id);
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách bác sĩ:', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Gọi API Đặt lịch mà lúc trước fen đã test bằng Thunder Client
            await axios.post('http://localhost:5000/api/appointments', {
                doctor_id: doctorId,
                appointment_date: date,
                appointment_time: time,
                reason: reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('🎉 Đặt lịch khám thành công!');
            navigate('/'); // Đặt xong thì đá về Trang chủ
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể đặt lịch'));
        }
    };

    return (
        <div className="book-container">
            <form className="book-form" onSubmit={handleSubmit}>
                <h2>🗓️ Đặt Lịch Khám Bệnh</h2>
                
                <div className="form-group">
                    <label>Chọn Bác Sĩ:</label>
                    <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>Bác sĩ {doc.username}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Ngày khám:</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Giờ khám:</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
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
                    <button type="submit" className="submit-btn">Xác nhận Đặt lịch</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate('/')}>Hủy bỏ</button>
                </div>
            </form>
        </div>
    );
};

export default BookAppointment;