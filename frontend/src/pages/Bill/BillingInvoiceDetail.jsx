import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../lib/api';
import './BillingInvoiceDetail.css';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function BillingInvoiceDetail() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [appointment, setAppointment] = useState(null);
    const [drugTotal, setDrugTotal] = useState(0);
    const [labSummary, setLabSummary] = useState(null);

    const [payLoading, setPayLoading] = useState(false);
    const [notice, setNotice] = useState(null);

    const examFee = 200000;

    const testTotal = useMemo(() => {
        if (!labSummary) return 0;
        return Number(labSummary.unpaid_total || 0);
    }, [labSummary]);

    const totalAmount = useMemo(() => {
        return examFee + Number(drugTotal || 0) + Number(testTotal || 0);
    }, [drugTotal, testTotal]);

    const isPaid = appointment?.payment_status === 'paid';

    const load = async () => {
        try {
            setLoading(true);
            setError('');
            setNotice(null);

            const [apptRes, presRes, labRes] = await Promise.all([
                api.get(`/api/appointments/billing/${appointmentId}`),
                api.get(`/api/medicines/prescriptions/by-appointment/${appointmentId}`),
                api.get(`/api/lab/payment-summary/${appointmentId}`).catch(() => ({ data: null }))
            ]);

            setAppointment(apptRes.data?.appointment || null);
            const items = presRes.data?.items || [];
            const total = items.reduce((sum, it) => sum + Number(it.price_at_time || 0) * Number(it.quantity || 0), 0);
            setDrugTotal(total);
            setLabSummary(labRes.data || null);
        } catch (e) {
            setError(e.response?.data?.message || 'Không tải được hóa đơn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const handlePay = async () => {
        if (isPaid) return;
        if (!window.confirm(`Xác nhận thu ${formatVND(totalAmount)} cho bệnh nhân ${appointment?.patient_name || ''}?`)) return;

        setPayLoading(true);
        try {
            setNotice(null);
            await api.post(`/api/payments/${appointmentId}`, {
                total_amount: totalAmount,
                payment_method: 'cash'
            });
            setNotice({ type: 'success', text: 'Đã thu tiền (kèm tiền thuốc & xét nghiệm nếu có) thành công!' });
            await load();
        } catch (e) {
            setNotice({ type: 'error', text: e.response?.data?.message || 'Không thể thanh toán.' });
        } finally {
            setPayLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="billing-invoice-detail-page">
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status" />
                    <div>Đang tải...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="billing-invoice-detail-page">
                <div className="error-state">
                    <div className="error-title">Lỗi</div>
                    <div className="error-text">{error}</div>
                    <button className="btn-back-link" onClick={() => navigate('/billing')}>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="billing-invoice-detail-page">
                <div className="error-state">
                    <div className="error-title">Không tìm thấy</div>
                    <div className="error-text">Không có hóa đơn cho ca khám này.</div>
                    <button className="btn-back-link" onClick={() => navigate('/billing')}>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    const paidBadge = isPaid ? 'Đã thu' : 'Chưa thu';

    const formattedAppointmentDate = appointment.appointment_date
        ? new Date(appointment.appointment_date).toLocaleDateString('vi-VN')
        : '';

    return (
        <div className="billing-invoice-detail-page">
            <div className="billing-invoice-detail-header">
                <div className="left">
                    <Link className="back-link" to="/billing">
                        ← Quay lại
                    </Link>
                    <h2>Chi tiết hóa đơn</h2>
                    <div className="sub">#HĐ{appointment.id}</div>
                </div>
                <div className="right">
                    <span className={`status-pill ${isPaid ? 'status-paid' : 'status-unpaid'}`}>{paidBadge}</span>
                </div>
            </div>

            <div className="billing-invoice-detail-grid">
                <div className="panel">
                    <div className="panel-header">
                        <h3>Thông tin bệnh nhân</h3>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <span className="label">Tên:</span>
                            <span className="value">{appointment.patient_name}</span>
                        </div>
                        <div className="row">
                            <span className="label">SĐT:</span>
                            <span className="value">{appointment.patient_phone || ''}</span>
                        </div>
                        <div className="row">
                            <span className="label">Ngày khám:</span>
                            <span className="value">
                                {formattedAppointmentDate} {appointment.appointment_time ? `lúc ${appointment.appointment_time}` : ''}
                            </span>
                        </div>
                        <div className="row">
                            <span className="label">Bác sĩ:</span>
                            <span className="value">{appointment.doctor_name}</span>
                        </div>
                        <div className="row">
                            <span className="label">Chẩn đoán:</span>
                            <span className="value">{appointment.diagnosis || 'Đang cập nhật'}</span>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <h3>Chi tiêu</h3>
                    </div>
                    <div className="panel-body">
                        <div className="fee-line">
                            <div className="fee-left">
                                <div className="fee-title">Phí khám bệnh</div>
                            </div>
                            <div className="fee-right">
                                <div className="fee-amount">{formatVND(examFee).replace(' ₫', '')} </div>
                                <span className={`fee-status ${isPaid ? 'paid' : 'unpaid'}`}>{isPaid ? 'Đã thu' : 'Chưa thu'}</span>
                            </div>
                        </div>

                        <div className="fee-line">
                            <div className="fee-left">
                                <div className="fee-title">Tổng tiền thuốc</div>
                            </div>
                            <div className="fee-right">
                                <div className="fee-amount">{formatVND(drugTotal)}</div>
                                <span className={`fee-status ${isPaid ? 'paid' : 'unpaid'}`}>{isPaid ? 'Đã thu' : 'Chưa thu'}</span>
                            </div>
                        </div>

                        <div className="fee-line fee-line-warning">
                            <div className="fee-left">
                                <div className="fee-title">Dịch vụ khác (tiền xét nghiệm)</div>
                            </div>
                            <div className="fee-right">
                                <div className="fee-amount">{formatVND(testTotal)}</div>
                                <span className={`fee-status ${isPaid ? 'paid' : 'unpaid'}`}>{isPaid ? 'Đã thu' : 'Chưa thu'}</span>
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="fee-total">
                            <div className="fee-title">Tổng cộng</div>
                            <div className="fee-amount">{formatVND(totalAmount)}</div>
                        </div>
                    </div>
                </div>

                <div className="panel panel-wide">
                    <div className="panel-header">
                        <h3>Thanh toán</h3>
                    </div>
                    <div className="panel-body">
                        <div className="payment-methods">
                            <div className="payment-method-info">
                                <h4>💵 Phương thức: Tiền mặt (Thu ngân)</h4>
                                <p>Nhân viên lễ tân sẽ thu tiền trực tiếp kèm các khoản phí thuốc và xét nghiệm.</p>
                            </div>
                        </div>

                        {notice && (
                            <div className={`notice ${notice.type === 'success' ? 'notice-success' : 'notice-error'}`}>
                                {notice.text}
                            </div>
                        )}

                        <div className="payment-actions">
                            <button
                                type="button"
                                className="pay-btn"
                                onClick={handlePay}
                                disabled={isPaid || payLoading}
                            >
                                {payLoading ? 'Đang xử lý...' : isPaid ? 'Đã thu rồi' : 'Thu tiền ngay'}
                            </button>
                        </div>

                        <div className="hint">
                            Tiền mặt sẽ tự động mark xét nghiệm là đã thanh toán và cấp phát thuốc.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

