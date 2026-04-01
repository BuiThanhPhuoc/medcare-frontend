import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import './DrugOrderDetail.css';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function DrugOrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const searchParams = new URLSearchParams(window.location.search);
    const isSuccess = searchParams.get('success');

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/drug-orders/${orderId}`);
                if (res.data?.success) {
                    setOrder(res.data.order);
                } else {
                    setError(res.data?.message || 'Không tải được đơn hàng');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi tải đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const handleCancel = async () => {
        if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;

        setActionLoading(true);
        try {
            const res = await api.put(`/api/drug-orders/${orderId}/cancel`);
            if (res.data?.success) {
                alert(res.data.message);
                // Reload order
                const orderRes = await api.get(`/api/drug-orders/${orderId}`);
                if (orderRes.data?.success) {
                    setOrder(orderRes.data.order);
                }
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi hủy đơn hàng');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePayVNPay = async () => {
        setActionLoading(true);
        try {
            const res = await api.post(`/api/drug-orders/${orderId}/create-vnpay-payment`);
            if (res.data?.success && res.data.paymentUrl) {
                window.location.href = res.data.paymentUrl;
            } else {
                alert(res.data?.message || 'Không tạo được yêu cầu thanh toán');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi tạo yêu cầu thanh toán');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="drug-order-detail-page">
                <div className="loading-state">
                    <div className="spinner-border text-primary" role="status" />
                    <p>Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="drug-order-detail-page">
                <div className="error-state">
                    <h3>Lỗi</h3>
                    <p>{error || 'Không tìm thấy đơn hàng'}</p>
                    <button onClick={() => navigate('/patient/medicines')} className="btn btn-primary">
                        ← Quay lại
                    </button>
                </div>
            </div>
        );
    }

    const orders_items = order.items || [];

    return (
        <div className="drug-order-detail-page">
            <div className="order-detail-container">
                {/* Header */}
                <div className="order-detail-header">
                    <div className="header-left">
                        <button
                            onClick={() => navigate('/patient/medicines')}
                            className="btn-back"
                        >
                            ← Quay lại
                        </button>
                        <div>
                            <h1>Chi tiết đơn hàng</h1>
                            <p className="order-number">#{order.id}</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <span className={`status-badge status-${order.order_status}`}>
                            {getOrderStatusText(order.order_status)}
                        </span>
                        {order.payment_method === 'vnpay' && (
                            <span className={`payment-badge payment-${order.payment_status}`}>
                                {getPaymentStatusText(order.payment_status)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Success Message */}
                {isSuccess && (
                    <div className="success-banner">
                        ✓ Đơn hàng tạo thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
                    </div>
                )}

                <div className="order-detail-grid">
                    {/* Main Content */}
                    <div className="order-detail-main">
                        {/* Order Info */}
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Thông tin đơn hàng</h3>
                            </div>
                            <div className="panel-body">
                                <div className="info-row">
                                    <span className="label">Ngày đặt:</span>
                                    <span className="value">
                                        {new Date(order.order_date).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Trạng thái đơn hàng:</span>
                                    <span className={`value status-text status-${order.order_status}`}>
                                        {getOrderStatusText(order.order_status)}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phương thức thanh toán:</span>
                                    <span className="value">
                                        {order.payment_method === 'cod' ? '💵 Tiền mặt (COD)' : '🏦 VNPay'}
                                    </span>
                                </div>
                                {order.payment_method !== 'cod' && (
                                    <div className="info-row">
                                        <span className="label">Trạng thái thanh toán:</span>
                                        <span className={`value status-text payment-${order.payment_status}`}>
                                            {getPaymentStatusText(order.payment_status)}
                                        </span>
                                    </div>
                                )}
                                <div className="info-row">
                                    <span className="label">Địa chỉ giao hàng:</span>
                                    <span className="value">{order.delivery_address}</span>
                                </div>
                                {order.notes && (
                                    <div className="info-row">
                                        <span className="label">Ghi chú:</span>
                                        <span className="value">{order.notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Danh sách thuốc</h3>
                            </div>
                            <div className="panel-body">
                                {orders_items.length === 0 ? (
                                    <p className="empty-message">Không có mục nào trong đơn hàng</p>
                                ) : (
                                    <div className="items-table">
                                        <div className="table-header">
                                            <div className="col-name">Tên thuốc</div>
                                            <div className="col-batch">Lô hàng</div>
                                            <div className="col-qty">Số lượng</div>
                                            <div className="col-price">Đơn giá</div>
                                            <div className="col-subtotal">Thành tiền</div>
                                        </div>
                                        {orders_items.map((item, idx) => (
                                            <div key={idx} className="table-row">
                                                <div className="col-name">
                                                    <div className="drug-name">{item.drug_name}</div>
                                                </div>
                                                <div className="col-batch">{item.batch_number}</div>
                                                <div className="col-qty">{item.quantity}</div>
                                                <div className="col-price">{formatVND(item.price_at_time)}</div>
                                                <div className="col-subtotal">
                                                    <strong>{formatVND(item.subtotal)}</strong>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="order-detail-sidebar">
                        {/* Total Panel */}
                        <div className="panel">
                            <div className="panel-header">
                                <h3>Tóm tắt</h3>
                            </div>
                            <div className="panel-body">
                                <div className="summary-row">
                                    <span>Tổng tiền:</span>
                                    <span className="amount">{formatVND(order.total_amount)}</span>
                                </div>
                                {order.payment_method === 'cod' && (
                                    <div className="cod-info">
                                        <p>Bạn sẽ thanh toán khi nhận hàng</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="actions-panel">
                            {/* Can Cancel */}
                            {['pending', 'confirmed'].includes(order.order_status) && (
                                <button
                                    onClick={handleCancel}
                                    disabled={actionLoading}
                                    className="btn btn-outline-danger btn-block"
                                >
                                    {actionLoading ? 'Đang xử lý...' : '✕ Hủy đơn hàng'}
                                </button>
                            )}

                            {/* VNPay Payment */}
                            {order.payment_method === 'vnpay' && order.payment_status === 'pending' && (
                                <button
                                    onClick={handlePayVNPay}
                                    disabled={actionLoading}
                                    className="btn btn-primary btn-block"
                                >
                                    {actionLoading ? 'Đang xử lý...' : '💳 Thanh toán VNPay'}
                                </button>
                            )}

                            {/* Back to Medicines */}
                            <button
                                onClick={() => navigate('/patient/medicines')}
                                className="btn btn-outline-primary btn-block"
                            >
                                🛒 Tiếp tục mua hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getOrderStatusText(status) {
    const map = {
        pending: '⏳ Chờ xác nhận',
        confirmed: '✓ Đã xác nhận',
        shipped: '📦 Đã gửi',
        delivered: '✓ Đã giao',
        cancelled: '✕ Đã hủy'
    };
    return map[status] || status;
}

function getPaymentStatusText(status) {
    const map = {
        pending: '⏳ Chờ thanh toán',
        completed: '✓ Đã thanh toán',
        failed: '✕ Thanh toán thất bại',
        cancelled: '✕ Đã hủy'
    };
    return map[status] || status;
}
