import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import './LabPages.css';

const LabDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [err, setErr] = useState(null);

    const load = () => {
        api
            .get('/api/lab/queue')
            .then((res) => setQueue(res.data.queue || []))
            .catch((e) => setErr(e.response?.data?.message || 'Lỗi tải hàng chờ'));
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="lab-dash">
            <div className="mc-dash-hero mb-3">
                <h2>Khu vực xét nghiệm</h2>
                <p>Xử lý chỉ định đã thanh toán và xem nhanh toàn bộ lịch sử XN.</p>
            </div>
            <div className="lab-header">
                <div>
                    <h1>Hàng chờ làm xét nghiệm</h1>
                    <p className="lab-dash-sub">Chỉ hiển thị chỉ định đã thanh toán tại lễ tân.</p>
                </div>
                <div className="lab-header-meta">
                    <span className="lab-count-badge">{queue.length} ca</span>
                    <Link to="/lab/all-results" className="btn btn-sm btn-outline-primary ms-2">
                        Danh sách tất cả XN
                    </Link>
                </div>
            </div>

            {err && <div className="lab-alert">{err}</div>}

            <div className="lab-card">
                <div className="lab-table-wrap">
                <table className="lab-table">
                    <thead>
                        <tr>
                            <th>BN</th>
                            <th>Xét nghiệm</th>
                            <th>Giờ hẹn</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-muted py-4">
                                    Không có chỉ định chờ xử lý
                                </td>
                            </tr>
                        ) : (
                            queue.map((row) => (
                                <tr key={row.order_id}>
                                    <td>
                                        <strong>{row.patient_name}</strong>
                                        <br />
                                        <small>{row.patient_phone}</small>
                                    </td>
                                    <td>
                                        {row.test_name} <small className="text-muted">({row.code})</small>
                                    </td>
                                    <td>
                                        {row.appointment_date} {String(row.appointment_time).slice(0, 5)}
                                    </td>
                                    <td>
                                        {(() => {
                                            const st = String(row.status || '').toLowerCase();
                                            const label =
                                                st === 'pending'
                                                    ? 'Chờ xử lý'
                                                    : st === 'in-progress'
                                                      ? 'Đang xử lý'
                                                      : row.status;
                                            const tone =
                                                st === 'pending'
                                                    ? 'pending'
                                                    : st === 'in-progress'
                                                      ? 'progress'
                                                      : 'unknown';
                                            return <span className={`lab-status-pill lab-status-pill--${tone}`}>{label}</span>;
                                        })()}
                                    </td>
                                    <td>
                                        <Link className="lab-link lab-link-btn" to={`/lab/order/${row.order_id}`}>
                                            Nhập KQ
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default LabDashboard;
