import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorCreate = () => {
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', 
        ho_ten: '', so_dien_thoai: '', chuyen_khoa: '', kinh_nghiem: '', trang_thai: 'Đang hoạt động', dia_chi: '', mo_ta: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Dùng FormData để gửi được cả ảnh lên server
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            await api.post('/api/admin/doctors', data, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Thêm bác sĩ thành công!');
            navigate('/admin/doctors');
        } catch (error) {
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container-fluid py-4">
            {/* Thanh tiêu đề đẹp */}
            <div className="bg-white shadow-sm p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                    <i className="fas fa-user-md text-primary me-2"></i> Thêm Bác sĩ mới
                </h4>
                <Link to="/admin/doctors" className="btn btn-secondary btn-sm">
                    <i className="fas fa-arrow-left"></i> Quay lại
                </Link>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '14px' }}>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Họ tên <span className="text-danger">*</span></label>
                                        <input type="text" name="ho_ten" className="form-control form-control-lg" value={formData.ho_ten} onChange={handleChange} required />
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Tài khoản (Username) <span className="text-danger">*</span></label>
                                        <input type="text" name="username" className="form-control form-control-lg" value={formData.username} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                                        <input type="email" name="email" className="form-control form-control-lg" value={formData.email} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                                        <input type="text" name="so_dien_thoai" className="form-control form-control-lg" value={formData.so_dien_thoai} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Ảnh đại diện (avatar)</label>
                                        <input type="file" accept="image/*" className="form-control form-control-lg" onChange={handleFileChange} />
                                        {avatarPreview && <img src={avatarPreview} alt="preview" className="mt-2 rounded" style={{maxWidth: '120px'}} />}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Chuyên khoa <span className="text-danger">*</span></label>
                                        <input type="text" name="chuyen_khoa" className="form-control form-control-lg" value={formData.chuyen_khoa} onChange={handleChange} placeholder="VD: Tim mạch..." required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số năm kinh nghiệm</label>
                                        <input type="number" name="kinh_nghiem" className="form-control form-control-lg" value={formData.kinh_nghiem} onChange={handleChange} min="0" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Trạng thái <span className="text-danger">*</span></label>
                                        <select name="trang_thai" className="form-select form-control-lg" value={formData.trang_thai} onChange={handleChange} required>
                                            <option value="Đang hoạt động">Đang hoạt động</option>
                                            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold">Địa chỉ</label>
                                        <input type="text" name="dia_chi" className="form-control form-control-lg" value={formData.dia_chi} onChange={handleChange} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold">Mô tả / Giới thiệu</label>
                                        <textarea name="mo_ta" className="form-control form-control-lg" rows="4" value={formData.mo_ta} onChange={handleChange} style={{resize: 'none'}}></textarea>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4">
                                    <Link to="/admin/doctors" className="btn btn-light me-2"><i className="fas fa-times"></i> Hủy</Link>
                                    <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save"></i> Lưu</button>
                                </div>

                                <div className="alert alert-info mt-4">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <strong>Lưu ý:</strong> Vui lòng cung cấp Username để bác sĩ có thể đăng nhập vào hệ thống. Mật khẩu mặc định là <code>123456</code> (sẽ do Backend cấu hình).
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorCreate;