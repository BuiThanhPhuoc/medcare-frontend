import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [formData, setFormData] = useState({
        ho_ten: '', email: '', so_dien_thoai: '', chuyen_khoa: '', kinh_nghiem: '', trang_thai: 'Đang hoạt động', dia_chi: '', mo_ta: ''
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await api.get(`/api/admin/doctors/${id}`);
                const doc = res.data.doctor;
                setFormData({
                    ho_ten: doc.ho_ten || '', email: doc.email || '', so_dien_thoai: doc.so_dien_thoai || '',
                    chuyen_khoa: doc.chuyen_khoa || '', kinh_nghiem: doc.kinh_nghiem || '', trang_thai: doc.trang_thai || 'Đang hoạt động',
                    dia_chi: doc.dia_chi || '', mo_ta: doc.mo_ta || ''
                });
                if(doc.avatar_url) setAvatarPreview(doc.avatar_url);
                setLoading(false);
            } catch {
                alert("Không tìm thấy thông tin!");
                navigate('/admin/doctors');
            }
        };
        fetchDoctor();
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            // Ghi chú: Có thể axios PUT với FormData hơi kén ở vài Framework Backend, 
            // Nếu Backend dùng Nodejs/Express (Multer), cấu hình này là chuẩn.
            await api.put(`/api/admin/doctors/${id}`, data, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert('Cập nhật thành công!');
            navigate('/admin/doctors');
        } catch {
            alert('Lỗi cập nhật!');
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="bg-white shadow-sm p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                    <i className="fas fa-user-edit text-primary me-2"></i> Sửa thông tin Bác sĩ: <span className="text-success">{formData.ho_ten}</span>
                </h4>
                <Link to="/admin/doctors" className="btn btn-secondary btn-sm"><i className="fas fa-arrow-left"></i> Quay lại</Link>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '14px' }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Các input giống hệt file Create ở trên, chỉ khác value */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Họ tên <span className="text-danger">*</span></label>
                                <input type="text" name="ho_ten" className="form-control form-control-lg" value={formData.ho_ten} onChange={handleChange} required />
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
                                {avatarPreview && <img src={avatarPreview} alt="preview" className="mt-2 rounded" style={{maxWidth: '140px'}} />}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Chuyên khoa <span className="text-danger">*</span></label>
                                <input type="text" name="chuyen_khoa" className="form-control form-control-lg" value={formData.chuyen_khoa} onChange={handleChange} required />
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
                            <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save"></i> Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorEdit;