import { useState } from 'react';
import axios from 'axios';
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
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                identifier: identifier,
                password: password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // CHIA ĐƯỜNG DỰA VÀO ROLE CỦA USER
            const userRole = response.data.user.role;
            if (userRole === 'doctor') {
                navigate('/doctor-home');
            } else if (userRole === 'receptionist') {
                navigate('/reception-home');
            } else if (userRole === 'admin') {
                navigate('/admin-home');
            } else {
                navigate('/patient-home'); // <--- SỬA DÒNG NÀY: Bệnh nhân vào nhà của bệnh nhân
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
                <h2>Đăng Nhập MedCare</h2>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

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

                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <p>Chưa có tài khoản? <Link to="/register" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>Đăng ký ngay</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;