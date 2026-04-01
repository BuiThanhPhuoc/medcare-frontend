import { useState } from 'react';
import api from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    
    // 1. Khai báo state cho mật khẩu nhập lại
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!');
            return; 
        }

        try {
            await api.post('/api/auth/register', {
                username,
                email,
                phone,
                password,
                confirmPassword, // 2. Bắt buộc phải có dòng này để chiều ý Backend
                role: 'patient' 
            });

            alert('🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            navigate('/login'); 
            
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Lỗi không thể đăng ký!');
        }
    };

    return (
        <div className="auth-page-wrap">
            <div className="login-container">
            <form className="login-form" onSubmit={handleRegister} noValidate>
                <h2>Đăng ký</h2>
                <p className="auth-subtitle">Tạo tài khoản bệnh nhân MedCare</p>

                {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}

                <div className="form-group">
                    <label>Họ và Tên (Username)</label>
                    <input 
                        type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                        required placeholder="Nhập tên của bạn..."
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                        required placeholder="Nhập email..."
                    />
                </div>

                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input 
                        type="text" value={phone} onChange={(e) => setPhone(e.target.value)} 
                        required placeholder="Nhập số điện thoại..."
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input 
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                        required placeholder="Tạo mật khẩu..."
                    />
                </div>

                {/* 3. Ô GIAO DIỆN NHẬP LẠI MẬT KHẨU */}
                <div className="form-group">
                    <label>Nhập lại mật khẩu</label>
                    <input 
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                        required placeholder="Nhập lại mật khẩu để xác nhận..."
                    />
                </div>

                <button type="submit" className="login-btn">Đăng ký</button>

                <p className="auth-footer-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </form>
            </div>
        </div>
    );
};

export default Register;