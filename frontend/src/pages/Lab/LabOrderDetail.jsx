import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../lib/api';
import './LabPages.css';

const LabOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api
            .get(`/api/lab/orders/${orderId}`)
            .then((res) => {
                setOrder(res.data.order);
                setResult(res.data.order.test_result || '');
            })
            .catch(() => toast.error('Không tải được chỉ định'))
            .finally(() => setLoading(false));
    }, [orderId]);

    const save = async () => {
        setSaving(true);
        try {
            await api.put(`/api/lab/orders/${orderId}/result`, {
                test_result: result,
                status: 'completed'
            });
            toast.success('Đã lưu kết quả');
            navigate('/lab-dashboard');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi lưu');
        } finally {
            setSaving(false);
        }
    };

    const doPrint = () => {
        window.print();
    };

    if (loading || !order) {
        return <div className="lab-dash p-4">Đang tải...</div>;
    }

    return (
        <div className="lab-order-page">
            <button type="button" className="btn-back-lab no-print" onClick={() => navigate('/lab-dashboard')}>
                ← Hàng chờ
            </button>

            <div id="lab-print-area" className="lab-print-sheet">
                <div className="lab-print-header">
                    <h1>PHIẾU KẾT QUẢ XÉT NGHIỆM</h1>
                    <p>MedCare — {new Date().toLocaleDateString('vi-VN')}</p>
                </div>
                <table className="lab-print-meta">
                    <tbody>
                        <tr>
                            <td>Bệnh nhân</td>
                            <td>
                                <strong>{order.patient_name}</strong> — {order.patient_phone}
                            </td>
                        </tr>
                        <tr>
                            <td>Ngày sinh / GT</td>
                            <td>
                                {order.date_of_birth || '—'} / {order.gender || '—'}
                            </td>
                        </tr>
                        <tr>
                            <td>Xét nghiệm</td>
                            <td>
                                {order.test_name} ({order.code})
                            </td>
                        </tr>
                        <tr>
                            <td>Tham chiếu</td>
                            <td>
                                {order.normal_range_min} — {order.normal_range_max} {order.unit || ''}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="lab-print-body">
                    <h3>Kết quả</h3>
                    <textarea
                        className="lab-result-input no-print"
                        rows={8}
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        placeholder="Nhập kết quả xét nghiệm..."
                    />
                    <pre className="lab-result-print only-print">{result || '—'}</pre>
                </div>
                <p className="lab-print-footer">Kỹ thuật viên: _________________</p>
            </div>

            <div className="lab-order-actions no-print">
                <button type="button" className="btn-print" onClick={doPrint}>
                    In phiếu
                </button>
                <button type="button" className="btn-save-lab" disabled={saving} onClick={save}>
                    {saving ? 'Đang lưu...' : 'Lưu kết quả & hoàn thành'}
                </button>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .only-print { display: block !important; }
                    .lab-print-sheet { box-shadow: none !important; }
                }
                .only-print { display: none; }
              `}</style>
        </div>
    );
};

export default LabOrderDetail;
