import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import './DrugOrderHistory.css';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function DrugOrderHistory() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({ total: 0, pages: 1 });

    const loadOrders = async (pageNum = 1, status = '') => {
        try {
            setLoading(true);
            setError('');
            const params = { page: pageNum, limit: 10 };
            if (status) params.status = status;

            const res = await api.get('/api/drug-orders', { params });

            if (res.data?.success) {
                setOrders(res.data.orders || []);
                setPageInfo(res.data.pagination || { total: 0, pages: 1 });
                setPage(pageNum);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không tải được danh sách đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(1, statusFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    return (
        <div className="drug-order-history-page">
            <div className="history-container">
                {/* Header */}
                <div className="history-header">
                    <div>
                        <h1>📋 Lịch sử đơn hàng</h1>
                        <p>Xem tất cả các đơn hàng thuốc của bạn</p>
                    </div>
                    <button
                        onClick={() => navigate('/patient/medicines')}
                        className="btn btn-primary"
                    >
                        🛒 Mua thuốc tiêp
                    </button>
                </div>

                {/* Status Filter */}
                <div className="filter-section">
                    <label htmlFor="status-filter">Lọc theo trạng thái:</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="status-filter"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="pending">⏳ Chờ xác nhận</option>
                        <option value="confirmed">✓ Đã xác nhận</option>
                        <option value="shipped">📦 Đã gửi</option>
                        <option value="delivered">✓ Đã giao</option>
                        <option value="cancelled">✕ Đã hủy</option>
                    </select>
                </div>

                {/* Error */}
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
                        <p>Chưa có đơn hàng nào</p>
                        <button
                            onClick={() => navigate('/patient/medicines')}
                            className="btn btn-primary"
                        >
                            🛒 Bắt đầu mua thuốc
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Orders List */}
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-card-header">
                                        <div className="order-number">
                                            <strong>Đơn hàng #{order.id}</strong>
                                            <span className="order-date">
                                                {new Date(order.order_date).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="order-badges">
                                            <span className={`badge status-${order.order_status}`}>
                                                {getOrderStatusText(order.order_status)}
                                            </span>
                                            {order.payment_method === 'vnpay' && (
                                                <span className={`badge payment-${order.payment_status}`}>
                                                    {getPaymentStatusText(order.payment_status)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-card-body">
                                        <div className="order-info">
                                            <div className="info-item">
                                                <span className="label">Số lượng:</span>
                                                <span className="value">{order.item_count || 0} mục</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Phương thức:</span>
                                                <span className="value">
                                                    {order.payment_method === 'cod' ? '💵 COD' : '🏦 VNPay'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-total">
                                            {formatVND(order.total_calculated || order.total_amount)}
                                        </div>
                                    </div>

                                    <div className="order-card-footer">
                                        <button
                                            onClick={() => navigate(`/patient/orders/${order.id}`)}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pageInfo.pages > 1 && (
                            <div className="pagination-controls">
                                <button
                                    onClick={() => loadOrders(page - 1, statusFilter)}
                                    disabled={page === 1}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    ← Trang trước
                                </button>
                                <span className="page-info">
                                    Trang {page}/{pageInfo.pages} ({pageInfo.total} đơn hàng)
                                </span>
                                <button
                                    onClick={() => loadOrders(page + 1, statusFilter)}
                                    disabled={page === pageInfo.pages}
                                    className="btn btn-sm btn-outline-primary"
                                >
                                    Trang sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
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
