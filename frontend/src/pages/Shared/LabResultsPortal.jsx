import { useEffect, useState, useMemo } from 'react';
import api from '../../lib/api';
import './LabResultsPortal.css';

const STATUS_LABEL = {
    pending: 'Chờ xử lý',
    'in-progress': 'Đang làm',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
};

export default function LabResultsPortal({ subtitle }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError('');
                const res = await api.get('/api/health/test-orders/portal', { params: { limit: 300 } });
                if (!cancelled) setOrders(res.data?.orders || []);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.message || e.message || 'Không tải được dữ liệu');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return orders;
        return orders.filter(
            (o) =>
                String(o.test_name || '').toLowerCase().includes(q) ||
                String(o.patient_name || '').toLowerCase().includes(q) ||
                String(o.doctor_name || '').toLowerCase().includes(q) ||
                String(o.test_code || '').toLowerCase().includes(q)
        );
    }, [orders, filter]);

    const formatMoney = (n) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(
            Number(n) || 0
        );

    return (
        <div className="lab-portal">
            <header className="lab-portal-hero">
                <h1 className="lab-portal-title">Kết quả &amp; chỉ định xét nghiệm</h1>
                <p className="lab-portal-sub">{subtitle}</p>
                <div className="lab-portal-search-wrap">
                    <i className="fas fa-magnifying-glass" aria-hidden />
                    <input
                        type="search"
                        className="lab-portal-search"
                        placeholder="Lọc theo tên xét nghiệm, bệnh nhân, bác sĩ…"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </header>

            {error && (
                <div className="lab-portal-alert" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="lab-portal-loading">Đang tải…</div>
            ) : filtered.length === 0 ? (
                <div className="lab-portal-empty">Không có chỉ định xét nghiệm nào.</div>
            ) : (
                <div className="lab-portal-table-wrap">
                    <table className="lab-portal-table">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Xét nghiệm</th>
                                <th>Bệnh nhân</th>
                                <th>Bác sĩ</th>
                                <th>Trạng thái</th>
                                <th>Kết quả</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((o) => (
                                <tr key={o.id}>
                                    <td>
                                        <span className="lab-portal-date">
                                            {o.appointment_date
                                                ? new Date(o.appointment_date).toLocaleDateString('vi-VN')
                                                : '—'}
                                        </span>
                                        {o.appointment_time && (
                                            <span className="lab-portal-time">{o.appointment_time}</span>
                                        )}
                                    </td>
                                    <td>
                                        <strong>{o.test_name}</strong>
                                        {o.test_code && <span className="lab-portal-code">{o.test_code}</span>}
                                    </td>
                                    <td>{o.patient_name || '—'}</td>
                                    <td>{o.doctor_name || '—'}</td>
                                    <td>
                                        <span className={`lab-portal-badge lab-portal-badge--${o.status || 'pending'}`}>
                                            {STATUS_LABEL[o.status] || o.status}
                                        </span>
                                    </td>
                                    <td className="lab-portal-result">{o.test_result || '—'}</td>
                                    <td>{formatMoney((Number(o.price) || 0) * (Number(o.quantity) || 1))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
