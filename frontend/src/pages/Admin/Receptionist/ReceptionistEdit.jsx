import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const ReceptionistEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        full_name: '',
        address: '',
        hire_date: '',
        status: 'active'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        fetchReceptionist();
    }, [id]);

    const fetchReceptionist = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/admin/receptionists/${id}`);
            const receptionist = response.data.receptionist;
            setFormData({
                email: receptionist.email || '',
                phone: receptionist.phone || '',
                full_name: receptionist.full_name || '',
                address: receptionist.address || '',
                hire_date: receptionist.hire_date ? receptionist.hire_date.split('T')[0] : '',
                status: receptionist.status || 'active'
            });
            if (receptionist.avatar) {
                setAvatarPreview(receptionist.avatar);
            }
            setError('');
        } catch (err) {
            setError('Không thể tải thông tin lễ tân');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('full_name', formData.full_name);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('hire_date', formData.hire_date);
            formDataToSend.append('status', formData.status);
            
            if (avatar) {
                formDataToSend.append('avatar', avatar);
            }

            await api.put(`/api/admin/receptionists/${id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Cập nhật lễ tân thành công!');
            navigate('/admin/receptionists');
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Lỗi không xác định';
            setError('❌ ' + message);
            alert('Lỗi: ' + message);
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

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center mb-4">
                <Link to="/admin/receptionists" className="btn btn-outline-secondary me-3">
                    <i className="fas fa-arrow-left"></i>
                </Link>
                <h2 className="fw-bold mb-0">Chỉnh Sửa Thông Tin Lễ Tân</h2>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <h5 className="mb-3 text-primary border-bottom pb-2">Thông tin Cá nhân</h5>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Họ và Tên *</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    className="form-control"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Số điện thoại *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Avatar</label>
                                <input
                                    type="file"
                                    name="avatar"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                                {avatarPreview && (
                                    <div className="mt-3 text-center">
                                        <img src={avatarPreview} alt="Avatar Preview" width="80" height="80" className="rounded-circle" />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Ngày tuyển dụng</label>
                                <input
                                    type="date"
                                    name="hire_date"
                                    className="form-control"
                                    value={formData.hire_date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Trạng thái</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Tạm dừng</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-end">
                            <Link to="/admin/receptionists" className="btn btn-secondary me-2">
                                Hủy
                            </Link>
                            <button type="submit" className="btn btn-primary px-4 py-2">
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistEdit;