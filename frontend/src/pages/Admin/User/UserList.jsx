import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import '../CSS/Admin.css';

/**
 * UserList Component
 * Hiển thị danh sách toàn bộ user trong hệ thống
 * Bao gồm: Bác sĩ, Lễ tân, Bệnh nhân
 */
const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, filterRole, filterStatus, users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/admin/users');
            setUsers(response.data.users || []);
            setError('');
        } catch (err) {
            console.error('Lỗi tải danh sách user:', err);
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Search by name or email
        if (searchTerm) {
            filtered = filtered.filter(u =>
                (u.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (u.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by role
        if (filterRole !== 'all') {
            filtered = filtered.filter(u => u.role === filterRole);
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(u => u.status === filterStatus);
        }

        setFilteredUsers(filtered);
    };

    const handleToggleLock = async (id, currentStatus) => {
        try {
            await api.put(`/api/admin/users/${id}/lock`, { status: currentStatus === 'active' ? 'inactive' : 'active' });
            alert(currentStatus === 'active' ? 'Đã khóa tài khoản!' : 'Đã mở khóa tài khoản!');
            fetchUsers();
        } catch (err) {
            alert('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const getRoleBadge = (role) => {
        const roleMap = {
            'admin': { label: 'Admin', color: 'danger' },
            'doctor': { label: 'Bác sĩ', color: 'info' },
            'receptionist': { label: 'Lễ tân', color: 'warning' },
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        Không có người dùng nào
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
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
            </div>

            {/* Stats */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Tổng Người Dùng</h6>
                            <h3 className="text-primary fw-bold">{users.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Đang Hoạt Động</h6>
                            <h3 className="text-success fw-bold">{users.filter(u => u.status === 'active').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Đã Khóa</h6>
                            <h3 className="text-danger fw-bold">{users.filter(u => u.status === 'inactive').length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-light border-0">
                        <div className="card-body text-center">
                            <h6 className="text-muted mb-2">Kết Quả Tìm Kiếm</h6>
                            <h3 className="text-info fw-bold">{filteredUsers.length}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
