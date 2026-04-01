import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const [message] = useState('Thanh toán VNPay thành công!');

    const searchParams = new URLSearchParams(location.search);
    const appointment = searchParams.get('appointment');
    const order = searchParams.get('order');
    const isDrugOrder = !!order;

    useEffect(() => {
        // Auto chuyển về chi tiết đơn hàng hoặc hóa đơn
        const redirectUrl = isDrugOrder 
            ? `/patient/orders/${order}?success=true`
            : appointment 
            ? `/billing/${appointment}`
            : '/billing';
            
        const t = setTimeout(() => {
            navigate(redirectUrl);
        }, 900);
        return () => clearTimeout(t);
    }, [appointment, order, navigate, isDrugOrder]);

    const redirectUrl = isDrugOrder 
        ? `/patient/orders/${order}?success=true`
        : appointment 
        ? `/billing/${appointment}`
        : '/billing';

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
                <div style={{ fontSize: 22, fontWeight: 900, color: '#059669', marginBottom: 10 }}>
                    ✓ {message}
                </div>
                <div style={{ color: '#64748b', fontWeight: 700 }}>
                    Đang chuyển hướng...
                </div>
                <div style={{ marginTop: 18 }}>
                    <Link to={redirectUrl} style={{ fontWeight: 900 }}>
                        Bấm vào đây nếu không tự chuyển
                    </Link>
                </div>
            </div>
        </div>
    );
}

