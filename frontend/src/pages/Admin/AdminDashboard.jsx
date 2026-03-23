import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import api from '../../lib/api';
import './CSS/AdminDashboard.css';
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

const paymentMeta = {
    cash: { label: 'Tiền mặt', color: '#8b5cf6' },
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
            <div className="revenue-toolbar">
                <div>
                    <h3 className="chart-title mb-1">
                        <i className="fas fa-chart-pie me-2 text-primary" />
                        Dashboard Admin
                    </h3>
                    <div className="chart-subtitle">Doanh thu, phương thức thanh toán và lịch chờ duyệt</div>
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
                    <div className="row g-3 mb-3">
                        <div className="col-xl-3 col-md-6">
                            <div className="kpi-card">
                                <div className="kpi-title">Tổng doanh thu</div>
                                <div className="d-flex align-items-end justify-content-between gap-2">
                                    <div className="kpi-value">{formatVND(kpis.totalRevenue)}</div>
                                    <div className="text-primary" style={{ fontSize: 22 }}>
                                        <i className="fas fa-money-bill-wave" />
                                    </div>
                                </div>
                                <div className="kpi-meta">Tổng doanh thu từ bảng payments</div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                            <div className="kpi-card">
                                <div className="kpi-title">Số giao dịch</div>
                                <div className="d-flex align-items-end justify-content-between gap-2">
                                    <div className="kpi-value">{kpis.totalTransactions}</div>
                                    <div className="text-primary" style={{ fontSize: 22 }}>
                                        <i className="fas fa-receipt" />
                                    </div>
                                </div>
                                <div className="kpi-meta">Gộp theo các payment_method</div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                            <div className="kpi-card">
                                <div className="kpi-title">Trung bình mỗi giao dịch</div>
                                <div className="d-flex align-items-end justify-content-between gap-2">
                                    <div className="kpi-value">{formatVND(kpis.avgTicket)}</div>
                                    <div className="text-primary" style={{ fontSize: 22 }}>
                                        <i className="fas fa-scale-balanced" />
                                    </div>
                                </div>
                                <div className="kpi-meta">Trung bình = tổng / count</div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                            <div className="kpi-card">
                                <div className="kpi-title">Lịch chờ duyệt</div>
                                <div className="d-flex align-items-end justify-content-between gap-2">
                                    <div className="kpi-value text-danger">{kpis.pendingSchedulesCount}</div>
                                    <div className="text-danger" style={{ fontSize: 22 }}>
                                        <i className="fas fa-clock" />
                                    </div>
                                </div>
                                <div className="kpi-meta">Tổng số ca đang pending</div>
=======
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();

    return (
        <div className="admin-dashboard">
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.totalRevenue')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">45,000,000 ₫</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-success border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.newPatients')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">128</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-warning border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.pendingAppointments')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">24</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-danger border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.inventoryWarning')}</div>
                            <div className="h3 mb-0 fw-bold text-danger">5 {t('admin.medicines')}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">{t('admin.shortcuts')}</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/admin/medicines" className="btn btn-outline-primary px-4 py-3">
                                    <i className="fas fa-pills mb-2 fs-4 d-block"></i> {t('admin.manageMedicines')}
                                </Link>
                                <Link to="/admin/doctors" className="btn btn-outline-success px-4 py-3">
                                    <i className="fas fa-user-md mb-2 fs-4 d-block"></i> {t('admin.manageDoctors')}
                                </Link>
                                <Link to="/admin/specialties" className="btn btn-outline-info px-4 py-3">
                                    <i className="fas fa-stethoscope mb-2 fs-4 d-block"></i> {t('admin.specialties')}
                                </Link>
                                <Link to="/admin/posts" className="btn btn-outline-secondary px-4 py-3">
                                    <i className="fas fa-newspaper mb-2 fs-4 d-block"></i> {t('admin.managePosts')}
                                </Link>
                                <Link to="/admin/schedules" className="btn btn-outline-danger px-4 py-3">
                                    <i className="fas fa-calendar-check mb-2 fs-4 d-block"></i> {t('admin.approveSchedules')}
                                </Link>
>>>>>>> 488d556c37a28732ee10c077185157bae5eed8d9
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-8">
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
                                    <ResponsiveContainer width="100%" height="100%">
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
                                            <Line type="monotone" dataKey="total_revenue" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
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
                                    <ResponsiveContainer width="100%" height="100%">
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
                                    {revenueByMethodPieData.length === 0 && (
                                        <div className="text-center text-secondary py-3">Chưa có dữ liệu doanh thu.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mt-1">
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
                                    <ResponsiveContainer width="100%" height="100%">
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
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={pendingByShiftData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="shift" tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => [`${value} ca`]} labelFormatter={(label) => `Ca: ${label}`} />
                                            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                                {pendingByShiftData.map((entry, idx) => (
                                                    <Cell key={`shift-cell-${idx}`} fill="#8b5cf6" />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4 mt-1">
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
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={pendingByDoctorData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="doctor" interval={0} tick={{ fontSize: 12 }} />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip formatter={(value) => [`${value} ca`]} labelFormatter={(label) => `Bác sĩ: ${label}`} />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {pendingByDoctorData.length === 0 && (
                                    <div className="text-center text-secondary py-3">Không có lịch chờ duyệt.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0">Lối tắt quản trị</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex gap-3 flex-wrap">
                                        <Link to="/admin/medicines" className="btn btn-outline-primary px-4 py-3">
                                            <i className="fas fa-pills mb-2 fs-4 d-block"></i> Quản lý Thuốc
                                        </Link>
                                        <Link to="/admin/doctors" className="btn btn-outline-success px-4 py-3">
                                            <i className="fas fa-user-md mb-2 fs-4 d-block"></i> Quản lý Bác sĩ
                                        </Link>
                                        <Link to="/admin/receptionists" className="btn btn-outline-warning px-4 py-3">
                                            <i className="fas fa-user-tie mb-2 fs-4 d-block"></i> Quản lý Lễ tân
                                        </Link>
                                        <Link to="/admin/specialties" className="btn btn-outline-info px-4 py-3">
                                            <i className="fas fa-stethoscope mb-2 fs-4 d-block"></i> Chuyên Khoa
                                        </Link>
                                        <Link to="/admin/posts" className="btn btn-outline-secondary px-4 py-3">
                                            <i className="fas fa-newspaper mb-2 fs-4 d-block"></i> Quản lý Bài Viết
                                        </Link>
                                        <Link to="/admin/schedules" className="btn btn-outline-danger px-4 py-3">
                                            <i className="fas fa-calendar-check mb-2 fs-4 d-block"></i> Phê duyệt Lịch
                                        </Link>
                                    </div>
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
