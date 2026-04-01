import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function PaymentFailed() {
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const message = searchParams.get('message') || 'Thanh toán VNPay thất bại!';
    const transaction = searchParams.get('transaction');
    const appointment = searchParams.get('appointment');
    const order = searchParams.get('order');
    const isDrugOrder = !!order;

    const backUrl = isDrugOrder 
        ? `/patient/orders/${order}`
        : appointment 
        ? `/billing/${appointment}`
        : '/billing';

    const mainUrl = isDrugOrder ? '/patient/medicines' : '/billing';
    const mainLabel = isDrugOrder ? 'Mua thuốc tiếp' : 'Quầy thu ngân';

    return (
        <div style={{ padding: 20 }}>
            <div style={{
                maxWidth: 720,
                margin: '40px auto',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: 30,
                textAlign: 'center'
            }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#b91c1c', marginBottom: 10 }}>
                    ✕ {message}
                </div>
                <div style={{ color: '#64748b', fontWeight: 700, marginBottom: 18 }}>
                    {transaction ? `Transaction: ${transaction}` : 'Không có mã giao dịch'}
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => navigate(backUrl)}
                        style={{
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: '1px solid #e2e8f0',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 900
                        }}
                    >
                        {isDrugOrder ? 'Thử lại' : 'Quay lại hóa đơn'}
                    </button>
                    <Link
                        to={mainUrl}
                        style={{ fontWeight: 900, color: '#4f46e5', textDecoration: 'none' }}
                    >
                        {mainLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}

