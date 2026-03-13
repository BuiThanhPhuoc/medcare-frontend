import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorShow = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/api/admin/doctors/${id}`);
                setDoctor(res.data.doctor);
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };
        fetchDoctor();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) return;
        try {
            await api.delete(`/api/admin/doctors/${id}`);
            alert("Xóa thành công!");
            navigate('/admin/doctors');
        } catch {
            alert("Lỗi khi xóa!");
        }
    };

    if (!doctor) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-user-md text-primary me-2"></i> Thông tin Bác sĩ
                </h2>
                <Link to="/admin/doctors" className="btn btn-secondary">
                    <i className="fas fa-arrow-left"></i> Quay lại
                </Link>
            </div>

            <div className="row g-4">
                {/* CỘT TRÁI: Avatar & Hành động */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-body text-center p-4">
                            {doctor.avatar_url ? (
                                <img src={doctor.avatar_url} alt="avatar" className="rounded-circle mb-3 shadow-sm" style={{width: '150px', height: '150px', objectFit: 'cover'}} />
                            ) : (
                                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '150px', height: '150px'}}>
                                    <i className="fas fa-user-circle text-muted" style={{fontSize: '5rem'}}></i>
                                </div>
                            )}
                            <h4 className="fw-bold mb-1">{doctor.ho_ten}</h4>
                            <p className="text-muted mb-3">{doctor.chuyen_khoa}</p>
                            <span className={`badge ${doctor.trang_thai === 'Đang hoạt động' ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill`}>
                                {doctor.trang_thai || 'Đang hoạt động'}
                            </span>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Thao tác</h5>
                        </div>
                        <div className="card-body">
                            <Link to={`/admin/doctors/${doctor.id}/edit`} className="btn btn-primary w-100 mb-2">
                                <i className="fas fa-pencil-alt me-2"></i> Chỉnh sửa
                            </Link>
                            <button onClick={handleDelete} className="btn btn-danger w-100">
                                <i className="fas fa-trash me-2"></i> Xóa
                            </button>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: Chi tiết & Đánh giá */}
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Thông tin chi tiết</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Email:</strong>
                                    <p className="mb-0 fs-6">{doctor.email || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Số điện thoại:</strong>
                                    <p className="mb-0 fs-6">{doctor.so_dien_thoai || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Chuyên khoa:</strong>
                                    <p className="mb-0 fs-6">{doctor.chuyen_khoa || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Kinh nghiệm:</strong>
                                    <p className="mb-0 fs-6">{doctor.kinh_nghiem ? `${doctor.kinh_nghiem} năm` : '0 năm'}</p>
                                </div>
                                <div className="col-12">
                                    <strong className="text-muted d-block mb-1">Địa chỉ:</strong>
                                    <p className="mb-0 fs-6">{doctor.dia_chi || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Mô tả / Giới thiệu</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-0" style={{lineHeight: '1.6'}}>{doctor.mo_ta || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}</p>
                        </div>
                    </div>

                    {/* Khối Thống kê Đánh giá (Mockup giao diện giống Laravel) */}
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold"><i className="fas fa-star text-warning me-2"></i> Đánh giá</h5>
                        </div>
                        <div className="card-body d-flex align-items-center">
                            <div className="display-4 fw-bold text-warning me-4">4.8</div>
                            <div>
                                <div className="mb-1 text-warning fs-5">
                                    <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star"></i> <i className="fas fa-star-half-alt"></i>
                                </div>
                                <small className="text-muted">Dựa trên 125 đánh giá từ bệnh nhân</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorShow;