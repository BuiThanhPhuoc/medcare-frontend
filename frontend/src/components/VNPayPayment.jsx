import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import './VNPayPayment.css';

export default function VNPayPayment() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!amount || amount <= 0) {
                setError('Vui lòng nhập số tiền hợp lệ');
                setLoading(false);
                return;
            }

            // Gọi API tạo yêu cầu thanh toán VNPay
            const response = await api.post('/api/payments/vnpay/create', {
                appointment_id: parseInt(appointmentId),
                amount: parseFloat(amount)
            });

            if (response.data.success) {
                // Chuyển hướng đến VNPay payment gateway
                window.location.href = response.data.paymentUrl;
            } else {
                setError(response.data.message || 'Không thể tạo yêu cầu thanh toán');
            }
        } catch (err) {
            console.error('Lỗi thanh toán:', err);
            setError(err.response?.data?.message || 'Lỗi khi tạo yêu cầu thanh toán');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vnpay-payment-container">
            <div className="payment-card">
                <h2>Thanh Toán VNPay</h2>
                <p className="appointment-info">Lịch khám #{appointmentId}</p>

                {error && <div className="error-message">⚠️ {error}</div>}

                <form onSubmit={handleCreatePayment}>
                    <div className="form-group">
                        <label htmlFor="amount">Số Tiền Thanh Toán (VNĐ)</label>
                        <input
                            type="number"
                            id="amount"
                            placeholder="Nhập số tiền..."
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1000"
                            step="1000"
                            required
                            disabled={loading}
                        />
                        {amount && (
                            <p className="amount-display">
                                {parseInt(amount).toLocaleString('vi-VN')} VNĐ
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="pay-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
                    </button>

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Quay Lại
                    </button>
                </form>

                <div className="payment-info">
                    <h4>💡 Phương thức thanh toán VNPay:</h4>
                    <ul>
                        <li>Thẻ tín dụng/ghi nợ</li>
                        <li>Internet Banking</li>
                        <li>Ví điện tử (Momo, Zalo Pay, ...)</li>
                        <li>QRCODE</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
