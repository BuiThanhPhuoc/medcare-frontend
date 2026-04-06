import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import './AdminDashboard.css';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

const formatVND = (value) => {
    const num = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(num)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(num);
};

const toYMD = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatShortDayVN = (ymd) => {
    // ymd: YYYY-MM-DD
    const parts = String(ymd).split('-');
    if (parts.length !== 3) return ymd;
    const m = parts[1];
    const d = parts[2];
    return `${d}/${m}`;
};

const useChartResize = () => {
    const [chartKey, setChartKey] = useState(0);
    
    useEffect(() => {
        let resizeObserver;
        const timer = setTimeout(() => {
            const containers = document.querySelectorAll('.chart-block, .chart-block-sm');
            if (containers.length === 0) return;
            
            try {
                resizeObserver = new ResizeObserver(() => {
                    setChartKey(k => k + 1);
                });
                containers.forEach(container => resizeObserver.observe(container));
            } catch {
                console.warn('ResizeObserver not supported');
            }
        }, 100);
        
        return () => {
            clearTimeout(timer);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, []);
    
    return chartKey;
};

const paymentMeta = {
    vnpay: { label: 'VNPay', color: '#1F3FBF' },    // Xanh dương - Logo VNPay
    cod: { label: 'COD', color: '#10B981' },         // Xanh lá - Tiền mặt/Thành công
    cash: { label: 'Tiền mặt', color: '#8b5cf6' },   // Tím
    transfer: { label: 'Chuyển khoản', color: '#3b82f6' },
    card: { label: 'Thẻ', color: '#f59e0b' }
};

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [daysRange, setDaysRange] = useState(7);
    const [revenueStats, setRevenueStats] = useState({ total_revenue: 0, revenue_by_method: [] });
    const [revenueTimeline, setRevenueTimeline] = useState([]);
    const [pendingSchedules, setPendingSchedules] = useState([]);
    const [pendingDrugOrders, setPendingDrugOrders] = useState(0);
    const chartKey = useChartResize();

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const [revRes, timelineRes, pendingRes] = await Promise.all([
                    api.get('/api/admin/revenue'),
                    api.get(`/api/admin/revenue/timeline?days=${daysRange}`),
                    api.get('/api/admin/schedules/pending')
                ]);

                if (cancelled) return;

                setRevenueStats(revRes.data?.data ?? { total_revenue: 0, revenue_by_method: [] });
                setRevenueTimeline(timelineRes.data?.data?.timeline ?? []);
                setPendingSchedules(pendingRes.data?.schedules ?? []);

                // Fetch pending drug orders (status = pending_cod hoặc unpaid)
                try {
                    const drugOrdersRes = await api.get('/api/admin/drug-orders?shipping_status=pending');
                    setPendingDrugOrders(drugOrdersRes.data?.pagination?.total ?? 0);
                } catch (e) {
                    console.error('Error fetching pending drug orders:', e);
                    setPendingDrugOrders(0);
                }
            } catch (e) {
                if (cancelled) return;
                setError(e?.response?.data?.message || e?.message || 'Không thể tải dữ liệu dashboard.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [daysRange]);

    const kpis = useMemo(() => {
        const totalRevenue = Number(revenueStats?.total_revenue ?? 0);
        const methods = Array.isArray(revenueStats?.revenue_by_method) ? revenueStats.revenue_by_method : [];
        const totalTransactions = methods.reduce((sum, m) => sum + Number(m.total_transactions ?? 0), 0);
        const avgTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        return {
            totalRevenue,
            totalTransactions,
            avgTicket,
            pendingSchedulesCount: pendingSchedules.length
        };
    }, [revenueStats, pendingSchedules]);

    const revenueTimelineNormalized = useMemo(() => {
        const timelineMap = new Map(
            revenueTimeline.map((t) => [
                String(t.day),
                {
                    total_revenue: Number(t.total_revenue ?? 0),
                    total_transactions: Number(t.total_transactions ?? 0)
                }
            ])
        );

        const end = new Date();
        end.setHours(0, 0, 0, 0);
        const keys = [];
        for (let i = daysRange - 1; i >= 0; i--) {
            const d = new Date(end);
            d.setDate(end.getDate() - i);
            keys.push(toYMD(d));
        }

        return keys.map((key) => {
            const v = timelineMap.get(key);
            return {
                day: formatShortDayVN(key),
                total_revenue: v?.total_revenue ?? 0,
                total_transactions: v?.total_transactions ?? 0
            };
        });
    }, [revenueTimeline, daysRange]);

    const revenueByMethodPieData = useMemo(() => {
        const methods = Array.isArray(revenueStats?.revenue_by_method) ? revenueStats.revenue_by_method : [];
        return methods.map((m) => {
            const meta = paymentMeta[m.payment_method] || { label: m.payment_method, color: '#64748b' };
            return {
                name: meta.label,
                value: Number(m.total ?? 0),
                color: meta.color
            };
        });
    }, [revenueStats]);

    const revenueByMethodTransactionsData = useMemo(() => {
        const methods = Array.isArray(revenueStats?.revenue_by_method) ? revenueStats.revenue_by_method : [];
        return methods.map((m) => {
            const meta = paymentMeta[m.payment_method] || { label: m.payment_method, color: '#64748b' };
            return {
                name: meta.label,
                transactions: Number(m.total_transactions ?? 0),
                color: meta.color
            };
        });
    }, [revenueStats]);

    const pendingByDoctorData = useMemo(() => {
        const map = new Map();
        for (const s of pendingSchedules) {
            const name = s.doctor_name || 'Không rõ bác sĩ';
            map.set(name, (map.get(name) ?? 0) + 1);
        }
        return [...map.entries()]
            .map(([doctor, count]) => ({ doctor, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [pendingSchedules]);

    const pendingByShiftData = useMemo(() => {
        const map = new Map();
        for (const s of pendingSchedules) {
            const shift = s.shift || 'Không rõ ca';
            map.set(shift, (map.get(shift) ?? 0) + 1);
        }
        return [...map.entries()]
            .map(([shift, count]) => ({ shift, count }))
            .sort((a, b) => b.count - a.count);
    }, [pendingSchedules]);

    return (
        <div className="admin-dashboard-modern">
            <div className="admin-dash-hero">
                <div className="admin-dash-hero-text">
                    <p className="admin-dash-eyebrow">Bảng điều khiển</p>
                    <h1 className="admin-dash-heading">Tổng quan vận hành</h1>
                    <p className="admin-dash-lead">
                        Theo dõi doanh thu, thanh toán và các tác vụ cần xử lý trong một giao diện gọn gàng.
                    </p>
                </div>
            </div>

            <div className="revenue-toolbar">
                <div>
                    <h3 className="chart-title mb-1">
                        <i className="fas fa-chart-line me-2 text-primary" aria-hidden />
                        Phân tích doanh thu
                    </h3>
                    <div className="chart-subtitle">Biểu đồ theo số ngày bạn chọn; dữ liệu từ thanh toán hệ thống</div>
                </div>

                <div className="days-selector btn-group" role="group" aria-label="Chọn khoảng thời gian">
                    {[7, 14, 30].map((n) => (
                        <button
                            key={n}
                            type="button"
                            className={`btn btn-sm ${daysRange === n ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setDaysRange(n)}
                        >
                            {n} ngày
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Lỗi:</strong> {error}
                </div>
            )}

            {loading ? (
                <div className="loading-overlay">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status" />
                        <div className="mt-2 text-secondary fw-semibold">Đang tải dữ liệu...</div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="admin-kpi-grid mb-4">
                        <div className="kpi-card kpi-card--accent">
                            <div className="kpi-title">Tổng doanh thu</div>
                            <div className="d-flex align-items-end justify-content-between gap-2">
                                <div className="kpi-value">{formatVND(kpis.totalRevenue)}</div>
                                <div className="kpi-icon-wrap kpi-icon-wrap--teal">
                                    <i className="fas fa-money-bill-wave" aria-hidden />
                                </div>
                            </div>
                            <div className="kpi-meta">Từ bảng thanh toán</div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-title">Số giao dịch</div>
                            <div className="d-flex align-items-end justify-content-between gap-2">
                                <div className="kpi-value">{kpis.totalTransactions}</div>
                                <div className="kpi-icon-wrap">
                                    <i className="fas fa-receipt" aria-hidden />
                                </div>
                            </div>
                            <div className="kpi-meta">Theo phương thức thanh toán</div>
                        </div>

                        <div className="kpi-card">
                            <div className="kpi-title">TB / giao dịch</div>
                            <div className="d-flex align-items-end justify-content-between gap-2">
                                <div className="kpi-value">{formatVND(kpis.avgTicket)}</div>
                                <div className="kpi-icon-wrap">
                                    <i className="fas fa-scale-balanced" aria-hidden />
                                </div>
                            </div>
                            <div className="kpi-meta">Doanh thu ÷ số giao dịch</div>
                        </div>

                        <div className="kpi-card kpi-card--warn">
                            <div className="kpi-title">Lịch chờ duyệt</div>
                            <div className="d-flex align-items-end justify-content-between gap-2">
                                <div className="kpi-value kpi-value--warn">{kpis.pendingSchedulesCount}</div>
                                <div className="kpi-icon-wrap kpi-icon-wrap--amber">
                                    <i className="fas fa-clock" aria-hidden />
                                </div>
                            </div>
                            <div className="kpi-meta">Ca làm việc pending</div>
                        </div>

                        <Link to="/admin/drug-orders" className="kpi-card-link">
                            <div className="kpi-card kpi-card--orders">
                                <div className="kpi-title">Đơn thuốc cần xử lý</div>
                                <div className="d-flex align-items-end justify-content-between gap-2">
                                    <div className="kpi-value kpi-value--orders">{pendingDrugOrders}</div>
                                    <div className="kpi-icon-wrap kpi-icon-wrap--violet">
                                        <i className="fas fa-truck-medical" aria-hidden />
                                    </div>
                                </div>
                                <div className="kpi-meta">Lọc trạng thái giao hàng pending — bấm để mở</div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick Shortcuts - Moved to top */}
                    <div className="row g-3 mb-4">
                        <div className="col-12">
                            <div className="shortcuts-card">
                                <h6 className="shortcuts-title">
                                    <i className="fas fa-bolt me-2 text-warning"></i> Lối tắt quản trị
                                </h6>
                                <div className="shortcuts-grid">
                                    <Link to="/admin/medicines" className="shortcut-btn">
                                        <i className="fas fa-pills"></i>
                                        <span>Quản lý Thuốc</span>
                                    </Link>
                                    <Link to="/admin/drug-orders" className="shortcut-btn">
                                        <i className="fas fa-shopping-cart"></i>
                                        <span>Quản lý Đơn Thuốc</span>
                                    </Link>
                                    <Link to="/admin/doctors" className="shortcut-btn">
                                        <i className="fas fa-user-md"></i>
                                        <span>Quản lý Bác sĩ</span>
                                    </Link>
                                    <Link to="/admin/receptionists" className="shortcut-btn">
                                        <i className="fas fa-user-tie"></i>
                                        <span>Quản lý Lễ tân</span>
                                    </Link>
                                    <Link to="/admin/lab-technicians" className="shortcut-btn">
                                        <i className="fas fa-flask"></i>
                                        <span>KTV xét nghiệm</span>
                                    </Link>
                                    <Link to="/admin/specialties" className="shortcut-btn">
                                        <i className="fas fa-stethoscope"></i>
                                        <span>Chuyên Khoa</span>
                                    </Link>
                                    <Link to="/admin/posts" className="shortcut-btn">
                                        <i className="fas fa-newspaper"></i>
                                        <span>Quản lý Bài Viết</span>
                                    </Link>
                                    <Link to="/admin/schedules" className="shortcut-btn">
                                        <i className="fas fa-calendar-check"></i>
                                        <span>Phê duyệt Lịch</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 1: Line Chart + Pie Chart */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-7">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div>
                                        <h5 className="chart-title">
                                            <i className="fas fa-chart-line me-2 text-primary" />
                                            Doanh thu theo ngày
                                        </h5>
                                        <div className="chart-subtitle">Từ {daysRange} ngày gần nhất</div>
                                    </div>
                                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                                        {revenueTimelineNormalized.length} điểm
                                    </span>
                                </div>

                                <div className="chart-block">
                                    {revenueTimelineNormalized.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-chart-line"></i>
                                            <p>Chưa có dữ liệu doanh thu</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <LineChart data={revenueTimelineNormalized}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis
                                                    tickFormatter={(v) => {
                                                        const num = Number(v);
                                                        if (!Number.isFinite(num)) return '0';
                                                        return `${Math.round(num / 1000000)}M`;
                                                    }}
                                                />
                                                <Tooltip formatter={(value) => formatVND(value)} labelFormatter={(label) => `Ngày ${label}`} />
                                                <Line type="monotone" dataKey="total_revenue" stroke="#0d9488" strokeWidth={3} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div>
                                        <h5 className="chart-title">
                                            <i className="fas fa-piggy-bank me-2 text-primary" />
                                            Doanh thu theo phương thức
                                        </h5>
                                        <div className="chart-subtitle">Theo dữ liệu payments</div>
                                    </div>
                                </div>

                                <div className="chart-block-sm">
                                    {revenueByMethodPieData.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-chart-pie"></i>
                                            <p>Chưa có dữ liệu</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <PieChart>
                                                <Tooltip formatter={(value, name) => [`${formatVND(value)}`, String(name ?? '')]} />
                                                <Pie
                                                    data={revenueByMethodPieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    innerRadius="58%"
                                                    outerRadius="78%"
                                                    stroke="none"
                                                    paddingAngle={2}
                                                >
                                                    {revenueByMethodPieData.map((entry, idx) => (
                                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>

                                <div className="mt-2">
                                    {revenueByMethodPieData.map((d, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center py-1">
                                            <div className="d-flex align-items-center gap-2 text-secondary">
                                                <span
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: 999,
                                                        background: d.color,
                                                        display: 'inline-block'
                                                    }}
                                                />
                                                <span>{d.name}</span>
                                            </div>
                                            <div className="fw-bold">{formatVND(d.value)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2: Transaction Count + Pending by Shift */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div>
                                        <h5 className="chart-title">
                                            <i className="fas fa-receipt me-2 text-primary" />
                                            Số giao dịch theo phương thức
                                        </h5>
                                        <div className="chart-subtitle">Count theo payment_method</div>
                                    </div>
                                </div>
                                <div className="chart-block-sm">
                                    {revenueByMethodTransactionsData.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-receipt"></i>
                                            <p>Chưa có giao dịch</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <BarChart data={revenueByMethodTransactionsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip formatter={(value) => [`${value} giao dịch`]} labelFormatter={(label) => `Phương thức: ${label}`} />
                                                <Bar dataKey="transactions" radius={[10, 10, 0, 0]}>
                                                    {revenueByMethodTransactionsData.map((entry, idx) => (
                                                        <Cell key={`bar-cell-${idx}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div>
                                        <h5 className="chart-title">
                                            <i className="fas fa-hourglass-half me-2 text-primary" />
                                            Lịch chờ theo ca
                                        </h5>
                                        <div className="chart-subtitle">Phân bổ shift (pending)</div>
                                    </div>
                                    <Link to="/admin/schedules" className="btn btn-outline-primary btn-sm">
                                        Xem duyệt lịch
                                    </Link>
                                </div>
                                <div className="chart-block-sm">
                                    {pendingByShiftData.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-check-circle"></i>
                                            <p>Không có lịch chờ</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <BarChart data={pendingByShiftData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="shift" tick={{ fontSize: 12 }} />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip formatter={(value) => [`${value} ca`]} labelFormatter={(label) => `Ca: ${label}`} />
                                                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                                    {pendingByShiftData.map((entry, idx) => (
                                                        <Cell key={`shift-cell-${idx}`} fill="#6366f1" />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 3: Top Doctors */}
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="chart-card">
                                <div className="chart-header">
                                    <div>
                                        <h5 className="chart-title">
                                            <i className="fas fa-user-doctor me-2 text-primary" />
                                            Top bác sĩ có lịch chờ duyệt
                                        </h5>
                                        <div className="chart-subtitle">Hiển thị tối đa 8 bác sĩ</div>
                                    </div>
                                </div>
                                <div className="chart-block">
                                    {pendingByDoctorData.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="fas fa-smile"></i>
                                            <p>Không có lịch chờ duyệt</p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <BarChart data={pendingByDoctorData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="doctor" interval={0} tick={{ fontSize: 12 }} />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip formatter={(value) => [`${value} ca`]} labelFormatter={(label) => `Bác sĩ: ${label}`} />
                                                <Bar dataKey="count" fill="#0d9488" radius={[10, 10, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
