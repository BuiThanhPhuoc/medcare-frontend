import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../hooks/useToast';
import api from '../../../lib/api';
import './CartPage.css';

const SHIPPING_FEE = 30000;

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function CartPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, clearCart, subtotal, getTotal } = useCart();
    const { success: showSuccess, error: showError, warning: showWarning } = useToast();

    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addressBlurred, setAddressBlurred] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const isEmpty = cart.length === 0;
    const total = getTotal(SHIPPING_FEE);
    const isAddressValid = deliveryAddress.trim().length > 0;
    const showAddressError = !isAddressValid && (addressBlurred || submitAttempted);

    const handleQuantityChange = (drugId, batchId, newQuantity) => {
        try {
            updateQuantity(drugId, batchId, newQuantity);
        } catch (err) {
            showError(err.message);
        }
    };

    const handleRemoveItem = (drugId, batchId) => {
        removeFromCart(drugId, batchId);
        showSuccess('Đã xóa khỏi giỏ hàng');
    };

    const handleCheckout = async () => {
        if (isEmpty) {
            showWarning('Giỏ hàng trống');
            return;
        }

        if (!isAddressValid) {
            setSubmitAttempted(true);
            showError('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cart.map((item) => ({
                    drug_id: item.drug_id,
                    batch_id: item.batch_id,
                    quantity: item.quantity
                })),
                payment_method: paymentMethod,
                delivery_address: deliveryAddress.trim(),
                notes: notes.trim() || null
            };

            const res = await api.post('/api/drug-orders', orderData);

            if (!res.data?.success) {
                throw new Error(res.data?.message || 'Lỗi tạo đơn hàng');
            }

            const orderId = res.data.orderId;

            if (paymentMethod === 'vnpay') {
                const paymentRes = await api.post(`/api/drug-orders/${orderId}/create-vnpay-payment`, {});

                if (paymentRes.data?.success && paymentRes.data.paymentUrl) {
                    clearCart();
                    window.location.href = paymentRes.data.paymentUrl;
                } else {
                    throw new Error(paymentRes.data?.message || 'Không tạo được liên kết thanh toán VNPay');
                }
            } else if (paymentMethod === 'cod') {
                clearCart();
                showSuccess('Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.');

                navigate('/patient/orders', {
                    state: {
                        success: true,
                        message: 'Đặt hàng thành công! Vui lòng thanh toán khi nhận hàng.',
                        orderId
                    }
                });
            }
        } catch (err) {
            console.error('Checkout error:', err);
            showError(err.response?.data?.message || err.message || 'Lỗi đặt hàng');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-wrap">
                <header className="checkout-header">
                    <Link to="/patient/medicines" className="checkout-back">
                        <i className="fas fa-arrow-left" aria-hidden />
                        Tiếp tục mua
                    </Link>
                    <h1 className="checkout-title">Giỏ hàng &amp; thanh toán</h1>
                    <p className="checkout-lead">Kiểm tra sản phẩm, địa chỉ và chọn hình thức thanh toán.</p>
                </header>

                {isEmpty ? (
                    <div className="checkout-empty">
                        <div className="checkout-empty-visual">
                            <i className="fas fa-basket-shopping" aria-hidden />
                        </div>
                        <h2>Giỏ hàng đang trống</h2>
                        <p>Thêm thuốc từ nhà thuốc trực tuyến để đặt giao tận nơi.</p>
                        <button type="button" className="checkout-btn checkout-btn--primary" onClick={() => navigate('/patient/medicines')}>
                            Đến cửa hàng thuốc
                        </button>
                    </div>
                ) : (
                    <div className="checkout-grid">
                        <div className="checkout-main">
                            <section className="checkout-panel">
                                <h2 className="checkout-panel-title">
                                    <i className="fas fa-pills" aria-hidden />
                                    Sản phẩm ({cart.length})
                                </h2>
                                <ul className="checkout-lines">
                                    {cart.map((item) => (
                                        <li key={`${item.drug_id}-${item.batch_id}`} className="checkout-line">
                                            <div className="checkout-line-main">
                                                <span className="checkout-line-name">{item.drug_name}</span>
                                                <span className="checkout-line-batch">Lô {item.batch_number}</span>
                                            </div>
                                            <div className="checkout-line-mid">
                                                <span className="checkout-line-price">{formatVND(item.price_at_time)}</span>
                                                <div className="checkout-qty" role="group" aria-label="Số lượng">
                                                    <button
                                                        type="button"
                                                        className="checkout-qty-btn"
                                                        onClick={() => handleQuantityChange(item.drug_id, item.batch_id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Giảm"
                                                    >
                                                        −
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={item.available_quantity}
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value, 10);
                                                            if (!Number.isNaN(val) && val > 0) {
                                                                handleQuantityChange(item.drug_id, item.batch_id, val);
                                                            }
                                                        }}
                                                        className="checkout-qty-input"
                                                        aria-label={`Số lượng ${item.drug_name}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="checkout-qty-btn"
                                                        onClick={() => handleQuantityChange(item.drug_id, item.batch_id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.available_quantity}
                                                        aria-label="Tăng"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="checkout-line-sub">{formatVND(item.subtotal)}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="checkout-remove"
                                                onClick={() => handleRemoveItem(item.drug_id, item.batch_id)}
                                                title="Xóa"
                                                aria-label={`Xóa ${item.drug_name}`}
                                            >
                                                <i className="fas fa-trash-can" />
                                            </button>
                                            <span className="checkout-line-cap">Tối đa {item.available_quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="checkout-panel">
                                <h2 className="checkout-panel-title">
                                    <i className="fas fa-location-dot" aria-hidden />
                                    Giao hàng
                                </h2>
                                <div className="checkout-field">
                                    <label htmlFor="delivery-address">
                                        Địa chỉ nhận hàng <span className="checkout-req">*</span>
                                    </label>
                                    <textarea
                                        id="delivery-address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        onBlur={() => setAddressBlurred(true)}
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành…"
                                        rows={4}
                                        className={`checkout-textarea ${showAddressError ? 'checkout-textarea--error' : ''} ${isAddressValid && addressBlurred ? 'checkout-textarea--ok' : ''}`}
                                    />
                                    {showAddressError && (
                                        <span className="checkout-field-error">Vui lòng nhập địa chỉ để giao thuốc.</span>
                                    )}
                                </div>
                                <div className="checkout-field">
                                    <label htmlFor="delivery-notes">Ghi chú (tuỳ chọn)</label>
                                    <textarea
                                        id="delivery-notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Khung giờ nhận, tên người nhận thay thế…"
                                        rows={2}
                                        className="checkout-textarea"
                                    />
                                </div>

                                <div className="checkout-field">
                                    <span className="checkout-label-block">
                                        Phương thức thanh toán <span className="checkout-req">*</span>
                                    </span>
                                    <div className="checkout-pay-grid">
                                        <label className={`checkout-pay-card ${paymentMethod === 'cod' ? 'checkout-pay-card--on' : ''}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span className="checkout-pay-icon" aria-hidden>
                                                <i className="fas fa-money-bill-wave" />
                                            </span>
                                            <span className="checkout-pay-text">
                                                <strong>COD</strong>
                                                <small>Thanh toán khi nhận hàng</small>
                                            </span>
                                        </label>
                                        <label className={`checkout-pay-card ${paymentMethod === 'vnpay' ? 'checkout-pay-card--on' : ''}`}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="vnpay"
                                                checked={paymentMethod === 'vnpay'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <span className="checkout-pay-icon checkout-pay-icon--vn" aria-hidden>
                                                <i className="fas fa-building-columns" />
                                            </span>
                                            <span className="checkout-pay-text">
                                                <strong>VNPay</strong>
                                                <small>QR, thẻ, ví liên kết</small>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <aside className="checkout-aside">
                            <div className="checkout-summary">
                                <h3 className="checkout-summary-title">Tóm tắt</h3>
                                <div className="checkout-sum-row">
                                    <span>Tạm tính</span>
                                    <span>{formatVND(subtotal)}</span>
                                </div>
                                <div className="checkout-sum-row">
                                    <span>Phí giao hàng</span>
                                    <span>{formatVND(SHIPPING_FEE)}</span>
                                </div>
                                <div className="checkout-sum-divider" />
                                <div className="checkout-sum-row checkout-sum-row--total">
                                    <span>Tổng thanh toán</span>
                                    <span>{formatVND(total)}</span>
                                </div>
                                <button
                                    type="button"
                                    className="checkout-btn checkout-btn--primary checkout-btn--block"
                                    onClick={handleCheckout}
                                    disabled={isSubmitting || !isAddressValid}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="checkout-btn-spin" />
                                            Đang xử lý…
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-lock" aria-hidden />
                                            Đặt hàng an toàn
                                        </>
                                    )}
                                </button>
                                <p className="checkout-trust">
                                    <i className="fas fa-shield-halved" aria-hidden />
                                    Thông tin chỉ dùng để giao hàng và xác nhận đơn.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
