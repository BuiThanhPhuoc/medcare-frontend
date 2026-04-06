import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';
import { useCart } from '../../../contexts/CartContext';
import { useToast } from '../../../hooks/useToast';
import './MedicineOrdering.css';

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 380;

const formatVND = (n) => {
    const num = typeof n === 'string' ? Number(n) : n;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(num) + ' ₫';
};

export default function MedicineOrdering() {
    const navigate = useNavigate();
    const { addToCart, totalQuantity } = useCart();
    const { success: showSuccess, error: showError } = useToast();
    const medicinesGridRef = useRef(null);

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({ total: 0, pages: 1 });

    const scrollToMedicines = () => {
        medicinesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const loadMedicines = useCallback(async (pageNum = 1, searchTerm = '', scrollAfter = false) => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/api/drug-orders/available-medicines', {
                params: {
                    page: pageNum,
                    limit: ITEMS_PER_PAGE,
                    search: searchTerm.trim() || undefined
                }
            });

            if (res.data?.success) {
                setMedicines(res.data.medicines || []);
                setPageInfo(res.data.pagination || { total: 0, pages: 1 });
                setPage(pageNum);
                if (scrollAfter) scrollToMedicines();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không tải được danh sách thuốc');
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => {
        loadMedicines(1, debouncedSearch, false);
    }, [debouncedSearch, loadMedicines]);

    // Handle add to cart
    const handleAddToCart = (medicine, batch) => {
        if (!batch || batch.available_quantity <= 0) {
            showError('Thuốc này hết hàng');
            return;
        }

        try {
            addToCart(medicine, batch, 1);
            showSuccess(`Đã thêm "${medicine.name}" vào giỏ hàng (${batch.available_quantity} viên có sẵn)`);
        } catch (err) {
            showError(err.message || 'Lỗi thêm vào giỏ hàng');
        }
    };

    const priceRangeLabel = (m) => {
        const lo = Number(m.min_price);
        const hi = Number(m.max_price);
        if (!Number.isFinite(lo)) return '—';
        if (!Number.isFinite(hi) || hi === lo) return formatVND(lo);
        return `${formatVND(lo)} – ${formatVND(hi)}`;
    };

    const availableStock = (m) => {
        const n = Number(m.total_available ?? m.total_quantity);
        return Number.isFinite(n) ? n : 0;
    };

    return (
        <div className="pharmacy-page">
            <div className="pharmacy-wrap">
                <section className="pharmacy-hero" aria-labelledby="pharmacy-title">
                    <div className="pharmacy-hero-inner">
                        <div className="pharmacy-hero-copy">
                            <span className="pharmacy-badge">
                                <i className="fas fa-prescription-bottle-medical" aria-hidden />
                                Nhà thuốc trực tuyến
                            </span>
                            <h1 id="pharmacy-title" className="pharmacy-title">
                                Đặt thuốc an toàn, giao tận nơi
                            </h1>
                            <p className="pharmacy-sub">
                                Chọn lô còn hạn dùng, xem giá minh bạch và thanh toán COD hoặc VNPay ngay trên MedCare.
                            </p>
                            <div className="pharmacy-hero-actions">
                                <button
                                    type="button"
                                    className="pharmacy-btn pharmacy-btn--ghost"
                                    onClick={() => medicinesGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    <i className="fas fa-arrow-down" aria-hidden />
                                    Xem danh mục
                                </button>
                                {totalQuantity > 0 && (
                                    <Link to="/patient/cart" className="pharmacy-btn pharmacy-btn--solid">
                                        <i className="fas fa-bag-shopping" aria-hidden />
                                        Giỏ hàng ({totalQuantity})
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="pharmacy-hero-card" aria-hidden>
                            <div className="pharmacy-stat">
                                <span className="pharmacy-stat-label">Giao hàng</span>
                                <strong>1–2 ngày</strong>
                                <small>Nội thành</small>
                            </div>
                            <div className="pharmacy-stat">
                                <span className="pharmacy-stat-label">Thanh toán</span>
                                <strong>COD &amp; VNPay</strong>
                                <small>Bảo mật SSL</small>
                            </div>
                            <div className="pharmacy-stat">
                                <span className="pharmacy-stat-label">Nguồn thuốc</span>
                                <strong>Kho phòng khám</strong>
                                <small>Lô &amp; HSD rõ ràng</small>
                            </div>
                        </div>
                    </div>
                </section>

                {totalQuantity > 0 && (
                    <div className="pharmacy-cart-strip" role="status">
                        <div className="pharmacy-cart-strip-inner">
                            <span>
                                <i className="fas fa-circle-check" aria-hidden />
                                Bạn đang có <strong>{totalQuantity}</strong> sản phẩm trong giỏ
                            </span>
                            <button type="button" className="pharmacy-strip-btn" onClick={() => navigate('/patient/cart')}>
                                Thanh toán
                                <i className="fas fa-chevron-right" aria-hidden />
                            </button>
                        </div>
                    </div>
                )}

                <div className="pharmacy-toolbar" ref={medicinesGridRef}>
                    <div className="pharmacy-search-wrap">
                        <i className="fas fa-magnifying-glass pharmacy-search-icon" aria-hidden />
                        <input
                            type="search"
                            className="pharmacy-search"
                            placeholder="Tìm theo tên thuốc hoặc hoạt chất..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            aria-label="Tìm thuốc"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                className="pharmacy-search-clear"
                                onClick={() => setSearchInput('')}
                                aria-label="Xóa tìm kiếm"
                            >
                                <i className="fas fa-xmark" />
                            </button>
                        )}
                    </div>
                    <p className="pharmacy-toolbar-hint">
                        {loading ? 'Đang tìm…' : `${pageInfo.total} loại thuốc khả dụng`}
                    </p>
                </div>

                {error && (
                    <div className="pharmacy-alert pharmacy-alert--error" role="alert">
                        <i className="fas fa-triangle-exclamation" aria-hidden />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="pharmacy-loading">
                        <div className="pharmacy-spinner" role="status" aria-label="Đang tải" />
                        <p>Đang tải danh sách thuốc…</p>
                    </div>
                ) : medicines.length === 0 ? (
                    <div className="pharmacy-empty">
                        <div className="pharmacy-empty-icon">
                            <i className="fas fa-pills" aria-hidden />
                        </div>
                        <h2>Không có kết quả</h2>
                        <p>Thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.</p>
                        {searchInput && (
                            <button type="button" className="pharmacy-btn pharmacy-btn--outline" onClick={() => setSearchInput('')}>
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="pharmacy-results-meta">
                            Hiển thị{' '}
                            <strong>
                                {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, pageInfo.total)}
                            </strong>{' '}
                            / {pageInfo.total} mặt hàng
                        </div>

                        <ul className="pharmacy-grid">
                            {medicines.map((medicine) => (
                                <li key={medicine.id} className="pharmacy-card">
                                    <div className="pharmacy-card-top">
                                        <div className="pharmacy-card-icon" aria-hidden>
                                            <i className="fas fa-capsules" />
                                        </div>
                                        <div className="pharmacy-card-head">
                                            <h3 className="pharmacy-card-title">{medicine.name}</h3>
                                            <span className="pharmacy-pill">
                                                Còn {availableStock(medicine)} · {medicine.unit || 'đơn vị'}
                                            </span>
                                        </div>
                                    </div>

                                    {(medicine.generic_name || medicine.active_ingredient) && (
                                        <p className="pharmacy-generic">
                                            Hoạt chất: <span>{medicine.generic_name || medicine.active_ingredient}</span>
                                        </p>
                                    )}

                                    <div className="pharmacy-price-row">
                                        <span className="pharmacy-price-label">Giá tham khảo</span>
                                        <span className="pharmacy-price-value">{priceRangeLabel(medicine)}</span>
                                    </div>

                                    <div className="pharmacy-batches">
                                        {medicine.batches?.length ? (
                                            medicine.batches.map((batch) => (
                                                <div key={batch.id} className="pharmacy-batch-row">
                                                    <div className="pharmacy-batch-info">
                                                        <span className="pharmacy-batch-label">Lô {batch.batch_number}</span>
                                                        <span className="pharmacy-batch-meta">
                                                            HSD {new Date(batch.expiry_date).toLocaleDateString('vi-VN')} · Còn{' '}
                                                            {batch.available_quantity}
                                                        </span>
                                                    </div>
                                                    <div className="pharmacy-batch-price">{formatVND(batch.price)}</div>
                                                    <button
                                                        type="button"
                                                        className="pharmacy-add-btn"
                                                        onClick={() => handleAddToCart(medicine, batch)}
                                                        disabled={batch.available_quantity <= 0}
                                                    >
                                                        <i className="fas fa-plus" aria-hidden />
                                                        Thêm
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="pharmacy-oos">Tạm hết lô khả dụng</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {pageInfo.pages > 1 && (
                            <nav className="pharmacy-pager" aria-label="Phân trang">
                                <button
                                    type="button"
                                    className="pharmacy-pager-btn"
                                    onClick={() => loadMedicines(page - 1, debouncedSearch, true)}
                                    disabled={page === 1}
                                >
                                    <i className="fas fa-chevron-left" aria-hidden />
                                    Trước
                                </button>
                                <span className="pharmacy-pager-info">
                                    Trang {page} / {pageInfo.pages}
                                </span>
                                <button
                                    type="button"
                                    className="pharmacy-pager-btn"
                                    onClick={() => loadMedicines(page + 1, debouncedSearch, true)}
                                    disabled={page === pageInfo.pages}
                                >
                                    Sau
                                    <i className="fas fa-chevron-right" aria-hidden />
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
