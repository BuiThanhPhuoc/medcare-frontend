import { useState, useEffect } from 'react';
import { useReceptionUser } from '../hooks/useReceptionUser';
import { useCurrentTime } from '../hooks/useCurrentTime';
import QuickCheckInModal from '../components/QuickCheckInModal';
import api from '../../../lib/api';
import '../ReceptionDashboard.css';

/**
 * Reception Check-in Component
 * Dành cho lễ tân check-in bệnh nhân vào phòng khám
 * 
 * Chức năng:
 * 1. Hiển thị danh sách bệnh nhân hôm nay
 * 2. Check-in bệnh nhân (cập nhật trạng thái)
 * 3. Xem lịch hẹn của bệnh nhân
 * 4. Đăng ký khám nhanh (walk-in)
 * 5. Quản lý trạng thái hàng đợi chi tiết
 */
const ReceptionCheckIn = () => {
    const { isLoading } = useReceptionUser();
    const currentTime = useCurrentTime();
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showQuickCheckInModal, setShowQuickCheckInModal] = useState(false);

    useEffect(() => {
        fetchTodayPatients();
    }, []);

    const fetchTodayPatients = async () => {
        try {
            setLoadingPatients(true);
            const response = await api.get('/api/appointments/today');
            setPatients(response.data.appointments || []);
        } catch (error) {
            console.error('Lỗi tải danh sách bệnh nhân:', error);
            setPatients([]);
        } finally {
            setLoadingPatients(false);
        }
    };

    const handleCheckIn = async (appointmentId) => {
        try {
            await api.put(`/api/appointments/${appointmentId}/check-in`);
            alert('Check-in thành công!');
            fetchTodayPatients();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    // Get queue status badge with colors
    const getQueueStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Chưa Check-in', icon: 'fas fa-hourglass-start', color: 'warning', bg: '#fff3cd' },
            'checked-in': { label: 'Xếp hàng', icon: 'fas fa-users', color: 'info', bg: '#d1ecf1' },
            'in-examination': { label: 'Đang khám', icon: 'fas fa-stethoscope', color: 'primary', bg: '#cfe2ff' },
            'waiting-lab': { label: 'Chờ cận lâm sàng', icon: 'fas fa-flask', color: 'secondary', bg: '#e2e3e5' },
            'waiting-payment': { label: 'Chờ thanh toán', icon: 'fas fa-cash-register', color: 'success', bg: '#d1e7dd' },
            'completed': { label: 'Hoàn tất', icon: 'fas fa-check-circle', color: 'success', bg: '#d1e7dd' },
            'cancelled': { label: 'Huỷ', icon: 'fas fa-times-circle', color: 'danger', bg: '#f8d7da' }
        };
        
        return statusMap[status] || statusMap['pending'];
    };

    const handleQuickCheckInSuccess = () => {
        // Tải lại danh sách bệnh nhân
        fetchTodayPatients();
    };

    // Filter patients
    const filtered = patients.filter(p => {
        const matchSearch = !searchTerm || 
            p.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.patient_phone?.includes(searchTerm);
        
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchSearch && matchStatus;
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="reception-layout">
            {/* Header */}
            <div className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
                <div>
                    <h4 className="fw-bold mb-0">
                        <i className="fas fa-clipboard-check text-success me-2"></i> Check-in Bệnh nhân
                    </h4>
                    <small className="text-muted">Quản lý bệnh nhân đến khám hôm nay</small>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className="btn btn-success btn-sm"
                        onClick={() => setShowQuickCheckInModal(true)}
                        title="Đăng ký bệnh nhân vãng lai (walk-in)"
                    >
                        <i className="fas fa-user-plus me-2"></i>
                        Khám nhanh
                    </button>
                    <div className="text-end">
                        <div className="fw-bold">{currentTime.toLocaleTimeString('vi-VN')}</div>
                        <small className="text-muted">{currentTime.toLocaleDateString('vi-VN')}</small>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-4">
                {/* Stats */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card bg-light border-0">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Tổng bệnh nhân hôm nay</h6>
                                <h3 className="text-primary fw-bold">{patients.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light border-0">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Xếp hàng</h6>
                                <h3 className="text-info fw-bold">{patients.filter(p => p.status === 'checked-in').length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light border-0">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Chưa Check-in</h6>
                                <h3 className="text-warning fw-bold">{patients.filter(p => p.status === 'pending').length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light border-0">
                            <div className="card-body text-center">
                                <h6 className="text-muted mb-2">Chờ thanh toán</h6>
                                <h3 className="text-success fw-bold">{patients.filter(p => p.status === 'waiting-payment').length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-3">
                        <div className="row">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm theo tên hoặc SĐT..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <select
                                    className="form-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chưa Check-in</option>
                                    <option value="checked-in">Xếp hàng</option>
                                    <option value="in-examination">Đang khám</option>
                                    <option value="waiting-lab">Chờ cận lâm sàng</option>
                                    <option value="waiting-payment">Chờ thanh toán</option>
                                    <option value="completed">Hoàn tất</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="fw-bold">STT</th>
                                    <th className="fw-bold">Tên Bệnh Nhân</th>
                                    <th className="fw-bold">SĐT</th>
                                    <th className="fw-bold">Giờ Hẹn</th>
                                    <th className="fw-bold">Bác Sĩ</th>
                                    <th className="fw-bold">Trạng Thái</th>
                                    <th className="fw-bold">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingPatients ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            Không có bệnh nhân nào
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((patient, index) => (
                                        <tr key={patient.id}>
                                            <td>{index + 1}</td>
                                            <td className="fw-500">{patient.patient_name}</td>
                                            <td>{patient.patient_phone}</td>
                                            <td>{new Date(patient.appointment_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td>{patient.doctor_name || 'N/A'}</td>
                                            <td>
                                                {(() => {
                                                    const statusInfo = getQueueStatusBadge(patient.status);
                                                    return (
                                                        <span 
                                                            className={`badge bg-${statusInfo.color}`}
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                                            title={statusInfo.label}
                                                        >
                                                            <i className={statusInfo.icon}></i>
                                                            {statusInfo.label}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td>
                                                {patient.status === 'pending' && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleCheckIn(patient.id)}
                                                        title="Check-in bệnh nhân"
                                                    >
                                                        <i className="fas fa-check-circle me-1"></i> Check-in
                                                    </button>
                                                )}
                                                {patient.status === 'checked-in' && (
                                                    <span className="text-success fw-bold">
                                                        <i className="fas fa-check-circle"></i>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal đăng ký khám nhanh */}
            <QuickCheckInModal 
                show={showQuickCheckInModal}
                onHide={() => setShowQuickCheckInModal(false)}
                onSuccess={handleQuickCheckInSuccess}
            />
        </div>
    );
};

export default ReceptionCheckIn;
