/**
 * AppointmentList with Pagination & Export  
 * Danh sách lịch khám với server-side pagination
 */

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import PaginationControls from '../../../components/PaginationControls';
import ExportButton from '../../../components/ExportButton';
import usePagination from '../../../hooks/usePagination';
import useExport from '../../../hooks/useExport';
import EmptyState from '../../../components/EmptyState';

const AppointmentListWithPagination = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const pagination = usePagination(1, 10);
    const { exportAppointmentsExcel } = useExport();

    // Load doctors
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const res = await api.get('/api/admin/doctors?page=1&limit=100');
                const doctorList = res.data.data || res.data.doctors || [];
                setDoctors(doctorList);
            } catch (error) {
                console.error('Lỗi tải danh sách bác sĩ:', error);
            }
        };
        loadDoctors();
    }, []);

    // Load appointments with pagination
    useEffect(() => {
        const loadAppointments = async () => {
            try {
                setLoading(true);
                pagination.setLoading(true);

                // Build query params
                const params = new URLSearchParams({
                    page: pagination.page,
                    limit: pagination.limit
                });

                if (searchTerm) params.append('search', searchTerm);
                if (filterStatus) params.append('status', filterStatus);
                if (filterDoctor) params.append('doctorId', filterDoctor);
                if (filterDateFrom) params.append('dateFrom', filterDateFrom);
                if (filterDateTo) params.append('dateTo', filterDateTo);

                const res = await api.get(`/api/admin/appointments?${params}`);
                
                // Support both response formats
                if (res.data.pagination) {
                    pagination.setData(res.data.data || []);
                    pagination.setTotal(res.data.pagination.total);
                } else {
                    pagination.setData(res.data.appointments || []);
                    pagination.setTotal((res.data.appointments || []).length);
                }

                pagination.setLoading(false);
            } catch (error) {
                console.error('Lỗi tải lịch khám:', error);
                pagination.setError('Lỗi tải dữ liệu lịch khám');
                pagination.setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, [pagination.page, pagination.limit, searchTerm, filterStatus, filterDoctor, filterDateFrom, filterDateTo]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/api/admin/appointments/${id}/status`, { status: newStatus });
            alert('Cập nhật trạng thái thành công!');
            pagination.reset();
        } catch (error) {
            alert('Lỗi cập nhật trạng thái!');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa lịch khám này?')) return;
        try {
            await api.delete(`/api/admin/appointments/${id}`);
            alert('Xóa lịch khám thành công!');
            pagination.reset();
        } catch {
            alert('Lỗi khi xóa lịch khám!');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        pagination.setPage(1);
    };

    const handleExcelClick = () => exportAppointmentsExcel();

    const appointments = pagination.data || [];
    const isEmpty = appointments.length === 0 && !loading;

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { class: 'bg-warning', text: 'Chờ xác nhận' },
            confirmed: { class: 'bg-info', text: 'Đã xác nhận' },
            completed: { class: 'bg-success', text: 'Hoàn thành' },
            cancelled: { class: 'bg-danger', text: 'Hủy' }
        };
        const config = statusMap[status] || { class: 'bg-secondary', text: status };
        return <span className={`badge ${config.class}`}>{config.text}</span>;
    };

    return (
        <div className="container-fluid py-4">
            <div style={{ marginBottom: '20px' }}>
                <h2 className="mb-0 fw-bold">Danh sách Lịch khám</h2>
                <p className="text-muted mb-0">Quản lý lịch khám của bệnh nhân</p>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Filter Bar */}
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-12">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Tìm tên bệnh nhân, SĐT, bác sĩ..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    pagination.setPage(1);
                                }}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Hủy</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={filterDoctor}
                                onChange={(e) => {
                                    setFilterDoctor(e.target.value);
                                    pagination.setPage(1);
                                }}
                            >
                                <option value="">-- Tất cả bác sĩ --</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input 
                                type="date" 
                                className="form-control" 
                                value={filterDateFrom}
                                onChange={(e) => {
                                    setFilterDateFrom(e.target.value);
                                    pagination.setPage(1);
                                }}
                                placeholder="Từ ngày"
                            />
                        </div>
                        <div className="col-md-3">
                            <input 
                                type="date" 
                                className="form-control" 
                                value={filterDateTo}
                                onChange={(e) => {
                                    setFilterDateTo(e.target.value);
                                    pagination.setPage(1);
                                }}
                                placeholder="Đến ngày"
                            />
                        </div>
                    </form>
                </div>

                {/* Header with Actions */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách <span className="badge bg-primary ms-2">{pagination.total}</span>
                    </h5>
                    <ExportButton
                        onExcelClick={handleExcelClick}
                        onPdfClick={() => {}}
                        label="Xuất Excel"
                        showPdf={false}
                        showExcel={true}
                        size="sm"
                    />
                </div>

                {/* Table or Empty State */}
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : isEmpty ? (
                        <EmptyState
                            icon="📅"
                            title="Không có lịch khám"
                            description="Chưa có lịch khám nào trong hệ thống."
                        />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <th width="8%" className="text-center">ID</th>
                                        <th width="12%">Bệnh nhân</th>
                                        <th width="12%">Bác sĩ</th>
                                        <th width="12%">Ngày khám</th>
                                        <th width="8%" className="text-center">Giờ</th>
                                        <th width="12%" className="text-center">Trạng thái</th>
                                        <th width="18%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((appt) => (
                                        <tr key={appt.id}>
                                            <td className="text-center">{appt.id}</td>
                                            <td>
                                                <strong>{appt.patient_name}</strong>
                                                <br/>
                                                <small className="text-muted">{appt.patient_phone}</small>
                                            </td>
                                            <td>{appt.doctor_name}</td>
                                            <td>{new Date(appt.appointment_date).toLocaleDateString('vi-VN')}</td>
                                            <td className="text-center">{appt.appointment_time}</td>
                                            <td className="text-center">
                                                {getStatusBadge(appt.status)}
                                            </td>
                                            <td className="text-center">
                                                <select 
                                                    className="form-select form-select-sm d-inline-block" 
                                                    style={{ width: 'auto' }}
                                                    value={appt.status}
                                                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                                                >
                                                    <option value="pending">Chờ</option>
                                                    <option value="confirmed">Xác nhận</option>
                                                    <option value="completed">Hoàn thành</option>
                                                    <option value="cancelled">Hủy</option>
                                                </select>
                                                <button 
                                                    onClick={() => handleDelete(appt.id)} 
                                                    className="btn btn-sm btn-outline-danger ms-2" 
                                                    title="Xóa"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isEmpty && (
                    <PaginationControls
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.goToPage}
                        pageSize={pagination.limit}
                        onPageSizeChange={pagination.setPageSize}
                        totalItems={pagination.total}
                    />
                )}
            </div>
        </div>
    );
};

export default AppointmentListWithPagination;
