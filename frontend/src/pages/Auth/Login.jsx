import { useState } from 'react';
import api from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // ===== HỖ TRỢ LOGIC: Chuyến hướng sau đăng nhập =====
    const handleLoginSuccess = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.is_first_login === true || user.is_first_login === 1) {
            navigate('/force-change-password');
        } else if (user.role === 'doctor') {
            navigate('/doctor-dashboard');
        } else if (user.role === 'receptionist') {
            navigate('/reception-dashboard');
        } else if (user.role === 'admin') {
            navigate('/admin-dashboard');
        } else if (user.role === 'lab_technician') {
            navigate('/lab-dashboard');
        } else {
            navigate('/patient-dashboard');
        }
    };

    // ===== ĐĂNG NHẬP THƯỜNG =====
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/login', {
                identifier: identifier,
                password: password
            });

            const { token, user } = response.data;
            handleLoginSuccess(token, user);

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Không thể kết nối đến Server!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ===== ĐĂNG NHẬP BẰNG GOOGLE =====
    const handleGoogleSuccess = async (credentialResponse) => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/google-login', {
                googleToken: credentialResponse.credential
            });

            const { token, user } = response.data;
            handleLoginSuccess(token, user);

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Lỗi đăng nhập Google!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setErrorMessage('Đăng nhập Google không thành công. Vui lòng thử lại!');
    };

    return (
        <div className="auth-page-wrap">
            <div className="login-container">
            <form className="login-form" onSubmit={handleLogin} noValidate>
                <h2>Đăng nhập</h2>
                <p className="auth-subtitle">MedCare — vào tài khoản của bạn</p>

                {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}

                <div className="form-group">
                    <label>Tài khoản / Email / SĐT</label>
                    <input
                        type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                        required placeholder="Nhập tài khoản..." disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required placeholder="Nhập mật khẩu..." disabled={isLoading}
                    />
                </div>

                <button type="submit" className="login-btn" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>

                {/* ===== ĐƯỜNG CHIA =====  */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px 0',
                    gap: '10px'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                    <span style={{ color: '#666', fontSize: '14px' }}>HOẶC</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                </div>

                {/* ===== GOOGLE LOGIN BUTTON ===== */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        size="large"
                        text="signin_with"
                        locale="vi"
                    />
                </div>

                <p className="auth-footer-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </p>
            </form>
            </div>
        </div>
    );
};

export default Login;