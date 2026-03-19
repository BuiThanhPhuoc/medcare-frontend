import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorCreate = () => {
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [specialties, setSpecialties] = useState([]);

    const [formData, setFormData] = useState({
        username: '', password: '', email: '', 
        full_name: '', phone: '', specialty: '', experience: '', status: 'Active', address: '', description: ''
    });

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await api.get('/api/admin/specialties');
                setSpecialties(res.data.specialties || []);
            } catch (error) {
                console.error("Lỗi tải chuyên khoa:", error);
            }
        };
        fetchSpecialties();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            await api.post('/api/admin/doctors', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Thêm bác sĩ thành công!');
            navigate('/admin/doctors');
        } catch (error) {
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container-fluid py-4">
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
                                        <input type="text" name="full_name" className="form-control form-control-lg" value={formData.full_name} onChange={handleChange} required />
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Tài khoản (Username) <span className="text-danger">*</span></label>
                                        <input type="text" name="username" className="form-control form-control-lg" value={formData.username} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Mật khẩu <span className="text-danger">*</span></label>
                                        <input type="password" name="password" className="form-control form-control-lg" value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                                        <input type="email" name="email" className="form-control form-control-lg" value={formData.email} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                                        <input type="text" name="phone" className="form-control form-control-lg" value={formData.phone} onChange={handleChange} required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Ảnh đại diện (avatar)</label>
                                        <input type="file" accept="image/*" className="form-control form-control-lg" onChange={handleFileChange} />
                                        {avatarPreview && <img src={avatarPreview} alt="preview" className="mt-2 rounded shadow-sm" style={{maxWidth: '120px'}} />}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Chuyên khoa <span className="text-danger">*</span></label>
                                        <select name="specialty" className="form-select form-control-lg" value={formData.specialty} onChange={handleChange} required>
                                            <option value="">-- Chọn chuyên khoa --</option>
                                            {specialties.map(sp => (
                                                /* ĐÃ SỬA sp.ten THÀNH sp.name Ở ĐÂY */
                                                <option key={sp.id} value={sp.name}>{sp.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số năm kinh nghiệm</label>
                                        <input type="number" name="experience" className="form-control form-control-lg" value={formData.experience} onChange={handleChange} min="0" />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Trạng thái <span className="text-danger">*</span></label>
                                        <select name="status" className="form-select form-control-lg" value={formData.status} onChange={handleChange} required>
                                            <option value="Active">Đang hoạt động</option>
                                            <option value="Inactive">Ngừng hoạt động</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold">Địa chỉ</label>
                                        <input type="text" name="address" className="form-control form-control-lg" value={formData.address} onChange={handleChange} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-bold">Mô tả / Giới thiệu</label>
                                        <textarea name="description" className="form-control form-control-lg" rows="4" value={formData.description} onChange={handleChange} style={{resize: 'none'}}></textarea>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                                    <Link to="/admin/doctors" className="btn btn-light me-2"><i className="fas fa-times"></i> Hủy</Link>
                                    <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save"></i> Lưu bác sĩ</button>
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