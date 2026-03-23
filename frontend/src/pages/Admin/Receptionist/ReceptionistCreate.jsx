import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const ReceptionistCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        full_name: '',
        address: '',
        hire_date: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/admin/receptionists', formData);
            alert('Thêm lễ tân thành công!');
            navigate('/admin/receptionists');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Lỗi không xác định';
            setError('❌ ' + message);
            alert('Lỗi: ' + message);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center mb-4">
                <Link to="/admin/receptionists" className="btn btn-outline-secondary me-3">
                    <i className="fas fa-arrow-left"></i>
                </Link>
                <h2 className="fw-bold mb-0">Thêm Lễ Tân Mới</h2>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <h5 className="mb-3 text-primary border-bottom pb-2">Thông tin Đăng nhập</h5>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Tài khoản *</label>
                                <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Mật khẩu *</label>
                                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>

                        <h5 className="mb-3 text-primary border-bottom pb-2">Thông tin Cá nhân</h5>
                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Họ và Tên *</label>
                                <input type="text" name="full_name" className="form-control" value={formData.full_name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Email *</label>
                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Số điện thoại *</label>
                                <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Địa chỉ</label>
                                <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Ngày tuyển dụng</label>
                                <input type="date" name="hire_date" className="form-control" value={formData.hire_date} onChange={handleChange} />
                            </div>
                        </div>
                        
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary px-4 py-2">Lưu thông tin</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistCreate;