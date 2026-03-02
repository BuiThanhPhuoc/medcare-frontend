import { useState } from 'react';
import axios from 'axios';
import './Reception.css';

const Reception = () => {
    const [phone, setPhone] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Hàm gọi API tìm kiếm lịch khám theo SĐT
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setErrorMessage('');
        setAppointments([]);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/appointments/search?phone=${phone}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.appointments.length === 0) {
                setErrorMessage('Không tìm thấy lịch khám nào trong hôm nay với SĐT này.');
            } else {
                setAppointments(res.data.appointments);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Lỗi tìm kiếm!');
        }
    };

    // Hàm gọi API Check-in cho bệnh nhân
    const handleCheckIn = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${id}/checkin`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Check-in thành công! Bệnh nhân có thể vào phòng khám.');
            
            // Tải lại danh sách sau khi check-in để cập nhật trạng thái
            handleSearch();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể check-in'));
        }
    };

    return (
        <div className="reception-container">
            <h2>👩‍💻 Quầy Lễ Tân - Check-in Bệnh Nhân</h2>
            
            <form className="search-box" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Nhập số điện thoại bệnh nhân..." 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <button type="submit" className="btn-search">🔍 Tìm kiếm</button>
            </form>

            {errorMessage && <p className="error-msg">{errorMessage}</p>}

            <div className="result-list">
                {appointments.map(appt => (
                    <div key={appt.id} className={`appt-card ${appt.status === 'checked-in' ? 'checked-in' : ''}`}>
                        <div className="appt-info">
                            <h3>{appt.appointment_time} - {appt.patient_name}</h3>
                            <p><strong>SĐT:</strong> {appt.phone}</p>
                            <p><strong>Trạng thái:</strong> {appt.status === 'checked-in' ? '🟢 Đã Check-in' : '⚪ ' + appt.status}</p>
                        </div>
                        
                        <div className="appt-action">
                            {/* Chỉ hiện nút Check-in nếu trạng thái đang là pending */}
                            {appt.status === 'pending' && (
                                <button className="btn-checkin" onClick={() => handleCheckIn(appt.id)}>
                                    Bấm Check-in ngay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reception;