import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import '../CSS/Admin.css';

const ReceptionistList = () => {
    const navigate = useNavigate();
    const [receptionists, setReceptionists] = useState([]);
    const [filteredReceptionists, setFilteredReceptionists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReceptionists();
    }, []);

    useEffect(() => {
        filterReceptionists();
    }, [searchTerm, filterStatus, receptionists]);

    const fetchReceptionists = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/receptionists');
            setReceptionists(response.data.receptionists || []);
            setError('');
        } catch (err) {
            console.error('Lỗi tải danh sách lễ tân:', err);
            setError('Không thể tải danh sách lễ tân');
        } finally {
            setLoading(false);
        }
    };

    const filterReceptionists = () => {
        let filtered = receptionists;

        // Search by name or email
        if (searchTerm) {
            filtered = filtered.filter(r =>
                (r.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (r.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (r.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        setFilteredReceptionists(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa lễ tân này?')) {
            try {
                await api.delete(`/api/admin/receptionists/${id}`);
                alert('Xóa lễ tân thành công!');
                fetchReceptionists();
            } catch (err) {
                alert('Lỗi: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleView = (receptionist) => {
        navigate(`/admin/receptionists/${receptionist.id}/detail`, { state: { receptionist } });
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Quản Lý Lễ Tân</h2>
                <Link to="/admin/receptionists/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Thêm Lễ Tân
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Search & Filter Bar */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-3">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên, email hoặc SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Tạm dừng</option>
                            </select>
                        </div>
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-outline-secondary w-100" onClick={fetchReceptionists}>
                                <i className="fas fa-sync me-2"></i>Tải lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="fw-bold">STT</th>
                                <th className="fw-bold">Avatar</th>
                                <th className="fw-bold">Họ và Tên</th>
                                <th className="fw-bold">Email</th>
                                <th className="fw-bold">Số Điện Thoại</th>
                                <th className="fw-bold">Ngày Tuyển Dụng</th>
                                <th className="fw-bold">Trạng Thái</th>
                                <th className="fw-bold">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredReceptionists.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                filteredReceptionists.map((receptionist, index) => (
                                    <tr key={receptionist.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={receptionist.avatar || 'https://via.placeholder.com/40x40?text=No+Avatar'}
                                                alt="Avatar"
                                                width="40"
                                                height="40"
                                                className="rounded-circle"
                                            />
                                        </td>
                                        <td className="fw-500">{receptionist.full_name}</td>
                                        <td>{receptionist.email}</td>
                                        <td>{receptionist.phone}</td>
                                        <td>{receptionist.hire_date ? new Date(receptionist.hire_date).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                        <td>
                                            <span className={`badge ${receptionist.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {receptionist.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => handleView(receptionist)}
                                                title="Xem chi tiết"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <Link
                                                to={`/admin/receptionists/${receptionist.id}/edit`}
                                                className="btn btn-sm btn-warning me-2"
                                                title="Chỉnh sửa"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(receptionist.id)}
                                                title="Xóa"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Tổng Lễ Tân</h6>
                            <h3 className="text-primary fw-bold">{receptionists.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Đang Hoạt Động</h6>
                            <h3 className="text-success fw-bold">{receptionists.filter(r => r.status === 'active').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Tạm Dừng</h6>
                            <h3 className="text-danger fw-bold">{receptionists.filter(r => r.status === 'inactive').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Kết Quả Tìm Kiếm</h6>
                            <h3 className="text-info fw-bold">{filteredReceptionists.length}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistList;