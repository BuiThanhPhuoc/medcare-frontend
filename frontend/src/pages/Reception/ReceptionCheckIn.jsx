import { useState, useEffect } from 'react';
import { useReceptionUser } from './hooks/useReceptionUser';
import { useCurrentTime } from './hooks/useCurrentTime';
import api from '../../lib/api';
import './CSS/Reception.css';

/**
 * Reception Check-in Component
 * Dành cho lễ tân check-in bệnh nhân vào phòng khám
 * 
 * Chức năng:
 * 1. Hiển thị danh sách bệnh nhân hôm nay
 * 2. Check-in bệnh nhân (cập nhật trạng thái)
 * 3. Xem lịch hẹn của bệnh nhân
 */
const ReceptionCheckIn = () => {
    const { user, isLoading, handleLogout } = useReceptionUser();
    const currentTime = useCurrentTime();
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

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
                <div className="text-end">
                    <div className="fw-bold">{currentTime.toLocaleTimeString('vi-VN')}</div>
                    <small className="text-muted">{currentTime.toLocaleDateString('vi-VN')}</small>
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
                                <h6 className="text-muted mb-2">Đã Check-in</h6>
                                <h3 className="text-success fw-bold">{patients.filter(p => p.status === 'checked-in').length}</h3>
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
                                    <option value="checked-in">Đã Check-in</option>
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
                                                <span className={`badge ${
                                                    patient.status === 'checked-in' ? 'bg-success' :
                                                    patient.status === 'pending' ? 'bg-warning' :
                                                    patient.status === 'completed' ? 'bg-info' : 'bg-secondary'
                                                }`}>
                                                    {patient.status === 'checked-in' ? 'Đã Check-in' :
                                                     patient.status === 'pending' ? 'Chưa Check-in' :
                                                     patient.status === 'completed' ? 'Hoàn tất' : 'Huỷ'}
                                                </span>
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
        </div>
    );
};

export default ReceptionCheckIn;
