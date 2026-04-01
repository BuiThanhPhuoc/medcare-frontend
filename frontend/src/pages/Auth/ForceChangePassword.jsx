import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import './Login.css';

const ForceChangePassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            await api.post('/api/auth/force-change-password', passwords);

            alert('Đổi mật khẩu thành công. Chào mừng bạn đến với hệ thống.');

            user.is_first_login = false;
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'doctor') navigate('/doctor-dashboard');
            else if (user.role === 'receptionist') navigate('/reception-dashboard');
            else if (user.role === 'admin') navigate('/admin-dashboard');
            else if (user.role === 'lab_technician') navigate('/lab-dashboard');
            else navigate('/patient-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div className="auth-page-wrap">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="text-center mb-3">
                        <i className="fas fa-shield-alt fs-1 text-warning mb-2 d-block" aria-hidden />
                        <h2 className="mb-0">Bảo mật tài khoản</h2>
                        <p className="auth-subtitle mb-0">
                            Lần đăng nhập đầu tiên — vui lòng đặt mật khẩu mới để tiếp tục.
                        </p>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input
                            id="newPassword"
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.8rem' }}>
                            Ít nhất 8 ký tự, gồm 1 chữ hoa và 1 ký tự đặc biệt.
                        </small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Cập nhật và vào hệ thống
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForceChangePassword;
