import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './AdminDrugOrders.css';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

const getPaymentStatusColor = (status) => {
    switch (status) {
        case 'paid':
            return 'badge-success';
        case 'unpaid':
            return 'badge-warning';
        case 'pending_cod':
            return 'badge-info';
        case 'cancelled':
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
};

const getPaymentStatusLabel = (status) => {
    switch (status) {
        case 'paid':
            return '✓ Đã thanh toán';
        case 'unpaid':
            return '⏳ Chờ thanh toán';
        case 'pending_cod':
            return '💵 Chờ xác nhận COD';
        case 'cancelled':
            return '✕ Đã hủy';
        default:
            return status;
    }
};

const getShippingStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'badge-secondary';
        case 'shipping':
            return 'badge-primary';
        case 'delivered':
            return 'badge-success';
        case 'returned':
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
};

const getShippingStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return '📋 Chờ xử lý';
        case 'shipping':
            return '📦 Đang giao';
        case 'delivered':
            return '✓ Đã giao';
        case 'returned':
            return '↩ Trả hàng';
        default:
            return status;
    }
};

const getPaymentMethodColor = (method) => {
    switch (method) {
        case 'cod':
            return 'badge-warning';  // Warning color for COD
        case 'vnpay':
            return 'badge-primary';  // Primary color for VNPay
        default:
            return 'badge-secondary';
    }
};

const getPaymentMethodLabel = (method) => {
    switch (method) {
        case 'cod':
            return 'COD';
        case 'vnpay':
            return 'VNPay';
        default:
            return method;
    }
};

export default function AdminDrugOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [shippingStatusFilter, setShippingStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({ total: 0, pages: 1 });

    const [actionLoading, setActionLoading] = useState(null);

    const loadOrders = async (pageNum = 1) => {
        try {
            setLoading(true);
            setError('');

            const params = { page: pageNum, limit: 20 };
            if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
            if (shippingStatusFilter) params.shipping_status = shippingStatusFilter;

            const res = await api.get('/api/admin/drug-orders', { params });

            if (res.data?.success) {
                setOrders(res.data.orders || []);
                setPageInfo(res.data.pagination || { total: 0, pages: 1 });
                setPage(pageNum);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không tải được danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentStatusFilter, shippingStatusFilter]);

    const handleConfirmCODPayment = async (orderId) => {
        if (!window.confirm('Xác nhận đã nhận tiền COD cho đơn hàng này?')) {
            return;
        }

        setActionLoading(orderId);
        try {
            const res = await api.patch(`/api/admin/drug-orders/${orderId}/confirm-payment`, {});
            if (res.data?.success) {
                setSuccessMessage('✓ Xác nhận thanh toán COD thành công');
                loadOrders(page);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi xác nhận thanh toán');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateShippingStatus = async (orderId, newStatus) => {
        setActionLoading(orderId);
        try {
            const res = await api.patch(`/api/admin/drug-orders/${orderId}/status`, {
                shipping_status: newStatus
            });
            if (res.data?.success) {
                setSuccessMessage(`✓ Cập nhật trạng thái giao hàng thành công`);
                loadOrders(page);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="admin-drug-orders-page">
            <div className="orders-container">
                {/* Header */}
                <div className="orders-header">
                    <h1>💊 Quản lý đơn hàng thuốc</h1>
                    <p>Quản lý tất cả các đơn hàng thuốc từ bệnh nhân</p>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="payment-status-filter">Trạng thái thanh toán:</label>
                        <select
                            id="payment-status-filter"
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả</option>
                            <option value="paid">✓ Đã thanh toán</option>
                            <option value="unpaid">⏳ Chờ thanh toán</option>
                            <option value="pending_cod">💵 Chờ xác nhận COD</option>
                            <option value="cancelled">✕ Đã hủy</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="shipping-status-filter">Trạng thái giao hàng:</label>
                        <select
                            id="shipping-status-filter"
                            value={shippingStatusFilter}
                            onChange={(e) => setShippingStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">📋 Chờ xử lý</option>
                            <option value="shipping">📦 Đang giao</option>
                            <option value="delivered">✓ Đã giao</option>
                            <option value="returned">↩ Trả hàng</option>
                        </select>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner-border text-primary" role="status" />
                        <p>Đang tải danh sách đơn hàng...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <p>Không có đơn hàng nào</p>
                    </div>
                ) : (
                    <>
                        {/* Orders Table */}
                        <div className="orders-table-wrapper">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th width="80">Mã đơn</th>
                                        <th width="150">Bệnh nhân</th>
                                        <th width="100">Ngày đặt</th>
                                        <th width="120" className="text-end">Tổng tiền</th>
                                        <th width="90">PT thanh toán</th>
                                        <th width="130">Trạng thái TT</th>
                                        <th width="130">Trạng thái GH</th>
                                        <th width="200">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="order-id">#{order.id}</td>
                                            <td className="patient-info">
                                                <div className="patient-name">
                                                    {order.patient_name || `Bệnh nhân #${order.patient_id}`}
                                                </div>
                                            </td>
                                            <td>{formatDate(order.order_date)}</td>
                                            <td className="text-end text-primary font-weight-bold">
                                                {formatVND(order.total_amount)}
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${getPaymentMethodColor(order.payment_method)}`}>
                                                    {getPaymentMethodLabel(order.payment_method)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${getPaymentStatusColor(order.payment_status)}`}>
                                                    {getPaymentStatusLabel(order.payment_status)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge-sm ${getShippingStatusColor(order.shipping_status || 'pending')}`}>
                                                    {getShippingStatusLabel(order.shipping_status || 'pending')}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <div className="actions-group">
                                                    {/* COD confirm button - Disable if delivered or returned */}
                                                    {order.payment_method === 'cod' && order.payment_status === 'pending_cod' && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleConfirmCODPayment(order.id)}
                                                            disabled={actionLoading === order.id || order.shipping_status === 'delivered' || order.shipping_status === 'returned'}
                                                            title={order.shipping_status === 'delivered' ? 'Đã giao - Tự động cập nhật thành paid' : 'Xác nhận đã nhận tiền COD'}
                                                        >
                                                            {actionLoading === order.id ? '...' : '💰 Thu tiền'}
                                                        </button>
                                                    )}

                                                    {/* Shipping status dropdown - Disable if already delivered or returned */}
                                                    <select
                                                        value={order.shipping_status || 'pending'}
                                                        onChange={(e) => handleUpdateShippingStatus(order.id, e.target.value)}
                                                        disabled={actionLoading === order.id || order.shipping_status === 'delivered' || order.shipping_status === 'returned'}
                                                        className="order-status-select btn btn-sm"
                                                        title={order.shipping_status === 'delivered' || order.shipping_status === 'returned' ? 'Đơn hàng đã hoàn tất - Không thể thay đổi' : 'Cập nhật trạng thái giao hàng'}
                                                    >
                                                        <option value="pending">📋 Chờ xử lý</option>
                                                        <option value="shipping">📦 Đang giao</option>
                                                        <option value="delivered">✓ Đã giao</option>
                                                        <option value="returned">↩ Trả hàng</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pageInfo.pages > 1 && (
                            <div className="pagination-section">
                                <div className="pagination-info">
                                    Trang {page} / {pageInfo.pages} ({pageInfo.total} đơn hàng)
                                </div>
                                <div className="pagination-controls">
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => loadOrders(page - 1)}
                                        disabled={page === 1}
                                    >
                                        ← Trước
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => loadOrders(page + 1)}
                                        disabled={page === pageInfo.pages}
                                    >
                                        Tiếp → 
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
