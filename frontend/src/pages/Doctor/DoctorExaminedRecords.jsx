import { useEffect, useState } from 'react';
import api from '../../lib/api';
import '../Shared/LabResultsPortal.css';

export default function DoctorExaminedRecords() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/medical-records/doctor/examined');
                if (!cancelled) setRecords(res.data?.records || []);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.message || e.message || 'Không tải được danh sách');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="lab-portal">
            <header className="lab-portal-hero">
                <h1 className="lab-portal-title">Bệnh án đã khám</h1>
                <p className="lab-portal-sub">
                    Danh sách bệnh nhân đã hoàn tất khám và có hồ sơ bệnh án do bạn phụ trách.
                </p>
            </header>

            {error && (
                <div className="lab-portal-alert" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="lab-portal-loading">Đang tải…</div>
            ) : records.length === 0 ? (
                <div className="lab-portal-empty">Chưa có ca khám hoàn tất nào có bệnh án.</div>
            ) : (
                <div className="lab-portal-table-wrap">
                    <table className="lab-portal-table">
                        <thead>
                            <tr>
                                <th>Ngày khám</th>
                                <th>Bệnh nhân</th>
                                <th>Chẩn đoán</th>
                                <th>Toa thuốc / đơn</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((r) => (
                                <tr key={r.record_id}>
                                    <td>
                                        <span className="lab-portal-date">
                                            {r.appointment_date
                                                ? new Date(r.appointment_date).toLocaleDateString('vi-VN')
                                                : '—'}
                                        </span>
                                        {r.appointment_time && (
                                            <span className="lab-portal-time">{r.appointment_time}</span>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{r.patient_name || r.patient_username || '—'}</strong>
                                    </td>
                                    <td className="lab-portal-result">{r.diagnosis || '—'}</td>
                                    <td className="lab-portal-result">{r.prescription || '—'}</td>
                                    <td className="lab-portal-result">{r.note || '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
