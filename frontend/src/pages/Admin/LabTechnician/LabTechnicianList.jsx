import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from '../../../components/PaginationControls';
import api from '../../../lib/api';

const removeAccents = (str) => {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
};

const LabTechnicianList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const res = await api.get('/api/admin/lab-technicians');
            setItems(res.data.labTechnicians || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert(`Lỗi tải dữ liệu: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xóa kỹ thuật viên ${name}?`)) return;
        try {
            await api.delete(`/api/admin/lab-technicians/${id}`);
            alert('Đã xóa.');
            fetchData();
        } catch {
            alert('Không xóa được.');
        }
    };

    const filtered = items
        .filter((row) => {
            const name = row.full_name || '';
            const dept = row.department || '';
            const st = row.status || '';
            const q = removeAccents(searchTerm);
            const matchSearch =
                removeAccents(name).includes(q) ||
                removeAccents(dept).includes(q) ||
                removeAccents(row.username || '').includes(q);
            const matchStatus = filterStatus ? st === filterStatus : true;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => a.id - b.id);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageRows = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">Kỹ thuật viên xét nghiệm</h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm tên, bộ phận, username..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">— Trạng thái —</option>
                                <option value="Active">Đang hoạt động</option>
                                <option value="Inactive">Ngừng hoạt động</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách{' '}
                        <span className="badge bg-primary ms-2">
                            {pageRows.length}/{filtered.length} (Trang {currentPage}/{totalPages || 1})
                        </span>
                    </h5>
                    <Link to="/admin/lab-technicians/create" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus" /> Thêm KTV
                    </Link>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle mb-0">
                                    <thead className="table-light" style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <tr>
                                            <th className="text-center" width="5%">
                                                ID
                                            </th>
                                            <th className="text-center" width="6%">
                                                Ảnh
                                            </th>
                                            <th width="16%">Họ tên</th>
                                            <th width="14%">Bộ phận</th>
                                            <th width="12%">Điện thoại</th>
                                            <th width="16%">Email</th>
                                            <th className="text-center" width="10%">
                                                Trạng thái
                                            </th>
                                            <th className="text-center" width="21%">
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageRows.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="text-center py-5 text-muted">
                                                    Không có dữ liệu.
                                                </td>
                                            </tr>
                                        ) : (
                                            pageRows.map((row) => {
                                                const st = row.status || 'Active';
                                                const active = st === 'Active' || st === 'Đang hoạt động';
                                                return (
                                                    <tr key={row.id}>
                                                        <td className="text-center">{row.id}</td>
                                                        <td className="text-center">
                                                            {row.avatar_url ? (
                                                                <img
                                                                    src={row.avatar_url}
                                                                    alt=""
                                                                    className="rounded-circle"
                                                                    style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle bg-light text-muted d-inline-flex align-items-center justify-content-center fw-bold"
                                                                    style={{ width: 40, height: 40 }}
                                                                >
                                                                    {(row.full_name || '?').charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <strong>{row.full_name}</strong>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-info text-dark">
                                                                {row.department || '—'}
                                                            </span>
                                                        </td>
                                                        <td>{row.phone || '—'}</td>
                                                        <td>{row.email || '—'}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <Link
                                                                to={`/admin/lab-technicians/${row.id}`}
                                                                className="btn btn-sm btn-outline-info me-1 mb-1"
                                                                title="Xem"
                                                            >
                                                                <i className="fas fa-eye" />
                                                            </Link>
                                                            <Link
                                                                to={`/admin/lab-technicians/${row.id}/edit`}
                                                                className="btn btn-sm btn-outline-primary me-1 mb-1"
                                                                title="Sửa"
                                                            >
                                                                <i className="fas fa-edit" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(row.id, row.full_name)}
                                                                className="btn btn-sm btn-outline-danger mb-1"
                                                                title="Xóa"
                                                            >
                                                                <i className="fas fa-trash" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <div className="card-footer">
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianList;
