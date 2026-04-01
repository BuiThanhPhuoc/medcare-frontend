import { useState, useEffect } from 'react';
import api from '../../../lib/api';

/**
 * Component để lệ tân xem chi tiết đơn thuốc (từ bác sĩ kê)
 * Trước khi thực hiện thanh toán và cấp phát thuốc
 */
const PaymentWithDispensing = ({ appointmentId, patientName, onPaymentSuccess, onCancel }) => {
    const [prescription, setPrescription] = useState(null);
    const [dispense, setDispense] = useState(null);
    const [totalAmount, setTotalAmount] = useState('0');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // 1️⃣ LẤY DANH SÁCH THUỐC ĐƯỢC KỀ
    useEffect(() => {
        fetchPrescription();
    }, [appointmentId]);

    const fetchPrescription = async () => {
        try {
            setError(null);
            const res = await api.get(`/api/medicines/prescriptions/by-appointment/${appointmentId}`);
            if (res.data?.prescription) {
                setPrescription(res.data.prescription);
                calculateTotalPrice(res.data.items || []);
            }
        } catch (err) {
            console.error('Lỗi lấy đơn thuốc:', err);
            setError(err.response?.data?.message || 'Không thể lấy dữ liệu đơn thuốc');
        }
    };

    // 2️⃣ TÍNH TỔNG TIỀN TỪ ĐƠN THUỐC
    const calculateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => {
            return sum + (Number(item.price_at_time || 0) * Number(item.quantity || 0));
        }, 0);
        setTotalAmount(total.toString());
    };

    // 3️⃣ THỰC HIỆN THANH TOÁN & CẤP PHÁT THUỐC
    const handlePayment = async () => {
        if (!prescription) {
            setError('Chưa lấy được dữ liệu đơn thuốc');
            return;
        }

        const amount = Number(totalAmount);
        if (!Number.isFinite(amount) || amount <= 0) {
            setError('Số tiền thanh toán không hợp lệ');
            return;
        }

        if (!window.confirm(`Xác nhận thanh toán ${amount.toLocaleString('vi-VN')}đ cho bệnh nhân ${patientName}?\n\nSau thanh toán sẽ tự động cấp phát thuốc!`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Gọi API thanh toán (tự động cấp phát thuốc + update medicines)
            await api.post(`/api/payments/${appointmentId}`, {
                total_amount: amount,
                payment_method: paymentMethod || 'cash'
            });

            setSuccess('✅ Thanh toán thành công! Đã cấp phát thuốc và cập nhật kho.');
            
            // Lấy chi tiết cấp phát để hiển thị
            setTimeout(() => {
                fetchDispenseDetails();
                onPaymentSuccess?.();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi thanh toán');
            console.error('Lỗi thanh toán:', err);
        } finally {
            setLoading(false);
        }
    };

    // 4️⃣ LẤY CHI TIẾT CẤP PHÁT (HIỂN THỊ HÓA ĐƠN CHIẾT KHẤU)
    const fetchDispenseDetails = async () => {
        try {
            const res = await api.get(`/api/medicines/dispense/by-appointment/${appointmentId}`);
            setDispense(res.data);
        } catch (err) {
            console.error('Lỗi lấy chi tiết cấp phát:', err);
        }
    };

    return (
        <div className="payment-dispensing-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>💊 {patientName} - Thanh Toán & Cấp Phát Thuốc</h3>
                    <button className="btn-close" onClick={onCancel}>✕</button>
                </div>

                {/* THÔNG BÁO */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* XEM ĐƠN THUỐC ĐÃ KÊ */}
                {prescription && (
                    <div className="prescription-section">
                        <h4>📋 Đơn Thuốc Được Kê</h4>
                        <p><strong>Chẩn đoán:</strong> {prescription.diagnosis}</p>
                        
                        {prescription && prescription.items && prescription.items.length > 0 ? (
                            <table className="medicines-table">
                                <thead>
                                    <tr>
                                        <th>Tên Thuốc</th>
                                        <th>Liều Dùng</th>
                                        <th>Số Lượng</th>
                                        <th>Giá/Đơn Vị</th>
                                        <th>Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.drug_name}</td>
                                            <td>{item.dosage}</td>
                                            <td>{item.quantity}</td>
                                            <td>{Number(item.price_at_time || 0).toLocaleString('vi-VN')}đ</td>
                                            <td>{(Number(item.price_at_time || 0) * Number(item.quantity || 0)).toLocaleString('vi-VN')}đ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-items">Không có thuốc trong đơn kê.</p>
                        )}
                    </div>
                )}

                {/* XEM CHI TIẾT CẤP PHÁT (SAU KHI THANH TOÁN) */}
                {dispense && dispense.items && (
                    <div className="dispense-section">
                        <h4>✅ Chi Tiết Cấp Phát</h4>
                        <table className="medicines-table">
                            <thead>
                                <tr>
                                    <th>Tên Thuốc</th>
                                    <th>Lô</th>
                                    <th>Hạn Dùng</th>
                                    <th>Số Lượng Cấp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dispense.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.drug_name}</td>
                                        <td>{item.batch_number}</td>
                                        <td>{new Date(item.expiry_date).toLocaleDateString('vi-VN')}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* FORM THANH TOÁN */}
                {!dispense && (
                    <div className="payment-form">
                        <div className="form-group">
                            <label>💰 Tổng Tiền Thanh Toán:</label>
                            <input
                                type="number"
                                min="0"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                disabled={loading}
                            />
                            <span className="currency">đ</span>
                        </div>

                        <div className="form-group">
                            <label>💳 Phương Thức Thanh Toán:</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                disabled={loading}
                            >
                                <option value="cash">Tiền Mặt</option>
                                <option value="transfer">Chuyển Khoản</option>
                                <option value="card">Thẻ</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn-primary"
                                onClick={handlePayment}
                                disabled={loading || !prescription}
                            >
                                {loading ? '⏳ Đang xử lý...' : '✅ Thanh Toán & Cấp Phát'}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                ❌ Hủy
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .payment-dispensing-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 15px;
                }

                .btn-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }

                .btn-close:hover {
                    color: #333;
                }

                .alert {
                    padding: 12px 16px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    font-weight: 500;
                }

                .alert-error {
                    background: #ffe5e5;
                    color: #c92a2a;
                    border-left: 4px solid #c92a2a;
                }

                .alert-success {
                    background: #d3f9d8;
                    color: #2f5233;
                    border-left: 4px solid #51cf66;
                }

                .prescription-section, .dispense-section {
                    margin-bottom: 25px;
                }

                .prescription-section h4, .dispense-section h4 {
                    color: #333;
                    margin-bottom: 12px;
                    font-size: 16px;
                }

                .medicines-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                    font-size: 14px;
                }

                .medicines-table thead {
                    background: #f8f9fa;
                    border-bottom: 2px solid #dee2e6;
                }

                .medicines-table th {
                    padding: 10px;
                    text-align: left;
                    font-weight: 600;
                    color: #495057;
                }

                .medicines-table td {
                    padding: 10px;
                    border-bottom: 1px solid #dee2e6;
                }

                .medicines-table tbody tr:hover {
                    background: #f8f9fa;
                }

                .no-items {
                    text-align: center;
                    color: #999;
                    padding: 20px;
                    font-style: italic;
                }

                .payment-form {
                    border-top: 2px solid #f0f0f0;
                    padding-top: 20px;
                }

                .form-group {
                    margin-bottom: 15px;
                    position: relative;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 600;
                    color: #333;
                }

                .form-group input,
                .form-group select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    font-family: inherit;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                }

                .form-group input:disabled,
                .form-group select:disabled {
                    background: #f0f0f0;
                    color: #999;
                    cursor: not-allowed;
                }

                .currency {
                    position: absolute;
                    right: 12px;
                    top: 38px;
                    color: #666;
                    font-weight: 600;
                }

                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 25px;
                }

                .btn-primary, .btn-secondary {
                    flex: 1;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }

                .btn-primary:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .btn-secondary {
                    background: #f0f0f0;
                    color: #333;
                    border: 1px solid #ddd;
                }

                .btn-secondary:hover:not(:disabled) {
                    background: #e9e9e9;
                }

                .btn-secondary:disabled {
                    color: #999;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default PaymentWithDispensing;
