import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import "../CSS/Medicine.css";

const MedicineManager = () => {
    const [medicines, setMedicines] = useState([]);
    const [editingId, setEditingId] = useState(null);
    
    // State cho Form thêm/sửa thuốc
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [importPrice, setImportPrice] = useState('');
    const [price, setPrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/api/medicines');
            setMedicines(res.data.medicines);
        } catch (error) {
            console.error('Lỗi lấy danh sách thuốc:', error);
            alert('Không thể lấy danh sách thuốc!');
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    const resetForm = () => {
        setName('');
        setQuantity('');
        setImportPrice('');
        setPrice('');
        setExpiryDate('');
        setEditingId(null);
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        
        if (!name || !quantity || !importPrice || !price || !expiryDate) {
            alert('⚠️ Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            if (editingId) {
                // Cập nhật thuốc
                await api.put(`/api/medicines/${editingId}`, {
                    name,
                    quantity: Number(quantity),
                    import_price: Number(importPrice),
                    price: Number(price),
                    expiry_date: expiryDate
                });
                alert('✅ Cập nhật thuốc thành công!');
            } else {
                // Thêm thuốc mới
                await api.post('/api/medicines', {
                    name,
                    quantity: Number(quantity),
                    import_price: Number(importPrice),
                    price: Number(price),
                    expiry_date: expiryDate
                });
                alert('✅ Thêm thuốc vào kho thành công!');
            }

            resetForm();
            fetchMedicines();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể thực hiện'));
        }
    };

    const handleEditMedicine = (medicine) => {
        setEditingId(medicine.id);
        setName(medicine.name);
        setQuantity(medicine.quantity);
        setImportPrice(medicine.import_price);
        setPrice(medicine.price);
        setExpiryDate(medicine.expiry_date.split('T')[0]); // Format ngày
    };

    const handleDeleteMedicine = async (id) => {
        if (!window.confirm('🗑️ Bạn chắc chắn muốn xóa thuốc này?')) {
            return;
        }

        try {
            await api.delete(`/api/medicines/${id}`);
            alert('✅ Xóa thuốc thành công!');
            fetchMedicines();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể xóa'));
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="admin-container">
            <h2>⚙️ Quản Trị Hệ Thống - Kho Thuốc</h2>
            
            <div className="admin-layout">
                {/* CỘT TRÁI: Form nhập thuốc mới */}
                <div className="add-medicine-section">
                    <h3>{editingId ? '✏️ Sửa Thuốc' : '➕ Nhập Thuốc Mới'}</h3>
                    <form onSubmit={handleAddMedicine} className="medicine-form">
                        <div className="form-group">
                            <label>Tên thuốc:</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Số lượng:</label>
                            <input 
                                type="number" 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)} 
                                required 
                                min="0" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá nhập (VNĐ):</label>
                            <input 
                                type="number" 
                                value={importPrice} 
                                onChange={(e) => setImportPrice(e.target.value)} 
                                required 
                                min="0" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Giá bán (VNĐ):</label>
                            <input 
                                type="number" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                                required 
                                min="0" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày hết hạn:</label>
                            <input 
                                type="date" 
                                value={expiryDate} 
                                onChange={(e) => setExpiryDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="btn-add">
                                {editingId ? 'Cập Nhật' : 'Nhập Kho'}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={resetForm}
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* CỘT PHẢI: Bảng danh sách thuốc */}
                <div className="medicine-list-section">
                    <h3>📦 Danh Sách Thuốc Trong Kho ({medicines.length})</h3>
                    <div className="table-responsive">
                        <table className="medicine-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên thuốc</th>
                                    <th>Số lượng</th>
                                    <th>Giá nhập</th>
                                    <th>Giá bán</th>
                                    <th>Hạn sử dụng</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Kho chưa có thuốc nào.
                                        </td>
                                    </tr>
                                ) : (
                                    medicines.map(med => (
                                        <tr key={med.id}>
                                            <td>#{med.id}</td>
                                            <td><strong>{med.name}</strong></td>
                                            <td>
                                                <span className={`qty-badge ${med.quantity < 50 ? 'low-stock' : 'in-stock'}`}>
                                                    {med.quantity}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(med.import_price)}</td>
                                            <td>{formatCurrency(med.price)}</td>
                                            <td>{formatDate(med.expiry_date)}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEditMedicine(med)}
                                                    title="Sửa"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteMedicine(med.id)}
                                                    title="Xóa"
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineManager;