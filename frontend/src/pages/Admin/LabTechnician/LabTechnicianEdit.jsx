import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';

const LabTechnicianEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        department: '',
        address: '',
        hire_date: '',
        status: 'Active',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/admin/lab-technicians/${id}`);
                const lt = res.data.labTechnician;
                setFormData({
                    full_name: lt.full_name || '',
                    email: lt.email || '',
                    phone: lt.phone || '',
                    department: lt.department || '',
                    address: lt.address || '',
                    hire_date: lt.hire_date ? String(lt.hire_date).slice(0, 10) : '',
                    status: lt.status || 'Active',
                    notes: lt.notes || ''
                });
                if (lt.avatar_url) setAvatarPreview(lt.avatar_url);
                setLoading(false);
            } catch {
                alert('Không tải được dữ liệu.');
                navigate('/admin/lab-technicians');
            }
        };
        fetchData();
    }, [id, navigate]);

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

            await api.put(`/api/admin/lab-technicians/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Đã cập nhật.');
            navigate('/admin/lab-technicians');
        } catch (error) {
            alert(error.response?.data?.message || error.message);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="bg-white shadow-sm p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                    <i className="fas fa-user-edit text-info me-2" /> Sửa: {formData.full_name}
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
                                <label className="form-label fw-bold">Họ tên</label>
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
                                <label className="form-label fw-bold">Email</label>
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
                                <label className="form-label fw-bold">Điện thoại</label>
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
                                <label className="form-label fw-bold">Bộ phận</label>
                                <input
                                    type="text"
                                    name="department"
                                    className="form-control form-control-lg"
                                    value={formData.department}
                                    onChange={handleChange}
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
                                <label className="form-label fw-bold">Trạng thái</label>
                                <select
                                    name="status"
                                    className="form-select form-control-lg"
                                    value={formData.status}
                                    onChange={handleChange}
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
                                Hủy
                            </Link>
                            <button type="submit" className="btn btn-primary px-4">
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LabTechnicianEdit;
