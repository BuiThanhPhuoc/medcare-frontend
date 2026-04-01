/**
 * PatientList with Pagination & Export
 * Danh sách bệnh nhân với server-side pagination và export Excel/PDF
 */

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import PaginationControls from '../../../components/PaginationControls';
import ExportButton from '../../../components/ExportButton';
import usePagination from '../../../hooks/usePagination';
import useExport from '../../../hooks/useExport';
import EmptyState from '../../../components/EmptyState';

const PatientListWithPagination = () => {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const pagination = usePagination(1, 10);
    const { exportPatientsExcel, exportPatientsPDF } = useExport();

    // Load patients with pagination
    useEffect(() => {
        const loadPatients = async () => {
            try {
                setLoading(true);
                pagination.setLoading(true);

                // Build query params
                const params = new URLSearchParams({
                    page: pagination.page,
                    limit: pagination.limit
                });

                if (searchTerm) params.append('search', searchTerm);
                params.append('role', 'patient');
                if (filterStatus) params.append('status', filterStatus);

                const res = await api.get(`/api/admin/users?${params}`);
                
                // Support both response formats
                if (res.data.pagination) {
                    pagination.setData(res.data.data || []);
                    pagination.setTotal(res.data.pagination.total);
                } else {
                    pagination.setData(res.data.users || []);
                    pagination.setTotal((res.data.users || []).length);
                }

                pagination.setLoading(false);
            } catch (error) {
                console.error('Lỗi tải bệnh nhân:', error);
                pagination.setError('Lỗi tải dữ liệu bệnh nhân');
                pagination.setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        loadPatients();
    }, [pagination.page, pagination.limit, searchTerm, filterStatus]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn khóa tài khoản ${name}?`)) return;
        try {
            await api.put(`/api/admin/users/${id}/lock`);
            alert('Khóa tài khoản thành công!');
            pagination.reset();
        } catch {
            alert('Lỗi khi khóa tài khoản!');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        pagination.setPage(1);
    };

    const handleExcelClick = () => exportPatientsExcel();
    const handlePdfClick = () => exportPatientsPDF();

    const patients = pagination.data?.filter(u => u.role === 'patient') || [];
    const isEmpty = patients.length === 0 && !loading;

    return (
        <div className="container-fluid py-4">
            <div style={{ marginBottom: '20px' }}>
                <h2 className="mb-0 fw-bold">Danh sách Bệnh nhân</h2>
                <p className="text-muted mb-0">Quản lý hồ sơ bệnh nhân trong hệ thống</p>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Filter Bar */}
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-5">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Tìm tên, email, SĐT..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    pagination.setPage(1);
                                }}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-grid">
                            <button type="reset" className="btn btn-dark btn-sm">
                                <i className="fas fa-redo"></i> Làm mới
                            </button>
                        </div>
                    </form>
                </div>

                {/* Header with Actions */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách <span className="badge bg-primary ms-2">{pagination.total}</span>
                    </h5>
                    <div className="d-flex gap-2">
                        <ExportButton
                            onExcelClick={handleExcelClick}
                            onPdfClick={handlePdfClick}
                            label="Xuất"
                            showPdf={true}
                            showExcel={true}
                            size="sm"
                        />
                    </div>
                </div>

                {/* Table or Empty State */}
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : isEmpty ? (
                        <EmptyState
                            icon="👥"
                            title="Không có bệnh nhân"
                            description="Chưa có bệnh nhân nào trong hệ thống."
                        />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <th width="5%" className="text-center">ID</th>
                                        <th width="15%">Tên</th>
                                        <th width="18%">Email</th>
                                        <th width="12%">SĐT</th>
                                        <th width="12%">Role</th>
                                        <th width="12%" className="text-center">Trạng thái</th>
                                        <th width="16%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td className="text-center">{patient.id}</td>
                                            <td><strong className="text-dark">{patient.username}</strong></td>
                                            <td>{patient.email || 'N/A'}</td>
                                            <td>{patient.phone || 'N/A'}</td>
                                            <td><span className="badge bg-info">{patient.role}</span></td>
                                            <td className="text-center">
                                                <span className={`badge ${patient.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                    {patient.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    onClick={() => handleDelete(patient.id, patient.username)} 
                                                    className="btn btn-sm btn-outline-danger mb-1" 
                                                    title="Khóa tài khoản"
                                                >
                                                    <i className="fas fa-lock"></i>
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

export default PatientListWithPagination;
