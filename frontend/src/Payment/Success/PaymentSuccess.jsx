import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const transaction = searchParams.get('transaction');
    const appointmentId = searchParams.get('appointment');

    useEffect(() => {
        // Tự động chuyển hướng sau 5 giây
        const timer = setTimeout(() => {
            navigate(`/patient/appointments/${appointmentId}`);
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate, appointmentId]);

    return (
        <div className="payment-result-container">
            <div className="success-card">
                <div className="success-icon">✓</div>
                <h1>Thanh Toán Thành Công!</h1>
                <p className="message">
                    Thanh toán của bạn đã được xử lý thành công. 
                    Cảm ơn đã sử dụng dịch vụ của chúng tôi.
                </p>

                <div className="transaction-info">
                    {transaction && (
                        <p>
                            <span className="label">Mã giao dịch:</span>
                            <span className="value">{transaction}</span>
                        </p>
                    )}
                    {appointmentId && (
                        <p>
                            <span className="label">Lịch khám:</span>
                            <span className="value">#{appointmentId}</span>
                        </p>
                    )}
                </div>

                <div className="action-buttons">
                    <button 
                        className="primary-button"
                        onClick={() => navigate(`/patient/appointments/${appointmentId}`)}
                    >
                        Xem Chi Tiết Lịch Khám
                    </button>
                    <button 
                        className="secondary-button"
                        onClick={() => navigate('/patient/dashboard')}
                    >
                        Về Bảng Điều Khiển
                    </button>
                </div>

                <p className="redirect-message">
                    Sẽ tự động chuyển hướng trong 5 giây...
                </p>
            </div>
        </div>
    );
}
