import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForceChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));

            await axios.post('http://localhost:5000/api/auth/force-change-password', passwords, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Đổi mật khẩu thành công! Chào mừng bạn đến với hệ thống.');
            
            // Cập nhật lại localStorage để tắt cờ
            user.is_first_login = false;
            localStorage.setItem('user', JSON.stringify(user));

            // Chuyển hướng vào Dashboard tương ứng
            if (user.role === 'doctor') navigate('/doctor-dashboard');
            else if (user.role === 'receptionist') navigate('/reception-dashboard');
            else if (user.role === 'admin') navigate('/admin-dashboard');
            else navigate('/patient-dashboard');

        } catch (error) {
            setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="container mt-5" style={{maxWidth: '500px'}}>
            <div className="card shadow border-0" style={{borderRadius: '15px'}}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-shield-alt fs-1 text-warning mb-3"></i>
                        <h4 className="fw-bold">Bảo Mật Tài Khoản</h4>
                        <p className="text-muted small">Đây là lần đăng nhập đầu tiên của bạn. Vui lòng đổi mật khẩu để bảo vệ tài khoản.</p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mật khẩu mới</label>
                            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} className="form-control form-control-lg" required />
                            <small className="text-muted" style={{fontSize: '12px'}}>
                                Yêu cầu: Bắt buộc 8 ký tự, chứa ít nhất 1 CHỮ HOA và 1 ký tự đặc biệt (!@#$...).
                            </small>
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-bold">Nhập lại mật khẩu</label>
                            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} className="form-control form-control-lg" required />
                        </div>
                        <button type="submit" className="btn btn-warning w-100 fw-bold py-2 fs-5 text-dark">
                            Cập nhật & Truy cập hệ thống
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForceChangePassword;