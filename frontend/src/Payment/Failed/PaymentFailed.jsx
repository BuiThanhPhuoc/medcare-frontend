import { useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentFailed.css';

export default function PaymentFailed() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const transaction = searchParams.get('transaction');
    const message = searchParams.get('message') || 'Thanh toán thất bại';

    return (
        <div className="payment-result-container">
            <div className="failed-card">
                <div className="failed-icon">✕</div>
                <h1>Thanh Toán Thất Bại</h1>
                <p className="message">{message}</p>

                {transaction && (
                    <div className="transaction-info">
                        <p>
                            <span className="label">Mã giao dịch:</span>
                            <span className="value">{transaction}</span>
                        </p>
                    </div>
                )}

                <div className="action-buttons">
                    <button 
                        className="primary-button"
                        onClick={() => navigate(-1)}
                    >
                        Thử Lại
                    </button>
                    <button 
                        className="secondary-button"
                        onClick={() => navigate('/patient/dashboard')}
                    >
                        Về Bảng Điều Khiển
                    </button>
                </div>

                <div className="help-info">
                    <h4>💡 Mẹo:</h4>
                    <ul>
                        <li>Kiểm tra số dư tài khoản/thẻ của bạn</li>
                        <li>Đảm bảo thẻ/tài khoản không bị khóa</li>
                        <li>Thử lại với phương thức thanh toán khác</li>
                        <li>Liên hệ hỗ trợ khách hàng nếu vấn đề vẫn tiếp tục</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
