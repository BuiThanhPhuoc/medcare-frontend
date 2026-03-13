import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CSS/Reception.css';

const ReceptionHome = () => {
    const [user, setUser] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    // Dữ liệu giả lập (Mock Data) theo đúng thiết kế Laravel của bạn
    const stats = { todayShifts: 1, weeklyShifts: 5, status: 'Hoạt động', totalHours: 40 };
    const personalInfo = {
        fullName: user.username || 'Nhân viên',
        position: 'Lễ Tân / Thu Ngân',
        email: 'letan@medcare.vn',
        phone: '0912 345 678'
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) navigate('/login');
        else setUser(JSON.parse(storedUser));

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    return (
        <div className="reception-layout">
            {/* WELCOME HEADER (Tương đương card linear-gradient ở Laravel) */}
            <div className="reception-header mb-4">
                <div className="header-left">
                    <h2>👋 Xin chào, {user.username}!</h2>
                    <p>{personalInfo.position} • {formatDate(currentTime)}</p>
                </div>
                <div className="header-right">
                    <div className="time-display">
                        <div className="time-text text-coral">{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="date-text">Thời gian hiện tại</div>
                    </div>
                    <button onClick={handleLogout} className="btn-soft-logout text-coral" title="Đăng xuất">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            {/* THAO TÁC NHANH (Nút chức năng chính của Lễ tân) */}
            <div className="quick-actions-bar mb-4">
                <div className="action-label">
                    <i className="fas fa-bolt text-coral"></i> <strong>Thao tác nhanh:</strong>
                </div>
                <Link to="/reception" className="soft-btn btn-coral-soft">
                    <i className="fas fa-user-check"></i> Check-in Bệnh nhân
                </Link>
                <Link to="/billing" className="soft-btn btn-outline-soft">
                    <i className="fas fa-file-invoice-dollar"></i> Quầy Thu ngân
                </Link>
            </div>

            {/* QUICK STATS (4 Cột giống Laravel) */}
            <div className="stats-grid mb-4">
                <div className="soft-stat-card border-top-purple">
                    <div className="stat-content">
                        <p>Ca hôm nay</p>
                        <h3 className="text-purple">{stats.todayShifts}</h3>
                    </div>
                    <div className="stat-icon bg-purple-light text-purple"><i className="fas fa-calendar-check"></i></div>
                </div>

                <div className="soft-stat-card border-top-emerald">
                    <div className="stat-content">
                        <p>Ca tuần này</p>
                        <h3 className="text-emerald">{stats.weeklyShifts}</h3>
                    </div>
                    <div className="stat-icon bg-emerald-light text-emerald"><i className="fas fa-calendar-week"></i></div>
                </div>

                <div className="soft-stat-card border-top-amber">
                    <div className="stat-content">
                        <p>Trạng thái</p>
                        <h3 className="text-amber fs-5 mt-1">{stats.status}</h3>
                    </div>
                    <div className="stat-icon bg-amber-light text-amber"><i className="fas fa-user-check"></i></div>
                </div>

                <div className="soft-stat-card border-top-blue">
                    <div className="stat-content">
                        <p>Tổng giờ tuần</p>
                        <h3 className="text-blue">{stats.totalHours} <span className="fs-6 fw-normal">giờ</span></h3>
                    </div>
                    <div className="stat-icon bg-blue-light text-blue"><i className="fas fa-clock"></i></div>
                </div>
            </div>

            {/* MAIN CONTENT SPLIT (Row với 2 cột 6-6) */}
            <div className="content-grid-half mb-4">
                {/* CA LÀM VIỆC HÔM NAY */}
                <div className="soft-panel">
                    <div className="panel-header">
                        <h5><i className="fas fa-calendar-day text-blue me-2"></i> Ca làm việc hôm nay</h5>
                        <small className="text-muted">{currentTime.toLocaleDateString('vi-VN')}</small>
                    </div>
                    <div className="panel-body p-0">
                        <table className="soft-table">
                            <thead>
                                <tr>
                                    <th>Giờ bắt đầu</th>
                                    <th>Giờ kết thúc</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span className="time-badge bg-blue-light text-blue">07:00</span></td>
                                    <td><span className="time-badge bg-emerald-light text-emerald">15:00</span></td>
                                    <td className="text-muted">Ca hành chính</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* THÔNG TIN CÁ NHÂN */}
                <div className="soft-panel">
                    <div className="panel-header">
                        <h5><i className="fas fa-id-badge text-emerald me-2"></i> Thông tin cá nhân</h5>
                    </div>
                    <div className="panel-body">
                        <div className="personal-info-grid">
                            <div className="info-box">
                                <i className="fas fa-user-circle text-blue fs-3"></i>
                                <div>
                                    <small className="text-muted d-block">Họ tên</small>
                                    <strong>{personalInfo.fullName}</strong>
                                </div>
                            </div>
                            <div className="info-box">
                                <i className="fas fa-briefcase text-emerald fs-3"></i>
                                <div>
                                    <small className="text-muted d-block">Chức vụ</small>
                                    <strong>{personalInfo.position}</strong>
                                </div>
                            </div>
                            <div className="info-box">
                                <i className="fas fa-envelope text-purple fs-3"></i>
                                <div>
                                    <small className="text-muted d-block">Email</small>
                                    <strong>{personalInfo.email}</strong>
                                </div>
                            </div>
                            <div className="info-box">
                                <i className="fas fa-phone-alt text-amber fs-3"></i>
                                <div>
                                    <small className="text-muted d-block">Điện thoại</small>
                                    <strong>{personalInfo.phone}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LỊCH TUẦN NÀY (Full Width) */}
            <div className="soft-panel">
                <div className="panel-header">
                    <h5><i className="fas fa-calendar-alt text-coral me-2"></i> Lịch làm việc tuần này</h5>
                </div>
                <div className="panel-body p-0">
                    <table className="soft-table table-hover">
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Thứ</th>
                                <th>Giờ làm việc</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="row-highlight">
                                <td><strong>Hôm nay</strong></td>
                                <td>{currentTime.toLocaleDateString('vi-VN', { weekday: 'long' })}</td>
                                <td>
                                    <span className="time-badge bg-blue-light text-blue">07:00</span>
                                    <i className="fas fa-arrow-right mx-2 text-muted"></i>
                                    <span className="time-badge bg-emerald-light text-emerald">15:00</span>
                                </td>
                                <td>Ca sáng</td>
                            </tr>
                            <tr>
                                <td><strong>Ngày mai</strong></td>
                                <td>Thứ Sáu</td>
                                <td>
                                    <span className="time-badge bg-blue-light text-blue">14:00</span>
                                    <i className="fas fa-arrow-right mx-2 text-muted"></i>
                                    <span className="time-badge bg-emerald-light text-emerald">22:00</span>
                                </td>
                                <td>Ca chiều</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReceptionHome;