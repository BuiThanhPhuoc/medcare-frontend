import { useState, useEffect } from 'react';
import PaginationControls from '../../../components/PaginationControls';
import api from '../../../lib/api';
import '../AdminDashboard.css';

/**
 * UserList Component
 * Hiển thị danh sách toàn bộ user trong hệ thống
 * Bao gồm: Bác sĩ, Lễ tân, Bệnh nhân
 */
const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch users from API with pagination and filters
    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            setError('');
            
            // Build query params
            const params = {
                page,
                limit: itemsPerPage
            };
            
            if (searchTerm) {
                params.search = searchTerm;
            }
            
            if (filterRole !== 'all') {
                params.role = filterRole;
            }
            
            if (filterStatus !== 'all') {
                params.status = filterStatus;
            }

            const response = await api.get('/api/admin/users', { params });
            
            if (response.data.success) {
                setUsers(response.data.users || []);
                setTotalUsers(response.data.pagination.total || 0);
                setTotalPages(Math.ceil(response.data.pagination.total / itemsPerPage) || 1);
                setCurrentPage(page);
            } else {
                setError('Không thể tải danh sách người dùng');
                setUsers([]);
                setTotalUsers(0);
                setTotalPages(1);
            }
        } catch (err) {
            console.error('Lỗi tải danh sách user:', err);
            setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
            setUsers([]);
            setTotalUsers(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search, filter change - reload from page 1
    useEffect(() => {
        fetchUsers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, filterRole, filterStatus]);

    const handleToggleLock = async (id, currentStatus) => {
        try {
            await api.put(`/api/admin/users/${id}/lock`, { status: currentStatus === 'active' ? 'inactive' : 'active' });
            // Show success message
            const message = currentStatus === 'active' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!';
            alert(message);
            // Reload users from current page
            fetchUsers(currentPage);
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const getRoleBadge = (role) => {
        const roleMap = {
            'admin': { label: 'Admin', color: 'danger' },
            'doctor': { label: 'Bác sĩ', color: 'info' },
            'receptionist': { label: 'Lễ tân', color: 'warning' },
            'lab_technician': { label: 'KTV xét nghiệm', color: 'primary' },
            'patient': { label: 'Bệnh nhân', color: 'success' }
        };
        const roleInfo = roleMap[role] || { label: role, color: 'secondary' };
        return <span className={`badge bg-${roleInfo.color}`}>{roleInfo.label}</span>;
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Quản Lý Người Dùng</h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Search & Filter Bar */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-3">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên, email hoặc SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
                            <select
                                className="form-select"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Bác sĩ</option>
                                <option value="receptionist">Lễ tân</option>
                                <option value="lab_technician">KTV xét nghiệm</option>
                                <option value="patient">Bệnh nhân</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-2">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white pb-3">
                    <span className="text-muted">
                        Trang {currentPage}/{totalPages || 1} | Hiển thị {users.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalUsers)} trên {totalUsers}
                    </span>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="fw-bold">STT</th>
                                <th className="fw-bold">Tên Đăng Nhập</th>
                                <th className="fw-bold">Email</th>
                                <th className="fw-bold">Số Điện Thoại</th>
                                <th className="fw-bold">Vai Trò</th>
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
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Không có người dùng nào
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                                        <td className="fw-500">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {user.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'} me-2`}
                                                onClick={() => handleToggleLock(user.id, user.status)}
                                                title={user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                            >
                                                <i className={`fas ${user.status === 'active' ? 'fa-lock' : 'fa-unlock'}`}></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {users.length > 0 && totalPages > 1 && (
                    <div className="card-footer bg-white">
                        <PaginationControls 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => fetchUsers(page)}
                            pageSize={itemsPerPage}
                            totalItems={totalUsers}
                        />
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Tổng Người Dùng</h6>
                            <h3 className="text-primary fw-bold">{totalUsers}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Đang Hoạt Động</h6>
                            <h3 className="text-success fw-bold">{users.filter(u => u.status === 'active').length}</h3>
                            <small className="text-muted">trên trang này</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Đã Khóa</h6>
                            <h3 className="text-danger fw-bold">{users.filter(u => u.status === 'inactive').length}</h3>
                            <small className="text-muted">trên trang này</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Hiển Thị Trên Trang</h6>
                            <h3 className="text-info fw-bold">{users.length}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
