import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../lib/api';
import './ReceptionLabFees.css';

const ReceptionLabFees = () => {
    const [phone, setPhone] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid'); // 'unpaid', 'paid', 'all'
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Load tất cả danh sách lần đầu
    useEffect(() => {
        loadAllAppointments('unpaid');
    }, []);

    // Lấy tất cả danh sách (không có filter phone)
    const loadAllAppointments = async (status) => {
        setLoading(true);
        setIsSearching(false);
        try {
            const statusParam = status === 'all' ? '' : status;
            const res = await api.get('/api/lab/payment-by-phone', {
                params: {
                    paymentStatus: statusParam
                }
            });
            setAppointments(res.data.appointments || []);
            setPaymentStatus(status);
            setPhone('');
            setSelectedAppointment(null);
            setSummary(null);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Không tải được');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Tìm kiếm theo số điện thoại
    const searchByPhone = async (status) => {
        if (!phone.trim()) {
            toast.warning('Nhập số điện thoại để tìm kiếm');
            return;
        }
        setLoading(true);
        setIsSearching(true);
        try {
            const statusParam = status === 'all' ? '' : status;
            const res = await api.get('/api/lab/payment-by-phone', {
                params: {
                    phone: phone.trim(),
                    paymentStatus: statusParam
                }
            });
            setAppointments(res.data.appointments || []);
            setPaymentStatus(status);
            setSelectedAppointment(null);
            setSummary(null);
            if (res.data.appointments?.length === 0) {
                toast.info('Không tìm thấy lịch khám nào');
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Không tải được');
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // Chuyển đổi filter status (giữ nguyên search mode)
    const handleFilterChange = async (status) => {
        if (isSearching && phone.trim()) {
            // Nếu đang search, tìm lại với status mới
            setPaymentStatus(status);
            setLoading(true);
            try {
                const statusParam = status === 'all' ? '' : status;
                const res = await api.get('/api/lab/payment-by-phone', {
                    params: {
                        phone: phone.trim(),
                        paymentStatus: statusParam
                    }
                });
                setAppointments(res.data.appointments || []);
            } catch (e) {
                toast.error(e.response?.data?.message || 'Không tải được');
            } finally {
                setLoading(false);
            }
        } else {
            // Nếu không search, load tất cả với status mới
            loadAllAppointments(status);
        }
    };

    // Lấy chi tiết xét nghiệm của 1 lịch khám
    const fetchSummary = async (appointmentId) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/lab/payment-summary/${appointmentId}`);
            setSummary(res.data);
            setSelectedAppointment(appointmentId);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Không tải được');
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    // Xác nhận thanh toán
    const pay = async () => {
        if (!selectedAppointment) return;
        try {
            await api.post(`/api/lab/pay/${selectedAppointment}`);
            toast.success('Đã ghi nhận thanh toán xét nghiệm');
            fetchSummary(selectedAppointment); // Reload chi tiết
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi thanh toán');
        }
    };

    // In hóa đơn
    const printInvoice = () => {
        if (!summary || !selectedAppointment) return;

        const appointment = appointments.find(a => a.appointment_id === selectedAppointment);
        if (!appointment) return;

        const printWindow = window.open('', '_blank');
        const invoiceHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hóa đơn xét nghiệm</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .invoice { max-width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .header p { margin: 5px 0; font-size: 12px; color: #666; }
                    .info { display: flex; justify-content: space-between; margin: 15px 0; }
                    .info-col { flex: 1; }
                    .info-col label { font-weight: bold; }
                    .info-col p { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
                    td { padding: 10px; border-bottom: 1px solid #ddd; }
                    .total { font-weight: bold; font-size: 16px; text-align: right; padding: 15px 10px; }
                    .status { color: ${summary.unpaid_total > 0 ? '#dc3545' : '#28a745'}; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <h1>🏥 HÓA ĐƠN XÉT NGHIỆM</h1>
                        <p>Ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                    
                    <div class="info">
                        <div class="info-col">
                            <label>Bệnh nhân:</label>
                            <p>${appointment.patient_name}</p>
                            <label>SĐT:</label>
                            <p>${appointment.patient_phone}</p>
                        </div>
                        <div class="info-col">
                            <label>Lịch khám:</label>
                            <p>${new Date(appointment.appointment_date).toLocaleDateString('vi-VN')} ${appointment.appointment_time}</p>
                            <label>Số xét nghiệm:</label>
                            <p>${appointment.total_tests}</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Xét nghiệm</th>
                                <th style="text-align: center;">SL</th>
                                <th style="text-align: right;">Giá</th>
                                <th style="text-align: right;">Thành tiền</th>
                                <th style="text-align: center;">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${summary.items.map(it => `
                                <tr>
                                    <td>${it.test_name}</td>
                                    <td style="text-align: center;">${it.quantity}</td>
                                    <td style="text-align: right;">${Number(it.price).toLocaleString('vi-VN')}đ</td>
                                    <td style="text-align: right;">${(it.price * it.quantity).toLocaleString('vi-VN')}đ</td>
                                    <td style="text-align: center;" class="status">${it.payment_status === 'paid' ? '✅ Đã thanh toán' : '⏳ Chưa thanh toán'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total">
                        Còn phải thu: ${Number(summary.unpaid_total || 0).toLocaleString('vi-VN')}đ (${summary.unpaid_count} chỉ định)
                    </div>

                    <div class="footer">
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                    </div>
                </div>
                <script>
                    window.print();
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    return (
        <div className="rec-lab-fees">
            <h1>💰 Thu Phí Xét Nghiệm</h1>
            <p className="rec-lab-sub">Tìm kiếm bệnh nhân bằng số điện thoại hoặc xem danh sách tất cả</p>
            
            <div className="rec-lab-search">
                <input
                    type="text"
                    placeholder="Nhập số điện thoại (VD: 0912345678)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                />
                <button
                    className="search-btn"
                    onClick={() => searchByPhone(paymentStatus)}
                    disabled={loading}
                >
                    {loading ? '⏳...' : '🔍 Tìm kiếm'}
                </button>
                {isSearching && phone && (
                    <button
                        className="clear-btn"
                        onClick={() => loadAllAppointments(paymentStatus)}
                        disabled={loading}
                    >
                        ✕ Xóa tìm kiếm
                    </button>
                )}
            </div>

            {/* Filter buttons */}
            <div className="rec-lab-filters">
                <button
                    className={`filter-btn ${paymentStatus === 'unpaid' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('unpaid')}
                    disabled={loading}
                >
                    📍 Chưa thanh toán
                </button>
                <button
                    className={`filter-btn ${paymentStatus === 'paid' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('paid')}
                    disabled={loading}
                >
                    ✅ Đã thanh toán
                </button>
                <button
                    className={`filter-btn ${paymentStatus === 'all' ? 'active' : ''}`}
                    onClick={() => handleFilterChange('all')}
                    disabled={loading}
                >
                    📋 Tất cả
                </button>
            </div>

            {/* Danh sách lịch khám */}
            {appointments.length > 0 ? (
                <div className="rec-lab-list">
                    <h2>📋 Danh sách ({appointments.length})</h2>
                    <div className="appointment-cards">
                        {appointments.map((apt) => (
                            <div
                                key={apt.appointment_id}
                                className={`appointment-card ${selectedAppointment === apt.appointment_id ? 'selected' : ''}`}
                                onClick={() => fetchSummary(apt.appointment_id)}
                            >
                                <div className="apt-header">
                                    <strong>{apt.patient_name}</strong>
                                    <span className="apt-phone">{apt.patient_phone}</span>
                                </div>
                                <div className="apt-info">
                                    <div>📅 {new Date(apt.appointment_date).toLocaleDateString('vi-VN')} {apt.appointment_time}</div>
                                    <div>🧪 {apt.total_tests} xét nghiệm</div>
                                    {apt.unpaid_count > 0 && (
                                        <div className="apt-unpaid">
                                            💰 Chưa thu: <strong>{Number(apt.unpaid_amount || 0).toLocaleString('vi-VN')}đ</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <p style={{ fontSize: '1rem' }}>📭 Không có lịch khám nào</p>
                </div>
            )}

            {/* Chi tiết xét nghiệm */}
            {summary && (
                <div className="rec-lab-card">
                    <h2>🏥 Chi tiết xét nghiệm</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Xét nghiệm</th>
                                <th style={{ textAlign: 'center' }}>SL</th>
                                <th style={{ textAlign: 'right' }}>Giá</th>
                                <th style={{ textAlign: 'center' }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.items.map((it) => (
                                <tr key={it.id}>
                                    <td>{it.test_name}</td>
                                    <td style={{ textAlign: 'center' }}>{it.quantity}</td>
                                    <td style={{ textAlign: 'right' }}>{Number(it.price).toLocaleString('vi-VN')}đ</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className={`status-badge status-${it.payment_status}`}>
                                            {it.payment_status === 'paid' ? '✅ Đã TT' : '⏳ Chưa TT'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="rec-lab-total">
                        💼 Cần thu: <strong>{Number(summary.unpaid_total || 0).toLocaleString('vi-VN')}đ</strong> ({summary.unpaid_count} chỉ định)
                    </p>
                    <div className="rec-lab-actions">
                        <button
                            type="button"
                            className="rec-lab-pay"
                            onClick={pay}
                            disabled={!summary.unpaid_count || loading}
                        >
                            {loading ? '⏳...' : '✅ Xác nhận đã thu tiền'}
                        </button>
                        <button
                            type="button"
                            className="rec-lab-print"
                            onClick={printInvoice}
                            disabled={loading}
                        >
                            🖨️ In hóa đơn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionLabFees;
