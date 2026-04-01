import { useState, useEffect } from 'react';
import './AddMedicineModal.css';

/**
 * AddMedicineModal - Modal popup để thêm/sửa thuốc
 * 
 * Props:
 * - isOpen: (bool) Trạng thái mở/đóng modal
 * - onClose: (func) Callback khi đóng modal
 * - onSubmit: (func) Callback khi submit form
 * - medicineData: (object, optional) Dữ liệu thuốc khi sửa
 * - isLoading: (bool, optional) Trạng thái loading form
 */
export const AddMedicineModal = ({ isOpen, onClose, onSubmit, medicineData = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        importPrice: '',
        price: '',
        expiryDate: ''
    });

    const [errors, setErrors] = useState({});

    // Populate form khi medicineData thay đổi
    useEffect(() => {
        if (medicineData) {
            setFormData({
                name: medicineData.name || '',
                quantity: medicineData.quantity || '',
                importPrice: medicineData.import_price || '',
                price: medicineData.price || '',
                expiryDate: medicineData.expiry_date?.split('T')[0] || ''
            });
        } else {
            setFormData({
                name: '',
                quantity: '',
                importPrice: '',
                price: '',
                expiryDate: ''
            });
        }
        setErrors({});
    }, [medicineData, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tên thuốc không được để trống';
        if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Số lượng không hợp lệ';
        if (!formData.importPrice || formData.importPrice < 0) newErrors.importPrice = 'Giá nhập không hợp lệ';
        if (!formData.price || formData.price < 0) newErrors.price = 'Giá bán không hợp lệ';
        if (!formData.expiryDate) newErrors.expiryDate = 'Ngày hết hạn không được để trống';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error khi user bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSubmit({
            name: formData.name,
            quantity: Number(formData.quantity),
            import_price: Number(formData.importPrice),
            price: Number(formData.price),
            expiry_date: formData.expiryDate
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        {medicineData ? '✏️ Sửa thông tin thuốc' : '➕ Thêm thuốc mới'}
                    </h5>
                    <button 
                        type="button" 
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="modal-body">
                        {/* Tên thuốc */}
                        <div className="form-group">
                            <label>Tên thuốc <span className="required">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập tên thuốc"
                                className={errors.name ? 'is-invalid' : ''}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        {/* Row: Số lượng + Giá nhập */}
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Số lượng <span className="required">*</span></label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className={errors.quantity ? 'is-invalid' : ''}
                                />
                                {errors.quantity && <div className="error-message">{errors.quantity}</div>}
                            </div>

                            <div className="form-group col-md-6">
                                <label>Giá nhập (VNĐ) <span className="required">*</span></label>
                                <input
                                    type="number"
                                    name="importPrice"
                                    value={formData.importPrice}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className={errors.importPrice ? 'is-invalid' : ''}
                                />
                                {errors.importPrice && <div className="error-message">{errors.importPrice}</div>}
                            </div>
                        </div>

                        {/* Row: Giá bán + Ngày hết hạn */}
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Giá bán (VNĐ) <span className="required">*</span></label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    className={errors.price ? 'is-invalid' : ''}
                                />
                                {errors.price && <div className="error-message">{errors.price}</div>}
                            </div>

                            <div className="form-group col-md-6">
                                <label>Ngày hết hạn <span className="required">*</span></label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className={errors.expiryDate ? 'is-invalid' : ''}
                                />
                                {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                            </div>
                        </div>

                        {/* Info tip */}
                        <div className="form-info">
                            <i className="fas fa-lightbulb"></i>
                            <span>Hệ thống sẽ tính độ lợi nhuận tự động dựa trên giá nhập và bán</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i>
                                    {medicineData ? 'Cập nhật' : 'Thêm thuốc'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMedicineModal;
