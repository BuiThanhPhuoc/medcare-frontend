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
                            <h4 className="fw-bold mb-1">{doctor.full_name}</h4>
                            <p className="text-muted mb-3">{doctor.specialty}</p>
                            <span className={`badge ${doctor.status === 'Active' ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill`}>
                                {doctor.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
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
                                    <p className="mb-0 fs-6">{doctor.phone || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Chuyên khoa:</strong>
                                    <p className="mb-0 fs-6">{doctor.specialty || 'Chưa cập nhật'}</p>
                                </div>
                                <div className="col-md-6">
                                    <strong className="text-muted d-block mb-1">Kinh nghiệm:</strong>
                                    <p className="mb-0 fs-6">{doctor.experience ? `${doctor.experience} năm` : '0 năm'}</p>
                                </div>
                                <div className="col-12">
                                    <strong className="text-muted d-block mb-1">Địa chỉ:</strong>
                                    <p className="mb-0 fs-6">{doctor.address || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 mb-4 rounded-4">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Mô tả / Giới thiệu</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-0" style={{lineHeight: '1.6'}}>{doctor.description || 'Bác sĩ chưa cập nhật thông tin giới thiệu.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorShow;