import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './PatientProfile.css';

const PatientProfile = () => {
    const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        full_name: '',
        username: '',
        date_of_birth: '',
        gender: '',
        address: '',
        medical_history: '',
        allergies: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    useEffect(() => {
        fetchPatientProfile();
    }, []);

    const fetchPatientProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/api/patient/profile');
            const patient = response.data.patient;
            setFormData({
                email: patient.email || '',
                phone: patient.phone || '',
                full_name: patient.full_name || '',
                username: patient.username || '',
                date_of_birth: patient.date_of_birth ? patient.date_of_birth.slice(0, 10) : '',
                gender: patient.gender || '',
                address: patient.address || '',
                medical_history: patient.medical_history || '',
                allergies: patient.allergies || ''
            });
            if (patient.avatar) {
                // Backend trả về dạng `/uploads/<file>`, frontend cần ghép URL backend.
                const avatarUrl = patient.avatar.startsWith('http')
                    ? patient.avatar
                    : `${apiBaseURL}${patient.avatar}`;
                setAvatarPreview(avatarUrl);
            }
        } catch (err) {
            setError('Không thể tải thông tin hồ sơ');
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
        setSuccess('');
        
        if (!formData.email || !formData.phone || !formData.full_name) {
            setError('❌ Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            setSubmitting(true);
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('full_name', formData.full_name);
            formDataToSend.append('date_of_birth', formData.date_of_birth || '');
            formDataToSend.append('gender', formData.gender || '');
            formDataToSend.append('address', formData.address || '');
            formDataToSend.append('medical_history', formData.medical_history || '');
            formDataToSend.append('allergies', formData.allergies || '');
            
            formDataToSend.append('avatarProvided', avatar ? '1' : '0');
            if (avatar) formDataToSend.append('avatar', avatar);

            const response = await api.put('/api/patient/profile', formDataToSend, {
                // Axios sẽ tự đặt đúng boundary cho multipart/form-data khi truyền FormData
            });

            setSuccess('✅ ' + (response.data.message || 'Cập nhật hồ sơ thành công!'));
            if (response.data?.patient?.avatar) {
                const avatar = response.data.patient.avatar;
                const avatarUrl = avatar.startsWith('http')
                    ? avatar
                    : `${apiBaseURL}${avatar}`;
                setAvatarPreview(avatarUrl);
            } else {
                setAvatarPreview('');
            }
            setAvatar(null);
            
            // Update localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...user,
                email: formData.email,
                phone: formData.phone,
                full_name: formData.full_name
            }));

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Lỗi không xác định';
            setError('❌ ' + message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="patient-profile-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-profile-container">
            <div className="profile-card">
                {/* Header */}
                <div className="profile-header">
                    <h2>👤 Hồ Sơ Bệnh Nhân</h2>
                    <p>Quản lý thông tin cá nhân của bạn</p>
                </div>

                {/* Alerts */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Avatar Section */}
                    <div className="avatar-section">
                        <div className="avatar-display">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="avatar-image" />
                            ) : (
                                <div className="avatar-placeholder">
                                    <i className="fas fa-user-circle"></i>
                                </div>
                            )}
                        </div>
                        <div className="avatar-upload">
                            <label htmlFor="avatar" className="file-label">
                                <i className="fas fa-camera"></i>
                                <span>Tải ảnh đại diện</span>
                            </label>
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                className="file-input"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                            <small className="file-hint">JPG, PNG hoặc GIF (Max 5MB)</small>
                        </div>
                    </div>

                    {/* Form Groups */}
                    <div className="form-section">
                        <h5 className="section-title">Thông Tin Cá Nhân</h5>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Tài Khoản</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    disabled
                                    title="Tài khoản không thể sửa đổi"
                                />
                                <small className="text-muted">Tài khoản không thể thay đổi</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Họ và Tên *</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    className="form-control"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập email"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Số Điện Thoại *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    className="form-control"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Giới tính</label>
                                <select
                                    name="gender"
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Chưa cập nhật</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Tiền sử bệnh</label>
                                <textarea
                                    name="medical_history"
                                    className="form-control"
                                    value={formData.medical_history}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Nhập tiền sử bệnh"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Dị ứng</label>
                                <textarea
                                    name="allergies"
                                    className="form-control"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Nhập thông tin dị ứng"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="button-group">
                        <button 
                            type="button" 
                            className="btn-secondary"
                            onClick={fetchPatientProfile}
                            disabled={submitting}
                        >
                            <i className="fas fa-redo"></i> Huỷ
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-sm"></span> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Lưu Thay Đổi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
