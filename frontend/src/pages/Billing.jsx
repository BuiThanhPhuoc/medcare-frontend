import { useState, useEffect } from 'react';
import axios from 'axios';
import './Billing.css';

const Billing = () => {
    const [unpaidList, setUnpaidList] = useState([]);

    const fetchUnpaidList = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/appointments/unpaid', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnpaidList(res.data.appointments);
        } catch (error) {
            console.error('Lỗi lấy danh sách chờ thanh toán:', error);
        }
    };

    useEffect(() => {
        fetchUnpaidList();
    }, []);

    const handlePayment = async (id, patientName) => {
        if (!window.confirm(`Xác nhận thu tiền của bệnh nhân ${patientName}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/appointments/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('💰 Đã thu tiền thành công!');
            fetchUnpaidList(); // Tải lại danh sách để làm mất bệnh nhân đã đóng tiền
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể thanh toán'));
        }
    };

    return (
        <div className="billing-container">
            <h2>💳 Quầy Thu Ngân - Chờ Thanh Toán</h2>
            
            <div className="billing-list">
                {unpaidList.length === 0 ? (
                    <p className="no-data">Hiện không có bệnh nhân nào chờ thanh toán.</p>
                ) : (
                    unpaidList.map(appt => (
                        <div key={appt.id} className="billing-card">
                            <div className="billing-info">
                                <h3>{appt.patient_name}</h3>
                                <p><strong>📞 SĐT:</strong> {appt.phone}</p>
                                <p><strong>🩺 Chẩn đoán:</strong> {appt.diagnosis || 'Đang cập nhật'}</p>
                                <p><strong>📅 Giờ khám:</strong> {appt.appointment_time} ({new Date(appt.appointment_date).toLocaleDateString('vi-VN')})</p>
                            </div>
                            
                            <div className="billing-action">
                                <div className="price-tag">
                                    <span>Tổng tiền:</span>
                                    {/* Giả lập giá tiền khám mặc định là 200k, fen có thể mở rộng tính tiền thuốc sau nếu thích */}
                                    <strong>200.000 đ</strong> 
                                </div>
                                <button className="btn-pay" onClick={() => handlePayment(appt.id, appt.patient_name)}>
                                    💵 Thu Tiền Ngay
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Billing;