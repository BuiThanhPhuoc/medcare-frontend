import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const LabTechnicianCreate = () => {
    const navigate = useNavigate();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        full_name: '',
        phone: '',
        department: '',
        address: '',
        hire_date: '',
        status: 'Active',
        notes: ''
    });

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
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (avatarFile) data.append('avatar', avatarFile);

            await api.post('/api/admin/lab-technicians', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Đã thêm kỹ thuật viên.');
            navigate('/admin/lab-technicians');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="bg-white shadow-sm p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                    <i className="fas fa-flask text-info me-2" /> Thêm kỹ thuật viên xét nghiệm
                </h4>
                <Link to="/admin/lab-technicians" className="btn btn-secondary btn-sm">
                    <i className="fas fa-arrow-left" /> Quay lại
                </Link>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '14px' }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Họ tên <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    className="form-control form-control-lg"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Tài khoản <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control form-control-lg"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Mật khẩu <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Điện thoại <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control form-control-lg"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Bộ phận / phòng xét nghiệm</label>
                                <input
                                    type="text"
                                    name="department"
                                    className="form-control form-control-lg"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="VD: Huyết học, Sinh hóa..."
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Ngày vào làm</label>
                                <input
                                    type="date"
                                    name="hire_date"
                                    className="form-control form-control-lg"
                                    value={formData.hire_date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">
                                    Trạng thái <span className="text-danger">*</span>
                                </label>
                                <select
                                    name="status"
                                    className="form-select form-control-lg"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Active">Đang hoạt động</option>
                                    <option value="Inactive">Ngừng hoạt động</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Ảnh đại diện</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    onChange={handleFileChange}
                                />
                                {avatarPreview && (
                                    <img
                                        src={avatarPreview}
                                        alt=""
                                        className="mt-2 rounded shadow-sm"
                                        style={{ maxWidth: 120 }}
                                    />
                                )}
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control form-control-lg"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">Ghi chú</label>
                                <textarea
                                    name="notes"
                                    className="form-control form-control-lg"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                            <Link to="/admin/lab-technicians" className="btn btn-light me-2">
                                <i className="fas fa-times" /> Hủy
                            </Link>
                            <button type="submit" className="btn btn-primary px-4">
                                <i className="fas fa-save" /> Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianCreate;
