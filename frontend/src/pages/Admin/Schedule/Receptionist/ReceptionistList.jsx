import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../../lib/api';

/**
 * ReceptionistList Component
 * Admin xem danh sách Lễ tân và gán lịch
 */
const ReceptionistList = () => {
    const [receptionists, setReceptionists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReceptionists = async () => {
        try {
            const res = await api.get('/api/admin/receptionists');
            setReceptionists(res.data.receptionists || []);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi tải danh sách lễ tân:', error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchReceptionists(); }, []);

    // Lọc danh sách theo tên hoặc email
    const filteredReceptionists = receptionists.filter(r => {
        const searchLower = searchTerm.toLowerCase();
        return (
            r.username?.toLowerCase().includes(searchLower) ||
            r.email?.toLowerCase().includes(searchLower) ||
            r.full_name?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">
                <i className="fas fa-users text-info me-2"></i> Quản lý Lịch Lễ Tân
            </h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Search Bar */}
                <div className="p-3 border-bottom bg-light">
                    <div className="row g-2">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách Lễ Tân <span className="badge bg-primary ms-2">{filteredReceptionists.length}</span>
                    </h5>
                </div>

                {/* Body */}
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : filteredReceptionists.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-users fs-2 text-muted mb-3 d-block opacity-50"></i>
                            <p className="text-muted">Không tìm thấy lễ tân nào.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light" style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                    <tr>
                                        <th width="5%" className="text-center">ID</th>
                                        <th width="20%">Tên</th>
                                        <th width="25%">Email</th>
                                        <th width="20%">Số điện thoại</th>
                                        <th width="30%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReceptionists.map((receptionist) => (
                                        <tr key={receptionist.receptionist_id}>
                                            <td className="text-center fw-bold">{receptionist.id}</td>
                                            <td>
                                                <strong className="text-dark">{receptionist.full_name}</strong>
                                                <div className="text-muted small">@{receptionist.username}</div>
                                            </td>
                                            <td>{receptionist.email || 'N/A'}</td>
                                            <td>{receptionist.phone || 'N/A'}</td>
                                            <td className="text-center">
                                                <Link
                                                    to={`/admin/receptionists/${receptionist.receptionist_id}/schedule`}
                                                    className="btn btn-sm btn-primary shadow-sm"
                                                    title="Gán lịch"
                                                >
                                                    <i className="fas fa-calendar-alt me-1"></i> Gán Lịch
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionistList;
