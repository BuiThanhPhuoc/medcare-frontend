import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';
import './DoctorExamPages.css';

const Examine = () => {
    const [appointments, setAppointments] = useState([]);

    const fetchSchedule = async () => {
        try {
            const res = await api.get('/api/appointments/doctor-schedule');
            setAppointments(res.data.appointments || []);
        } catch (err) {
            console.error('Lỗi lấy lịch khám:', err);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    return (
        <div className="examine-queue-modern">
            <h2>Hàng đợi khám hôm nay</h2>
            <div className="ex-queue-grid">
                <div className="ex-patient-cards">
                    {appointments.length === 0 ? (
                        <p className="text-muted">Chưa có lịch khám nào hôm nay.</p>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="ex-card">
                                <h3>
                                    {appt.appointment_time?.slice(0, 5)} — {appt.patient_name}
                                </h3>
                                <p>
                                    <strong>Trạng thái:</strong>{' '}
                                    {appt.status === 'checked-in'
                                        ? 'Đang đợi khám'
                                        : appt.status === 'completed'
                                          ? 'Đã khám'
                                          : appt.status}
                                </p>
                                {appt.lab_workflow_status && appt.lab_workflow_status !== 'none' && (
                                    <p>
                                        <strong>Xét nghiệm:</strong> {appt.lab_workflow_status}
                                    </p>
                                )}
                                {appt.status === 'checked-in' || appt.status === 'completed' ? (
                                    <Link className="btn-open-record" to={`/doctor/examine/${appt.id}/write`}>
                                        Viết bệnh án →
                                    </Link>
                                ) : (
                                    <button type="button" className="btn-open-record" disabled>
                                        Chờ check-in
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="ex-queue-placeholder">
                    <div>
                        <p>Chọn bệnh nhân bên trái và mở <strong>Viết bệnh án</strong>.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            Trong trang bệnh án bạn có thể mở <strong>Khám sức khỏe</strong> và{' '}
                            <strong>Chỉ định xét nghiệm</strong> trên các trang riêng.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Examine;
