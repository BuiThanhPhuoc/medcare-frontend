import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const ReceptionistShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receptionist, setReceptionist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReceptionist();
    }, [id]);

    const fetchReceptionist = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/admin/receptionists/${id}`);
            setReceptionist(response.data.receptionist);
            setError('');
        } catch (err) {
            setError('Không thể tải thông tin lễ tân');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !receptionist) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger">{error || 'Không tìm thấy lễ tân'}</div>
                <Link to="/admin/receptionists" className="btn btn-secondary">
                    Quay lại
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center mb-4">
                <Link to="/admin/receptionists" className="btn btn-outline-secondary me-3">
                    <i className="fas fa-arrow-left"></i>
                </Link>
                <h2 className="fw-bold mb-0">Chi Tiết Lễ Tân</h2>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">
                            <h5 className="mb-3 text-primary border-bottom pb-2">Thông Tin Cá Nhân</h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Họ và Tên</p>
                                    <p className="fw-bold">{receptionist.full_name}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Email</p>
                                    <p className="fw-bold">{receptionist.email}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Số Điện Thoại</p>
                                    <p className="fw-bold">{receptionist.phone}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Địa Chỉ</p>
                                    <p className="fw-bold">{receptionist.address || 'N/A'}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Ngày Tuyển Dụng</p>
                                    <p className="fw-bold">
                                        {receptionist.hire_date ? new Date(receptionist.hire_date).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Trạng Thái</p>
                                    <p>
                                        <span className={`badge ${receptionist.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                            {receptionist.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <h5 className="mb-3 text-primary border-bottom pb-2 mt-4">Thông Tin Tài Khoản</h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">Tài Khoản (Username)</p>
                                    <p className="fw-bold">{receptionist.username}</p>
                                </div>
                                <div className="col-md-6">
                                    <p className="text-muted mb-1">ID Người Dùng</p>
                                    <p className="fw-bold">{receptionist.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header bg-light border-bottom">
                            <h5 className="mb-0">Hành Động</h5>
                        </div>
                        <div className="card-body p-3">
                            <Link
                                to={`/admin/receptionists/${receptionist.id}/edit`}
                                className="btn btn-warning w-100 mb-2"
                            >
                                <i className="fas fa-edit me-2"></i>Chỉnh Sửa
                            </Link>
                            <Link
                                to={`/admin/receptionists/${receptionist.id}/schedule`}
                                className="btn btn-info w-100"
                            >
                                <i className="fas fa-calendar me-2"></i>Gán Lịch Làm Việc
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistShow;