import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './Medicine.css';

const MedicineBatchPage = () => {
    const [drugs, setDrugs] = useState([]);
    const [selectedDrugId, setSelectedDrugId] = useState('');
    const [batches, setBatches] = useState([]);
    const [expiringWarnings, setExpiringWarnings] = useState([]);
    
    const [newBatchNumber, setNewBatchNumber] = useState('');
    const [newMfgDate, setNewMfgDate] = useState('');
    const [newExpDate, setNewExpDate] = useState('');
    const [newBatchQty, setNewBatchQty] = useState('');
    const [newBatchImportPrice, setNewBatchImportPrice] = useState('');
    const [newBatchSellingPrice, setNewBatchSellingPrice] = useState('');
    
    const [batchFile, setBatchFile] = useState(null);
    const [batchImporting, setBatchImporting] = useState(false);
    const [batchImportFeedback, setBatchImportFeedback] = useState(null);

    useEffect(() => {
        fetchDrugsWithStock();
        fetchExpiringWarnings();
    }, []);

    const fetchDrugsWithStock = async () => {
        try {
            const res = await api.get('/api/medicines/drugs');
            setDrugs(res.data.drugs || []);
        } catch (error) {
            console.error('Lỗi lấy danh mục:', error);
        }
    };

    const fetchExpiringWarnings = async () => {
        try {
            const res = await api.get('/api/medicines/warnings/expiring?days=90');
            setExpiringWarnings(res.data.warnings || []);
        } catch (error) {
            console.error('Lỗi lấy cảnh báo:', error);
        }
    };

    const fetchBatchesByDrug = async (drugId) => {
        if (!drugId) {
            setBatches([]);
            return;
        }
        try {
            const res = await api.get(`/api/medicines/drugs/${drugId}/batches`);
            setBatches(res.data.batches || []);
        } catch (error) {
            console.error('Lỗi lấy lô:', error);
            setBatches([]);
        }
    };

    const handleAddBatch = async (e) => {
        e.preventDefault();
        if (!selectedDrugId) {
            alert('⚠️ Vui lòng chọn thuốc trước!');
            return;
        }
        if (!newBatchNumber || !newExpDate) {
            alert('⚠️ Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            await api.post(`/api/medicines/drugs/${selectedDrugId}/batches`, {
                batch_number: newBatchNumber,
                manufacture_date: newMfgDate || null,
                expiry_date: newExpDate,
                quantity: Number(newBatchQty || 0),
                import_price: Number(newBatchImportPrice || 0),
                selling_price: Number(newBatchSellingPrice || 0)
            });
            
            setNewBatchNumber('');
            setNewMfgDate('');
            setNewExpDate('');
            setNewBatchQty('');
            setNewBatchImportPrice('');
            setNewBatchSellingPrice('');
            
            fetchBatchesByDrug(selectedDrugId);
            fetchDrugsWithStock();
            fetchExpiringWarnings();
            alert('✅ Thêm lô thuốc thành công!');
        } catch (error) {
            alert('❌ ' + (error?.response?.data?.message || 'Lỗi'));
        }
    };

    const handleDownloadBatchTemplate = async () => {
        try {
            const res = await api.get('/api/medicines/batches/template', { responseType: 'blob' });
            const blob = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'drug_batches_template.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert('❌ Không thể tải template!');
        }
    };

    const handleImportBatchExcel = async (e) => {
        e.preventDefault();
        if (!batchFile) {
            alert('⚠️ Vui lòng chọn file!');
            return;
        }
        try {
            setBatchImporting(true);
            setBatchImportFeedback(null);
            const formData = new FormData();
            formData.append('file', batchFile);
            const res = await api.post('/api/medicines/batches/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBatchImportFeedback({
                summary: res.data?.summary,
                errors: res.data?.errors
            });
            setBatchFile(null);
            fetchDrugsWithStock();
            fetchExpiringWarnings();
            if (selectedDrugId) fetchBatchesByDrug(selectedDrugId);
            alert('✅ Import batch thành công!');
        } catch (error) {
            alert('❌ ' + (error?.response?.data?.message || 'Import thất bại'));
        } finally {
            setBatchImporting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getDaysUntilExpiry = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return days;
    };

    const getStatusColor = (days) => {
        if (days < 30) return 'critical';
        if (days < 60) return 'warning';
        return 'normal';
    };

    return (
        <div className="medicine-page">
            <div className="page-header">
                <h1>📦 Quản Lý Lô Thuốc</h1>
                <p>Quản lý lô, ngày hết hạn và theo dõi kho</p>
            </div>

            <div className="medicine-grid">
                <div className="medicine-sidebar">
                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-file-excel"></i> Import Lô Từ Excel
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleImportBatchExcel}>
                                <div className="form-group">
                                    <label>Chọn file (.xlsx, .xls)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => setBatchFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleDownloadBatchTemplate}
                                        disabled={batchImporting}
                                    >
                                        <i className="fas fa-download"></i> Template
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={batchImporting}
                                    >
                                        {batchImporting ? 'Đang import...' : 'Import Lô'}
                                    </button>
                                </div>
                            </form>
                            {batchImportFeedback?.summary && (
                                <div className="alert alert-info mt-3">
                                    <strong>Kết quả:</strong><br/>
                                    Thuốc: {batchImportFeedback.summary.inserted_drugs ?? 0} |
                                    Lô: {batchImportFeedback.summary.inserted_batches ?? 0}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-plus"></i> Thêm Lô Cho Thuốc Đã Chọn
                        </div>
                        <div className="card-body">
                            {selectedDrugId ? (
                                <form onSubmit={handleAddBatch}>
                                    <div className="form-group">
                                        <label>Số Lô</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="VD: LOT-2026-001"
                                            value={newBatchNumber}
                                            onChange={(e) => setNewBatchNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày Sản Xuất</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={newMfgDate}
                                            onChange={(e) => setNewMfgDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày Hết Hạn *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={newExpDate}
                                            onChange={(e) => setNewExpDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-6">
                                            <label>Số Lượng</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                value={newBatchQty}
                                                onChange={(e) => setNewBatchQty(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-6">
                                            <label>Giá Vốn</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                value={newBatchImportPrice}
                                                onChange={(e) => setNewBatchImportPrice(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Giá Bán</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={newBatchSellingPrice}
                                            onChange={(e) => setNewBatchSellingPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">
                                        <i className="fas fa-plus"></i> Thêm Lô
                                    </button>
                                </form>
                            ) : (
                                <div className="alert alert-warning">
                                    <i className="fas fa-info-circle"></i> Vui lòng chọn một thuốc từ danh sách bên phải
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="medicine-content">
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fas fa-list"></i> Danh Mục Thuốc ({drugs.length})
                                </div>
                                <div className="card-body">
                                    {drugs.length === 0 ? (
                                        <p className="text-muted">Chưa có danh mục nào</p>
                                    ) : (
                                        <div className="drug-list">
                                            {drugs.map((drug) => (
                                                <div
                                                    key={drug.id}
                                                    className={`drug-item ${selectedDrugId === drug.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setSelectedDrugId(drug.id);
                                                        fetchBatchesByDrug(drug.id);
                                                    }}
                                                >
                                                    <div className="drug-name">{drug.name}</div>
                                                    <div className="drug-info">
                                                        <span className="badge badge-success">Tồn: {drug.total_quantity}</span>
                                                        {drug.nearest_expiry && (
                                                            <span className="badge badge-warning">
                                                                HH: {formatDate(drug.nearest_expiry)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fas fa-boxes"></i> Lô Thuốc ({batches.length})
                                </div>
                                <div className="card-body">
                                    {!selectedDrugId ? (
                                        <p className="text-muted">Chọn một thuốc để xem chi tiết lô</p>
                                    ) : batches.length === 0 ? (
                                        <p className="text-muted">Thuốc này chưa có lô nào</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Số Lô</th>
                                                        <th>HSD</th>
                                                        <th>Tồn</th>
                                                        <th>Giá Bán</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {batches.map((batch) => (
                                                        <tr key={batch.id}>
                                                            <td>
                                                                <strong>{batch.batch_number}</strong>
                                                            </td>
                                                            <td>
                                                                {formatDate(batch.expiry_date)}
                                                                <br/>
                                                                <small className={`status-badge ${getStatusColor(getDaysUntilExpiry(batch.expiry_date))}`}>
                                                                    {getDaysUntilExpiry(batch.expiry_date)} ngày
                                                                </small>
                                                            </td>
                                                            <td>{batch.quantity}</td>
                                                            <td>{formatCurrency(batch.selling_price)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-4">
                        <div className="card-header card-header-danger">
                            <i className="fas fa-exclamation-triangle"></i> Cảnh Báo Hết Hạn (≤ 90 ngày)
                        </div>
                        <div className="card-body">
                            {expiringWarnings.length === 0 ? (
                                <p className="text-success">✅ Không có lô sắp hết hạn</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Thuốc</th>
                                                <th>Số Lô</th>
                                                <th>Hết Hạn</th>
                                                <th>Tồn</th>
                                                <th>Trạng Thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expiringWarnings.map((warning) => {
                                                const days = getDaysUntilExpiry(warning.expiry_date);
                                                return (
                                                    <tr key={warning.id} className={`status-${getStatusColor(days)}`}>
                                                        <td>{warning.drug_name}</td>
                                                        <td>{warning.batch_number}</td>
                                                        <td>{formatDate(warning.expiry_date)}</td>
                                                        <td>{warning.quantity}</td>
                                                        <td>
                                                            <span className={`badge badge-${days < 30 ? 'danger' : 'warning'}`}>
                                                                {days} ngày
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineBatchPage;
