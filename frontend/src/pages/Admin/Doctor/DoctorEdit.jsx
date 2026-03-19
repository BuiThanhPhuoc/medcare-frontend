import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [specialties, setSpecialties] = useState([]);

    const [formData, setFormData] = useState({
        full_name: '', email: '', phone: '', specialty: '', experience: '', status: 'Active', address: '', description: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorRes, specialtiesRes] = await Promise.all([
                    api.get(`/api/admin/doctors/${id}`),
                    api.get(`/api/admin/specialties`)
                ]);

                setSpecialties(specialtiesRes.data.specialties || []);

                const doc = doctorRes.data.doctor;
                setFormData({
                    full_name: doc.full_name || '', 
                    email: doc.email || '', 
                    phone: doc.phone || '', 
                    specialty: doc.specialty || '', 
                    experience: doc.experience || '', 
                    status: doc.status || 'Active', 
                    address: doc.address || '', 
                    description: doc.description || ''
                });
                
                if (doc.avatar_url) setAvatarPreview(doc.avatar_url);
                setLoading(false);
            } catch (error) {
                alert("Không tìm thấy thông tin hoặc có lỗi xảy ra!");
                navigate('/admin/doctors');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            await api.put(`/api/admin/doctors/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Cập nhật thành công!');
            navigate('/admin/doctors');
        } catch (error) {
            alert('Lỗi cập nhật: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="bg-white shadow-sm p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                    <i className="fas fa-user-edit text-primary me-2"></i> Sửa thông tin Bác sĩ: <span className="text-success">{formData.full_name}</span>
                </h4>
                <Link to="/admin/doctors" className="btn btn-secondary btn-sm"><i className="fas fa-arrow-left"></i> Quay lại</Link>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '14px' }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Họ tên <span className="text-danger">*</span></label>
                                <input type="text" name="full_name" className="form-control form-control-lg" value={formData.full_name} onChange={handleChange} required />
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
                            <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save"></i> Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorEdit;