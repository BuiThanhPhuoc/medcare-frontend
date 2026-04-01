import { useState, useEffect } from 'react';
import PaginationControls from '../../../components/PaginationControls';
import api from '../../../lib/api';
import './Medicine.css';

const MedicineInventoryPage = () => {
    const [medicines, setMedicines] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [importMode, setImportMode] = useState('merge');
    const [importing, setImporting] = useState(false);
    const [importFeedback, setImportFeedback] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [importPrice, setImportPrice] = useState('');
    const [price, setPrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/api/medicines');
            // Handle both 'name' and 'medicine_name' properties from different API responses
            const medicinesData = res.data.medicines || [];
            setMedicines(medicinesData.map(med => ({
                ...med,
                name: med.name || med.medicine_name || 'N/A'
            })));
            setCurrentPage(1); // Reset to page 1 when data loads
        } catch (error) {
            console.error('Lỗi:', error);
            alert('❌ Không thể lấy danh sách!');
        }
    };

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
                await api.put(`/api/medicines/${editingId}`, {
                    name,
                    quantity: Number(quantity),
                    import_price: Number(importPrice),
                    price: Number(price),
                    expiry_date: expiryDate
                });
                alert('✅ Cập nhật thành công!');
            } else {
                await api.post('/api/medicines', {
                    name,
                    quantity: Number(quantity),
                    import_price: Number(importPrice),
                    price: Number(price),
                    expiry_date: expiryDate
                });
                alert('✅ Thêm thuốc thành công!');
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
        setExpiryDate(medicine.expiry_date.split('T')[0]);
    };

    const handleDeleteMedicine = async (id) => {
        if (!window.confirm('🗑️ Bạn chắc chắn muốn xóa thuốc này?')) return;

        try {
            await api.delete(`/api/medicines/${id}`);
            alert('✅ Xóa thành công!');
            fetchMedicines();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể xóa'));
        }
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
        } catch {
            alert('❌ Không thể tải template!');
        }
    };

    const handleImportExcel = async (e) => {
        e.preventDefault();
        if (!excelFile) {
            alert('⚠️ Vui lòng chọn file Excel!');
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
            fetchMedicines();
        } catch (error) {
            const msg = error?.response?.data?.message || 'Không thể import';
            alert('❌ ' + msg);
            const summary = error?.response?.data?.summary;
            const errorsList = error?.response?.data?.errors;
            if (summary || errorsList) setImportFeedback({ summary, errors: errorsList });
        } finally {
            setImporting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return 'out-of-stock';
        if (quantity < 50) return 'low-stock';
        return 'in-stock';
    };

    // Normalize medicine names and filter safely
    const filteredMedicines = medicines
        .filter(med => {
            const medName = med.name || '';
            return medName.toLowerCase().includes(searchTerm.toLowerCase());
        });

    // Pagination
    const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + itemsPerPage);

    const totalMedicines = medicines.length;
    const totalQuantity = medicines.reduce((sum, med) => sum + med.quantity, 0);
    const lowStockCount = medicines.filter(med => med.quantity > 0 && med.quantity < 50).length;
    const outOfStock = medicines.filter(med => med.quantity === 0).length;

    return (
        <div className="medicine-page">
            <div className="page-header">
                <h1>📦 Quản Lý Kho Thuốc</h1>
                <p>Quản lý tồn kho thuốc tại nhà thuốc/bệnh viện</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-blue">
                        <i className="fas fa-pills"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Tổng Loại Thuốc</div>
                        <div className="stat-value">{totalMedicines}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-green">
                        <i className="fas fa-cube"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Tổng Số Lượng</div>
                        <div className="stat-value">{totalQuantity}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-orange">
                        <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Sắp Hết</div>
                        <div className="stat-value">{lowStockCount}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-red">
                        <i className="fas fa-ban"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Hết Hàng</div>
                        <div className="stat-value">{outOfStock}</div>
                    </div>
                </div>
            </div>

            <div className="medicine-grid">
                <div className="medicine-sidebar">
                    <div className="card">
                        <div className="card-header">
                            <i className={editingId ? 'fas fa-edit' : 'fas fa-plus-circle'}></i>
                            {editingId ? ' Cập Nhật Thuốc' : ' Nhập Thuốc Mới'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddMedicine}>
                                <div className="form-group">
                                    <label>Tên Thuốc *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="VD: Paracetamol 500mg"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-6">
                                        <label>Số Lượng *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-6">
                                        <label>Giá Vốn VNĐ *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={importPrice}
                                            onChange={(e) => setImportPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-6">
                                        <label>Giá Bán VNĐ *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group col-6">
                                        <label>Hạn Sử Dụng *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="button-group">
                                    <button type="submit" className="btn btn-primary btn-block">
                                        <i className={`fas ${editingId ? 'fa-save' : 'fa-plus'}`}></i>
                                        {editingId ? ' Cập Nhật' : ' Nhập Kho'}
                                    </button>
                                    {editingId && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-block"
                                            onClick={resetForm}
                                        >
                                            <i className="fas fa-times"></i> Hủy
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-file-excel"></i> Import Từ Excel
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleImportExcel}>
                                <div className="form-group">
                                    <label>Chọn File (.xlsx, .xls)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mode Xử Lý</label>
                                    <select
                                        className="form-control"
                                        value={importMode}
                                        onChange={(e) => setImportMode(e.target.value)}
                                    >
                                        <option value="merge">Merge (Cộng SL)</option>
                                        <option value="replace">Replace (Ghi Đè)</option>
                                        <option value="skip">Skip (Bỏ Qua)</option>
                                    </select>
                                    <small className="form-text text-muted">
                                        • Merge: Cộng số lượng nếu trùng<br/>
                                        • Replace: Ghi đè dữ liệu cũ<br/>
                                        • Skip: Bỏ qua nếu trùng
                                    </small>
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleDownloadTemplate}
                                        disabled={importing}
                                    >
                                        <i className="fas fa-download"></i> Template
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={importing}
                                    >
                                        {importing ? '⏳ Importing...' : 'Import'}
                                    </button>
                                </div>
                            </form>

                            {importFeedback?.summary && (
                                <div className="alert alert-info mt-3">
                                    <strong>📊 Kết Quả:</strong><br/>
                                    ✅ Thêm: {importFeedback.summary.inserted ?? 0}<br/>
                                    🔄 Cập: {importFeedback.summary.updated ?? 0}<br/>
                                    ⊘ Bỏ: {importFeedback.summary.skipped ?? 0}<br/>
                                    ❌ Lỗi: {importFeedback.summary.errors ?? 0}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="medicine-content">
                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-list"></i>
                            Danh Sách Thuốc ({paginatedMedicines.length}/{filteredMedicines.length} - Trang {currentPage}/{totalPages || 1})
                        </div>
                        <div className="card-body">
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm tên thuốc..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            {paginatedMedicines.length === 0 ? (
                                <p className="text-muted mt-3">
                                    {medicines.length === 0 ? 'Kho trống' : 'Không tìm thấy thuốc'}
                                </p>
                            ) : (
                                <>
                                    <div className="table-responsive mt-3">
                                        <table className="table medicine-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tên Thuốc</th>
                                                    <th>SL</th>
                                                    <th>Giá Vốn</th>
                                                    <th>Giá Bán</th>
                                                    <th>HSD</th>
                                                    <th>Hành Động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedMedicines.map((med) => (
                                                    <tr key={med.id} className={`status-${getStockStatus(med.quantity)}`}>
                                                        <td className="text-muted">#{med.id}</td>
                                                        <td>
                                                            <strong>{med.name}</strong>
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${getStockStatus(med.quantity)}`}>
                                                                {med.quantity}
                                                            </span>
                                                        </td>
                                                        <td>{formatCurrency(med.import_price)}</td>
                                                        <td>{formatCurrency(med.price)}</td>
                                                        <td>
                                                            <small>{formatDate(med.expiry_date)}</small>
                                                        </td>
                                                        <td className="action-buttons">
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleEditMedicine(med)}
                                                                title="Sửa"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteMedicine(med.id)}
                                                                title="Xóa"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {totalPages > 1 && (
                                        <PaginationControls
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineInventoryPage;
