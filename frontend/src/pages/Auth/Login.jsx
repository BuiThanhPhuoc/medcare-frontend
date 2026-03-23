import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CSS/Login.css';

const Login = () => {
    const { t, i18n } = useTranslation();
    console.log('Login component language:', i18n.language);

    useEffect(() => {
        console.log('Login: language changed to', i18n.language);
    }, [i18n.language]);
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
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>{t('auth.loginButton')} MedCare</h2>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="form-group">
                    <label>{t('auth.identifier')}</label>
                    <input
                        type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                        required placeholder={t('auth.username')}
                    />
                </div>

                <div className="form-group">
                    <label>{t('auth.password')}</label>
                    <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required placeholder={t('auth.password')}
                    />
                </div>

                <button type="submit" className="login-btn">{t('auth.loginButton')}</button>

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <p>{t('auth.noAccount')} <Link to="/register" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>{t('auth.registerButton')}</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;