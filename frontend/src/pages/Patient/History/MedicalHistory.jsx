import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './MedicalHistory.css';

const MedicalHistory = () => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await api.get('/api/medical-records/my-records');
                setRecords(res.data.records);
            } catch (error) {
                console.error('Lỗi lấy bệnh án:', error);
            }
        };
        fetchRecords();
    }, []);

    // Hàm format ngày cho đẹp
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="history-container">
            <h2>📋 Lịch Sử Khám Bệnh & Đơn Thuốc Của Bạn</h2>
            
            <div className="records-list">
                {records.length === 0 ? (
                    <p className="no-data">Bạn chưa có hồ sơ bệnh án nào</p>
                ) : (
                    records.map((record, index) => (
                        <div key={record.id} className="record-card">
                            <div className="record-header">
                                <h3>Lần khám #{records.length - index} · {formatDate(record.appointment_date)}</h3>
                                <span className="doctor-badge">👨‍⚕️ {record.doctor_name}</span>
                            </div>
                            
                            <div className="record-body">
                                <div className="info-row">
                                    <strong>🩺 Chẩn đoán</strong>
                                    <p className="highlight-text">{record.diagnosis}</p>
                                </div>
                                
                                <div className="info-row">
                                    <strong>💊 Đơn thuốc</strong>
                                    <div className="prescription-box">
                                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                                            {record.prescription}
                                        </pre>
                                    </div>
                                </div>

                                {record.note && (
                                    <div className="info-row">
                                        <strong>📌 Lời dặn</strong>
                                        <p>{record.note}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MedicalHistory;
