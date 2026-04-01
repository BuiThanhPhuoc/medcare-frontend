import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import './MedicineOrdering.css';

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function MedicineOrdering() {
    const navigate = useNavigate();

    // States
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({ total: 0, pages: 1 });
    
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    
    // Checkout states
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [notes, setNotes] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    // Load medicines
    const loadMedicines = async (pageNum = 1) => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/api/drug-orders/available-medicines', {
                params: {
                    page: pageNum,
                    limit: 10,
                    search: search || undefined
                }
            });

            if (res.data?.success) {
                setMedicines(res.data.medicines || []);
                setPageInfo(res.data.pagination || { total: 0, pages: 1 });
                setPage(pageNum);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không tải được danh sách thuốc');
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    // Cart functions
    const addToCart = (medicine, batch) => {
        if (!batch || batch.available_quantity <= 0) {
            alert('Thuốc này hết hàng');
            return;
        }

        const existingItem = cart.find(
            item => item.drug_id === medicine.id && item.batch_id === batch.id
        );

        if (existingItem) {
            if (existingItem.quantity >= batch.available_quantity) {
                alert(`Chỉ còn ${batch.available_quantity} viên`);
                return;
            }
            existingItem.quantity += 1;
            existingItem.subtotal = existingItem.quantity * existingItem.price_at_time;
        } else {
            cart.push({
                drug_id: medicine.id,
                batch_id: batch.id,
                drug_name: medicine.name,
                batch_number: batch.batch_number,
                quantity: 1,
                price_at_time: batch.price,
                subtotal: batch.price,
                available_quantity: batch.available_quantity
            });
        }

        setCart([...cart]);
        alert('Đã thêm vào giỏ hàng');
    };

    const updateCartQuantity = (index, quantity) => {
        const item = cart[index];
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else if (quantity <= item.available_quantity) {
            item.quantity = quantity;
            item.subtotal = quantity * item.price_at_time;
        } else {
            alert(`Chỉ còn ${item.available_quantity} viên`);
            return;
        }
        setCart([...cart]);
    };

    const removeFromCart = (index) => {
        if (window.confirm('Xóa thuốc này khỏi giỏ hàng?')) {
            cart.splice(index, 1);
            setCart([...cart]);
        }
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Giỏ hàng trống');
            return;
        }

        if (!deliveryAddress.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        setCheckoutLoading(true);
        setCheckoutError('');

        try {
            const orderData = {
                items: cart,
                payment_method: paymentMethod,
                delivery_address: deliveryAddress.trim(),
                notes: notes.trim() || null
            };

            const res = await api.post('/api/drug-orders', orderData);

            if (res.data?.success) {
                const orderId = res.data.orderId;

                if (paymentMethod === 'vnpay') {
                    // Redirect to VNPay
                    const paymentRes = await api.post(`/api/drug-orders/${orderId}/create-vnpay-payment`, {});
                    if (paymentRes.data?.success && paymentRes.data.paymentUrl) {
                        window.location.href = paymentRes.data.paymentUrl;
                        return;
                    } else {
                        throw new Error(paymentRes.data?.message || 'Không tạo được thanh toán VNPay');
                    }
                } else {
                    // COD - just confirm
                    await api.put(`/api/drug-orders/${orderId}/confirm-payment`, {
                        payment_method: 'cod'
                    });
                    setCart([]);
                    navigate(`/patient/orders/${orderId}?success=true`);
                }
            }
        } catch (err) {
            setCheckoutError(err.response?.data?.message || err.message || 'Lỗi đặt hàng');
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="medicine-ordering-page">
            <div className="medicine-ordering-container">
                {/* Header */}
                <div className="ordering-header">
                    <h1>🛒 Mua Thuốc Online</h1>
                    <p>Duyệt và đặt mua thuốc trực tuyến, thanh toán tiện lợi</p>
                </div>

                <div className="ordering-layout">
                    {/* Main Content */}
                    <div className="ordering-main">
                        {/* Search Bar */}
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="🔍 Tìm kiếm thuốc (tên, thành phần hoạt động)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="search-input"
                            />
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
                                <p>Đang tải danh sách thuốc...</p>
                            </div>
                        ) : medicines.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🏥</div>
                                <p>Không tìm thấy thuốc nào</p>
                            </div>
                        ) : (
                            <>
                                {/* Medicines Grid */}
                                <div className="medicines-grid">
                                    {medicines.map((medicine) => (
                                        <div key={medicine.id} className="medicine-card">
                                            <div className="medicine-header">
                                                <h3>{medicine.name}</h3>
                                                <span className="stock-badge">
                                                    {medicine.total_available} có sẵn
                                                </span>
                                            </div>

                                            {medicine.active_ingredient && (
                                                <div className="medicine-ingredient">
                                                    Hoạt chất: {medicine.active_ingredient}
                                                </div>
                                            )}

                                            <div className="medicine-unit">
                                                Đơn vị: {medicine.unit || 'Vỉ'}
                                            </div>

                                            {/* Batch Selection */}
                                            <div className="batches-section">
                                                {medicine.batches && medicine.batches.length > 0 ? (
                                                    <select
                                                        className="batch-select"
                                                        defaultValue=""
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                const batch = medicine.batches.find(
                                                                    b => b.id === parseInt(e.target.value)
                                                                );
                                                                addToCart(medicine, batch);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    >
                                                        <option value="">
                                                            Chọn lô hàng
                                                        </option>
                                                        {medicine.batches.map((batch) => (
                                                            <option key={batch.id} value={batch.id}>
                                                                Lô {batch.batch_number} - HSD: {new Date(batch.expiry_date).toLocaleDateString('vi-VN')} - {formatVND(batch.price)} - Còn: {batch.available_quantity}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="out-of-stock">
                                                        Hết hàng
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pageInfo.pages > 1 && (
                                    <div className="pagination-controls">
                                        <button
                                            onClick={() => loadMedicines(page - 1)}
                                            disabled={page === 1}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            ← Trang trước
                                        </button>
                                        <span className="page-info">
                                            Trang {page}/{pageInfo.pages} ({pageInfo.total} thuốc)
                                        </span>
                                        <button
                                            onClick={() => loadMedicines(page + 1)}
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

                    {/* Cart Sidebar */}
                    <div className="ordering-sidebar">
                        <div className={`cart-panel ${showCart ? 'expanded' : ''}`}>
                            <div
                                className="cart-header"
                                onClick={() => setShowCart(!showCart)}
                            >
                                <h3>
                                    🛒 Giỏ hàng
                                    <span className="cart-count">{cartCount}</span>
                                </h3>
                                <span className={`expand-icon ${showCart ? 'up' : 'down'}`}>
                                    {showCart ? '▲' : '▼'}
                                </span>
                            </div>

                            {showCart && (
                                <>
                                    {/* Cart Items */}
                                    <div className="cart-items">
                                        {cart.length === 0 ? (
                                            <div className="empty-cart">
                                                Giỏ hàng trống
                                            </div>
                                        ) : (
                                            cart.map((item, index) => (
                                                <div key={index} className="cart-item">
                                                    <div className="item-info">
                                                        <div className="item-name">
                                                            {item.drug_name}
                                                        </div>
                                                        <div className="item-batch">
                                                            Lô: {item.batch_number}
                                                        </div>
                                                        <div className="item-price">
                                                            {formatVND(item.price_at_time)}/viên
                                                        </div>
                                                    </div>

                                                    <div className="item-controls">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            max={item.available_quantity}
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                updateCartQuantity(index, parseInt(e.target.value))
                                                            }
                                                            className="quantity-input"
                                                        />
                                                        <button
                                                            onClick={() => removeFromCart(index)}
                                                            className="btn-remove"
                                                            title="Xóa"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    <div className="item-subtotal">
                                                        {formatVND(item.subtotal)}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Checkout Section */}
                                    {cart.length > 0 && (
                                        <div className="checkout-section">
                                            {/* Total */}
                                            <div className="cart-total">
                                                <span>Tổng cộng:</span>
                                                <span className="total-amount">
                                                    {formatVND(cartTotal)}
                                                </span>
                                            </div>

                                            {/* Error */}
                                            {checkoutError && (
                                                <div className="checkout-error">
                                                    {checkoutError}
                                                </div>
                                            )}

                                            {/* Delivery Address */}
                                            <div className="form-group">
                                                <label>Địa chỉ giao hàng</label>
                                                <textarea
                                                    value={deliveryAddress}
                                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                                    placeholder="VD: 123 Đường ABC, Quận 1, TP.HCM"
                                                    className="form-control"
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Payment Method */}
                                            <div className="form-group">
                                                <label>Phương thức thanh toán</label>
                                                <div className="payment-options">
                                                    <label className="payment-option">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value="cod"
                                                            checked={paymentMethod === 'cod'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        />
                                                        <span>💵 Tiền mặt khi nhận (COD)</span>
                                                    </label>
                                                    <label className="payment-option">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value="vnpay"
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        />
                                                        <span>🏦 Thanh toán bằng VNPay</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            <div className="form-group">
                                                <label>Ghi chú đặt hàng (tùy chọn)</label>
                                                <textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="VD: Giao buổi sáng, giao vào thứ 2-6..."
                                                    className="form-control"
                                                    rows={2}
                                                />
                                            </div>

                                            {/* Checkout Button */}
                                            <button
                                                onClick={handleCheckout}
                                                disabled={checkoutLoading || cart.length === 0}
                                                className="btn btn-primary btn-block checkout-btn"
                                            >
                                                {checkoutLoading ? 'Đang xử lý...' : '✓ Đặt hàng'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Cart Summary (when collapsed) */}
                        {!showCart && cart.length > 0 && (
                            <div className="cart-summary">
                                <div className="summary-item">
                                    <span>Số lượng:</span>
                                    <strong>{cartCount}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Tổng tiền:</span>
                                    <strong>{formatVND(cartTotal)}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
