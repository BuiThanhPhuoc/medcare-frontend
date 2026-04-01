import { useState } from 'react';
import api from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await api.post('/api/auth/login', {
                identifier: identifier,
                password: password
            });

            const { token, user } = response.data;

            // Lưu token và thông tin user vào LocalStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // ========================================================
            // 🔥 KIỂM TRA: NẾU LÀ ĐĂNG NHẬP LẦN ĐẦU -> BẮT ĐỔI MẬT KHẨU
            // ========================================================
            // is_first_login có thể là boolean (true) hoặc số (1) tùy CSDL
            if (user.is_first_login === true || user.is_first_login === 1) {
                navigate('/force-change-password');
                return; // Dừng hàm tại đây, không chạy xuống dưới nữa
            }

            // ========================================================
            // CHIA ĐƯỜNG DỰA VÀO ROLE NẾU ĐÃ ĐỔI MẬT KHẨU XONG
            // ========================================================
            if (user.role === 'doctor') {
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

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Không thể kết nối đến Server!');
            }
        }
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
                        required placeholder="Nhập tài khoản..."
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required placeholder="Nhập mật khẩu..."
                    />
                </div>

                <button type="submit" className="login-btn">Đăng Nhập</button>

                <p className="auth-footer-link">
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                </p>
            </form>
            </div>
        </div>
    );
};

export default Login;