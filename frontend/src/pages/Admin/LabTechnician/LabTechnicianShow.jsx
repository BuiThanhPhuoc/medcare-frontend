import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';

const LabTechnicianShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [row, setRow] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/api/admin/lab-technicians/${id}`);
                setRow(res.data.labTechnician);
            } catch {
                setRow(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Xóa kỹ thuật viên này?')) return;
        try {
            await api.delete(`/api/admin/lab-technicians/${id}`);
            alert('Đã xóa.');
            navigate('/admin/lab-technicians');
        } catch {
            alert('Lỗi khi xóa.');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    if (!row) {
        return (
            <div className="container py-5 text-center text-muted">
                Không tìm thấy kỹ thuật viên.
                <div className="mt-3">
                    <Link to="/admin/lab-technicians" className="btn btn-outline-secondary">
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    const active = row.status === 'Active' || row.status === 'Đang hoạt động';

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-flask text-info me-2" /> Kỹ thuật viên xét nghiệm
                </h2>
                <Link to="/admin/lab-technicians" className="btn btn-secondary">
                    <i className="fas fa-arrow-left" /> Quay lại
                </Link>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-body text-center p-4">
                            {row.avatar_url ? (
                                <img
                                    src={row.avatar_url}
                                    alt=""
                                    className="rounded-circle mb-3 shadow-sm"
                                    style={{ width: 150, height: 150, objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{ width: 150, height: 150 }}
                                >
                                    <i className="fas fa-user-circle text-muted" style={{ fontSize: '5rem' }} />
                                </div>
                            )}
                            <h4 className="fw-bold mb-1">{row.full_name}</h4>
                            <p className="text-muted mb-3">{row.department || '—'}</p>
                            <span
                                className={`badge ${active ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill`}
                            >
                                {active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                            </span>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Thao tác</h5>
                        </div>
                        <div className="card-body">
                            <Link to={`/admin/lab-technicians/${row.id}/edit`} className="btn btn-primary w-100 mb-2">
                                <i className="fas fa-pencil-alt me-2" /> Chỉnh sửa
                            </Link>
                            <button type="button" onClick={handleDelete} className="btn btn-danger w-100">
                                <i className="fas fa-trash me-2" /> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Thông tin</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Username</strong>
                                    <p className="mb-0">{row.username}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Email</strong>
                                    <p className="mb-0">{row.email || '—'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Điện thoại</strong>
                                    <p className="mb-0">{row.phone || '—'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Ngày vào làm</strong>
                                    <p className="mb-0">
                                        {row.hire_date
                                            ? new Date(row.hire_date).toLocaleDateString('vi-VN')
                                            : '—'}
                                    </p>
                                </div>
                                <div className="col-12">
                                    <strong className="text-muted d-block mb-1">Địa chỉ</strong>
                                    <p className="mb-0">{row.address || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Ghi chú</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-0" style={{ lineHeight: 1.6 }}>
                                {row.notes || 'Chưa có ghi chú.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianShow;
