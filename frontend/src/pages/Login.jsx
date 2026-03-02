import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import file CSS để trang trí

const Login = () => {
    // Các state để lưu dữ liệu người dùng gõ vào ô input
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    const navigate = useNavigate(); // Dùng để chuyển trang sau khi login thành công

    const handleLogin = async (e) => {
        e.preventDefault(); // Chặn hành vi load lại trang mặc định của form
        setErrorMessage(''); // Xóa lỗi cũ nếu có

        try {
            // Gắn link API Backend của bạn vào đây
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                identifier: identifier,
                password: password
            });

            // Nếu Backend trả về thành công -> Lưu Token và User vào kho của trình duyệt (localStorage)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            alert('Đăng nhập thành công!');
            
            // Chuyển hướng người dùng về Trang chủ
            navigate('/'); 
            
        } catch (error) {
            // Bắt lỗi từ Backend gửi về (ví dụ: Sai mật khẩu, User không tồn tại...)
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
                
                {/* Chỗ này để hiện màu đỏ nếu gõ sai pass */}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="form-group">
                    <label>Tài khoản / Email / SĐT</label>
                    <input 
                        type="text" 
                        value={identifier} 
                        onChange={(e) => setIdentifier(e.target.value)} 
                        required 
                        placeholder="Nhập tài khoản..."
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="Nhập mật khẩu..."
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