import { useState, useEffect } from 'react';
import api from '../../lib/api';
import './CSS/Admin.css';

const Admin = () => {
    const [medicines, setMedicines] = useState([]);
    
    // State cho Form thêm thuốc mới
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [importPrice, setImportPrice] = useState('');
    const [price, setPrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    // Hàm lấy danh sách thuốc từ kho
    const fetchMedicines = async () => {
        try {
            const res = await api.get('/api/medicines');
            setMedicines(res.data.medicines);
        } catch (error) {
            console.error('Lỗi lấy danh sách thuốc:', error);
        }
    };

    // Chạy ngay khi vào trang Admin
    useEffect(() => {
        fetchMedicines();
    }, []);

    // Hàm Submit thêm thuốc mới
    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/medicines', {
                name,
                quantity: Number(quantity),
                import_price: Number(importPrice),
                price: Number(price),
                expiry_date: expiryDate
            });

            alert('✅ Thêm thuốc vào kho thành công!');
            
            // Thêm xong thì reset form và tải lại danh sách
            setName('');
            setQuantity('');
            setImportPrice('');
            setPrice('');
            setExpiryDate('');
            fetchMedicines();
        } catch (error) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể thêm thuốc'));
        }
    };

    // Hàm fomat tiền tệ VNĐ cho đẹp
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Hàm format ngày tháng (từ YYYY-MM-DD sang DD/MM/YYYY)
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
                    <h3>➕ Nhập Thuốc Mới</h3>
                    <form onSubmit={handleAddMedicine} className="medicine-form">
                        <div className="form-group">
                            <label>Tên thuốc:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Số lượng nhập:</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
                        </div>
                        <div className="form-group">
                            <label>Giá nhập (VNĐ):</label>
                            <input type="number" value={importPrice} onChange={(e) => setImportPrice(e.target.value)} required min="0" />
                        </div>
                        <div className="form-group">
                            <label>Giá bán (VNĐ):</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
                        </div>
                        <div className="form-group">
                            <label>Ngày hết hạn:</label>
                            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-add">Nhập Kho</button>
                    </form>
                </div>

                {/* CỘT PHẢI: Bảng danh sách thuốc */}
                <div className="medicine-list-section">
                    <h3>📦 Danh Sách Thuốc Trong Kho</h3>
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
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center">Kho chưa có thuốc nào.</td></tr>
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

export default Admin;