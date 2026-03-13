import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import '../CSS/Examine.css';

const Examine = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppt, setSelectedAppt] = useState(null); // Lưu lịch khám đang được chọn để khám
    
    // Form bệnh án
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [note, setNote] = useState('');

    // Hàm gọi API lấy danh sách bệnh nhân hôm nay của bác sĩ
    const fetchSchedule = async () => {
        try {
            const res = await api.get('/api/appointments/doctor-schedule');
            setAppointments(res.data.appointments);
        } catch (error) {
            console.error('Lỗi lấy lịch khám:', error);
        }
    };

    // Chạy fetchSchedule ngay khi bác sĩ vừa vào trang
    useEffect(() => {
        fetchSchedule();
    }, []);

    // Hàm Submit Bệnh Án
    const handleExamine = async (e) => {
        e.preventDefault();
        try {
            // Gọi API Lưu hồ sơ bệnh án (API này fen đã test OK bằng Thunder Client hồi trước)
            await api.post('/api/medical-records', {
                appointment_id: selectedAppt.id,
                diagnosis,
                prescription,
                note
            });

            alert('✅ Đã lưu hồ sơ bệnh án thành công!');
            
            // Khám xong thì reset form và load lại danh sách
            setSelectedAppt(null);
            setDiagnosis('');
            setPrescription('');
            setNote('');
            fetchSchedule(); 
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể lưu bệnh án'));
        }
    };

    return (
        <div className="examine-container">
            <h2>🩺 Lịch Khám Hôm Nay Của Bạn</h2>
            
            <div className="layout-grid">
                {/* CỘT TRÁI: Danh sách bệnh nhân */}
                <div className="list-section">
                    {appointments.length === 0 ? (
                        <p className="no-data">Hôm nay chưa có lịch khám nào.</p>
                    ) : (
                        appointments.map(appt => (
                            <div key={appt.id} className={`patient-card ${selectedAppt?.id === appt.id ? 'active' : ''}`}>
                                <h3>{appt.appointment_time} - {appt.patient_name}</h3>
                                <p><strong>Lý do:</strong> {appt.reason}</p>
                                <p><strong>Trạng thái:</strong> {appt.status === 'checked-in' ? '🟢 Đang đợi khám' : '⚪ ' + appt.status}</p>
                                
                                {/* Chỉ cho phép khám những ai đã check-in hoặc đang pending (tùy logic phòng khám) */}
                                {appt.status !== 'completed' && (
                                    <button 
                                        className="btn-select" 
                                        onClick={() => setSelectedAppt(appt)}
                                    >
                                        Khám bệnh nhân này
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* CỘT PHẢI: Form nhập bệnh án (Chỉ hiện khi bác sĩ bấm chọn 1 bệnh nhân) */}
                {selectedAppt && (
                    <div className="form-section">
                        <h3>📝 Viết Bệnh Án: {selectedAppt.patient_name}</h3>
                        <form onSubmit={handleExamine} className="medical-form">
                            <div className="form-group">
                                <label>Chẩn đoán bệnh:</label>
                                <input 
                                    type="text" 
                                    value={diagnosis} 
                                    onChange={(e) => setDiagnosis(e.target.value)} 
                                    required placeholder="VD: Viêm họng cấp..." 
                                />
                            </div>

                            <div className="form-group">
                                <label>Đơn thuốc (Toa thuốc):</label>
                                <textarea 
                                    value={prescription} 
                                    onChange={(e) => setPrescription(e.target.value)} 
                                    required placeholder="VD: Paracetamol 500mg x 10 viên..." 
                                />
                            </div>

                            <div className="form-group">
                                <label>Lời dặn của bác sĩ:</label>
                                <textarea 
                                    value={note} 
                                    onChange={(e) => setNote(e.target.value)} 
                                    placeholder="VD: Uống nhiều nước, kiêng đồ lạnh..." 
                                />
                            </div>

                            <div className="btn-group">
                                <button type="submit" className="btn-save">Lưu Bệnh Án & Hoàn Thành</button>
                                <button type="button" className="btn-cancel" onClick={() => setSelectedAppt(null)}>Hủy bỏ</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Examine;