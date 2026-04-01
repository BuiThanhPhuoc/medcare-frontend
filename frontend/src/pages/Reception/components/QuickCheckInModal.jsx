import { useState, useEffect } from 'react';
import api from '../../../lib/api';

const QuickCheckInModal = ({ show, onHide, onSuccess }) => {
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_phone: '',
        patient_email: '',
        specialty_id: '',
        notes: ''
    });
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch specialties when modal opens
    useEffect(() => {
        if (show) {
            fetchSpecialties();
            setError(null);
        }
    }, [show]);

    const fetchSpecialties = async () => {
        try {
            const res = await api.get('/api/specialties');
            setSpecialties(res.data.specialties || []);
        } catch (err) {
            console.error('Lỗi tải danh sách chuyên khoa:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.patient_name.trim()) {
            setError('Vui lòng nhập tên bệnh nhân');
            return;
        }
        if (!formData.patient_phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }
        if (!formData.specialty_id) {
            setError('Vui lòng chọn chuyên khoa');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Gọi API để tạo khám nhanh
            const res = await api.post('/api/appointments/quick-checkin', {
                patient_name: formData.patient_name,
                patient_phone: formData.patient_phone,
                patient_email: formData.patient_email || '',
                specialty_id: formData.specialty_id,
                notes: formData.notes || ''
            });

            // Reset form
            setFormData({
                patient_name: '',
                patient_phone: '',
                patient_email: '',
                specialty_id: '',
                notes: ''
            });

            onSuccess && onSuccess(res.data);
            onHide();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể đăng ký khám nhanh');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} 
             style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
             tabIndex="-1" 
             role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header bg-success text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-user-plus me-2"></i>
                            Đăng ký khám nhanh (Walk-in)
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Tên bệnh nhân */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-user me-2 text-primary"></i>
                                    Tên bệnh nhân <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nguyễn Văn A"
                                    name="patient_name"
                                    value={formData.patient_name}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-phone me-2 text-primary"></i>
                                    Số điện thoại <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="0123456789"
                                    name="patient_phone"
                                    value={formData.patient_phone}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    Email (Không bắt buộc)
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="nguyenvana@gmail.com"
                                    name="patient_email"
                                    value={formData.patient_email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            {/* Chuyên khoa */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-stethoscope me-2 text-primary"></i>
                                    Chuyên khoa <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    name="specialty_id"
                                    value={formData.specialty_id}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">-- Chọn chuyên khoa --</option>
                                    {specialties.map(spec => (
                                        <option key={spec.id} value={spec.id}>
                                            {spec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ghi chú */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-sticky-note me-2 text-primary"></i>
                                    Ghi chú
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Nhập ghi chú về bệnh nhân..."
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    disabled={loading}
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onHide}
                            disabled={loading}
                        >
                            <i className="fas fa-times me-2"></i>
                            Hủy
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success" 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle me-2"></i>
                                    Đăng ký
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickCheckInModal;
