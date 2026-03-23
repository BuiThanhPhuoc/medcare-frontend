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

    // ===========================
    // Excel import state
    // ===========================
    const [excelFile, setExcelFile] = useState(null);
    const [importMode, setImportMode] = useState('merge'); // merge | replace | skip
    const [importing, setImporting] = useState(false);
    const [importFeedback, setImportFeedback] = useState(null); // { summary, errors }

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

    const handleDownloadTemplate = async () => {
        try {
            const res = await api.get('/api/medicines/template', { responseType: 'blob' });
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'medicine_template.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('❌ Không thể tải template Excel!');
        }
    };

    const handleImportExcel = async (e) => {
        e.preventDefault();
        if (!excelFile) {
            alert('⚠️ Vui lòng chọn file Excel (.xlsx/.xls) trước khi import!');
            return;
        }

        try {
            setImporting(true);
            setImportFeedback(null);

            const formData = new FormData();
            formData.append('file', excelFile);
            formData.append('mode', importMode);

            const res = await api.post('/api/medicines/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { summary, errors } = res.data ?? {};
            setImportFeedback({ summary, errors });
            alert('✅ Import thành công!');
            setExcelFile(null);
            // refresh list
            fetchMedicines();
        } catch (error) {
            const msg = error?.response?.data?.message || 'Không thể import Excel.';
            alert('❌ ' + msg);
            const summary = error?.response?.data?.summary;
            const errorsList = error?.response?.data?.errors;
            if (summary || errorsList) setImportFeedback({ summary, errors: errorsList });
        } finally {
            setImporting(false);
        }
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

                    <div className="excel-import-section">
                        <hr className="divider-soft" />
                        <h4 className="excel-import-title">
                            <i className="fas fa-file-excel me-2 text-success" />
                            Nhập từ Excel
                        </h4>

                        <form onSubmit={handleImportExcel} className="excel-import-form">
                            <div className="form-group">
                                <label>Chọn file Excel:</label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        setExcelFile(f || null);
                                    }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Chế độ xử lý trùng:</label>
                                <select
                                    className="form-select excel-import-select"
                                    value={importMode}
                                    onChange={(e) => setImportMode(e.target.value)}
                                >
                                    <option value="merge">merge (cộng số lượng)</option>
                                    <option value="replace">replace (ghi đè)</option>
                                    <option value="skip">skip (bỏ qua)</option>
                                </select>
                            </div>

                            <div className="excel-import-actions">
                                <button type="button" className="btn-template" onClick={handleDownloadTemplate} disabled={importing}>
                                    <i className="fas fa-download me-1" /> Tải template
                                </button>
                                <button type="submit" className="btn-import" disabled={importing}>
                                    {importing ? 'Đang import...' : 'Import'}
                                </button>
                            </div>
                        </form>

                        <div className="excel-import-note">
                            Yêu cầu cột: <b>name</b>, <b>quantity</b>, <b>import_price</b>, <b>price</b>, <b>expiry_date</b>.
                            <br />
                            Khuyến nghị dùng đúng file template của hệ thống.
                        </div>

                        {importFeedback?.summary && (
                            <div className="excel-import-result">
                                <div className="fw-bold mb-2">Kết quả import</div>
                                <div className="text-muted">
                                    Inserted: <b>{importFeedback.summary.inserted ?? 0}</b> |
                                    Updated: <b>{importFeedback.summary.updated ?? 0}</b> |
                                    Skipped: <b>{importFeedback.summary.skipped ?? 0}</b> |
                                    Errors: <b>{importFeedback.summary.errors ?? 0}</b>
                                </div>
                                {importFeedback.errors?.length > 0 && (
                                    <div className="mt-2">
                                        <div className="fw-bold text-danger mb-1">Một vài lỗi (tối đa 30 dòng):</div>
                                        <div className="excel-error-list">
                                            {importFeedback.errors.map((er, idx) => (
                                                <div key={idx} className="excel-error-item">
                                                    Dòng {er.row}: {er.message}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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