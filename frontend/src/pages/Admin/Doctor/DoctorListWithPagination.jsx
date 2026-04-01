/**
 * DoctorList with Pagination & Export
 * Danh sách bác sĩ với server-side pagination và export Excel/PDF
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';
import PaginationControls from '../../../components/PaginationControls';
import ExportButton from '../../../components/ExportButton';
import usePagination from '../../../hooks/usePagination';
import useExport from '../../../hooks/useExport';
import EmptyState from '../../../components/EmptyState';

const DoctorListWithPagination = () => {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const pagination = usePagination(1, 10);
    const { exportDoctorsExcel, exportDoctorsPDF } = useExport();

    // Load specialties
    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const res = await api.get('/api/admin/specialties');
                setSpecialties(res.data.specialties || []);
            } catch (error) {
                console.error('Lỗi tải chuyên khoa:', error);
            }
        };
        loadSpecialties();
    }, []);

    // Load doctors with pagination
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                pagination.setLoading(true);

                // Build query params
                const params = new URLSearchParams({
                    page: pagination.page,
                    limit: pagination.limit
                });

                if (searchTerm) params.append('search', searchTerm);
                if (filterSpecialty) params.append('specialty', filterSpecialty);
                if (filterStatus) params.append('status', filterStatus);

                const res = await api.get(`/api/admin/doctors?${params}`);
                
                // Support cả response format
                if (res.data.pagination) {
                    // New format: {data, pagination}
                    pagination.setData(res.data.data || []);
                    pagination.setTotal(res.data.pagination.total);
                } else {
                    // Old format: {doctors}
                    pagination.setData(res.data.doctors || []);
                    pagination.setTotal((res.data.doctors || []).length);
                }

                pagination.setLoading(false);
            } catch (error) {
                console.error('Lỗi tải bác sĩ:', error);
                pagination.setError('Lỗi tải dữ liệu bác sĩ');
                pagination.setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, [pagination.page, pagination.limit, searchTerm, filterSpecialty, filterStatus]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa bác sĩ ${name}?`)) return;
        try {
            await api.delete(`/api/admin/doctors/${id}`);
            alert('Xóa thành công!');
            // Reload data
            pagination.reset();
        } catch {
            alert('Lỗi khi xóa bác sĩ!');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        pagination.setPage(1);
    };

    const handleExcelClick = () => exportDoctorsExcel();
    const handlePdfClick = () => exportDoctorsPDF();

    const doctors = pagination.data || [];
    const isEmpty = doctors.length === 0 && !loading;

    return (
        <div className="container-fluid py-4">
            <div style={{ marginBottom: '20px' }}>
                <h2 className="mb-0 fw-bold">Danh sách Bác sĩ</h2>
                <p className="text-muted mb-0">Quản lý thông tin bác sĩ trong hệ thống</p>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Filter Bar */}
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-4">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Tìm tên bác sĩ, chuyên khoa..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                className="form-select"
                                value={filterSpecialty}
                                onChange={(e) => {
                                    setFilterSpecialty(e.target.value);
                                    pagination.setPage(1);
                                }}
                            >
                                <option value="">-- Tất cả chuyên khoa --</option>
                                {specialties.map(sp => (
                                    <option key={sp.id} value={sp.name}>{sp.name}</option>
                                ))}
                            </select>
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
                                <option value="Active">Đang hoạt động</option>
                                <option value="Inactive">Ngừng hoạt động</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
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
                        <Link to="/admin/doctors/create" className="btn btn-primary btn-sm">
                            <i className="fas fa-plus"></i> Thêm mới
                        </Link>
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
                            icon="👨‍⚕️"
                            title="Không có bác sĩ"
                            description="Chưa có bác sĩ nào trong hệ thống. Hãy thêm bác sĩ mới để bắt đầu."
                            actionLabel="Thêm bác sĩ mới"
                            actionTo="/admin/doctors/create"
                        />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <th width="5%" className="text-center">ID</th>
                                        <th width="6%" className="text-center">Ảnh</th>
                                        <th width="14%">Họ Tên</th>
                                        <th width="13%">Chuyên Khoa</th>
                                        <th width="12%">Số điện thoại</th>
                                        <th width="15%">Email</th>
                                        <th width="8%">KN</th>
                                        <th width="10%" className="text-center">Trạng thái</th>
                                        <th width="22%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="text-center">{doc.id}</td>
                                            <td className="text-center">
                                                {doc.avatar_url ? (
                                                    <img src={doc.avatar_url} alt={doc.full_name} className="rounded-circle" style={{width:'40px', height:'40px', objectFit:'cover'}} />
                                                ) : (
                                                    <div className="rounded-circle bg-light text-muted d-inline-flex align-items-center justify-content-center fw-bold" style={{width:'40px', height:'40px'}}>
                                                        {(doc.full_name || 'B').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td><strong className="text-dark">{doc.full_name}</strong></td>
                                            <td><span className="badge bg-primary px-2 py-1">{doc.specialty || 'N/A'}</span></td>
                                            <td>{doc.phone || 'N/A'}</td>
                                            <td>{doc.email || 'N/A'}</td>
                                            <td>{doc.experience_years ? `${doc.experience_years} năm` : '0 năm'}</td>
                                            <td className="text-center">
                                                <span className={`badge ${doc.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {doc.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Link to={`/admin/doctors/${doc.id}`} className="btn btn-sm btn-outline-info me-1 mb-1" title="Xem"><i className="fas fa-eye"></i></Link>
                                                <Link to={`/admin/doctors/${doc.id}/edit`} className="btn btn-sm btn-outline-primary me-1 mb-1" title="Sửa"><i className="fas fa-edit"></i></Link>
                                                <button onClick={() => handleDelete(doc.id, doc.full_name)} className="btn btn-sm btn-outline-danger mb-1" title="Xóa"><i className="fas fa-trash"></i></button>
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

export default DoctorListWithPagination;
