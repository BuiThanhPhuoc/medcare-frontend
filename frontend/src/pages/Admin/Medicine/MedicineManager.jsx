import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import AddMedicineModal from './AddMedicineModal';
import "./Medicine.css";

const MedicineManager = () => {
    const [medicines, setMedicines] = useState([]);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormLoading, setIsFormLoading] = useState(false);

    const [drugs, setDrugs] = useState([]);
    const [selectedDrugId, setSelectedDrugId] = useState('');
    const [batches, setBatches] = useState([]);
    const [expiringWarnings, setExpiringWarnings] = useState([]);
    const [batchFile, setBatchFile] = useState(null);
    const [batchImporting, setBatchImporting] = useState(false);
    const [batchImportFeedback, setBatchImportFeedback] = useState(null);

    const [newDrugName, setNewDrugName] = useState('');
    const [newBatchNumber, setNewBatchNumber] = useState('');
    const [newMfgDate, setNewMfgDate] = useState('');
    const [newExpDate, setNewExpDate] = useState('');
    const [newBatchQty, setNewBatchQty] = useState('');
    const [newBatchImportPrice, setNewBatchImportPrice] = useState('');
    const [newBatchSellingPrice, setNewBatchSellingPrice] = useState('');

    const fetchMedicines = async () => {
        try {
            const res = await api.get('/api/medicines');
            setMedicines(res.data.medicines);
        } catch (error) {
            console.error('Lỗi lấy danh sách thuốc:', error);
            alert('Không thể lấy danh sách thuốc!');
        }
    };

    const fetchDrugsWithStock = async () => {
        try {
            const res = await api.get('/api/medicines/drugs');
            setDrugs(res.data.drugs || []);
        } catch (error) {
            console.error('Lỗi lấy danh mục drugs:', error);
        }
    };

    const fetchExpiringWarnings = async () => {
        try {
            const res = await api.get('/api/medicines/warnings/expiring?days=90');
            setExpiringWarnings(res.data.warnings || []);
        } catch (error) {
            console.error('Lỗi lấy cảnh báo hết hạn:', error);
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
            console.error('Lỗi lấy lô thuốc:', error);
            setBatches([]);
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchDrugsWithStock();
        fetchExpiringWarnings();
    }, []);

    const handleOpenModal = (medicine = null) => {
        setEditingMedicine(medicine);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMedicine(null);
    };

    const handleAddMedicineFromModal = async (formData) => {
        setIsFormLoading(true);
        try {
            if (editingMedicine) {
                // Cập nhật thuốc
                await api.put(`/api/medicines/${editingMedicine.id}`, {
                    name: formData.name,
                    quantity: formData.quantity,
                    import_price: formData.import_price,
                    price: formData.price,
                    expiry_date: formData.expiry_date
                });
                alert('✅ Cập nhật thuốc thành công!');
            } else {
                // Thêm thuốc mới
                await api.post('/api/medicines', {
                    name: formData.name,
                    quantity: formData.quantity,
                    import_price: formData.import_price,
                    price: formData.price,
                    expiry_date: formData.expiry_date
                });
                alert('✅ Thêm thuốc vào kho thành công!');
            }
            handleCloseModal();
            fetchMedicines();
        } catch (error) {
            alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể thực hiện'));
        } finally {
            setIsFormLoading(false);
        }
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
            alert('❌ Không thể tải template batch!');
        }
    };

    const handleImportBatchExcel = async (e) => {
        e.preventDefault();
        if (!batchFile) {
            alert('⚠️ Vui lòng chọn file batch Excel!');
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
            alert('✅ Import batch thành công!');
            setBatchFile(null);
            fetchDrugsWithStock();
            fetchExpiringWarnings();
            if (selectedDrugId) fetchBatchesByDrug(selectedDrugId);
        } catch (error) {
            const msg = error?.response?.data?.message || 'Import batch thất bại.';
            alert('❌ ' + msg);
            const summary = error?.response?.data?.summary;
            const errorsList = error?.response?.data?.errors;
            if (summary || errorsList) setBatchImportFeedback({ summary, errors: errorsList });
        } finally {
            setBatchImporting(false);
        }
    };

    const handleCreateDrug = async (e) => {
        e.preventDefault();
        if (!newDrugName.trim()) {
            alert('⚠️ Vui lòng nhập tên thuốc.');
            return;
        }
        try {
            await api.post('/api/medicines/drugs', { name: newDrugName.trim() });
            setNewDrugName('');
            fetchDrugsWithStock();
            alert('✅ Tạo danh mục thuốc thành công.');
        } catch (error) {
            alert('❌ ' + (error?.response?.data?.message || 'Không thể tạo thuốc.'));
        }
    };

    const handleAddBatch = async (e) => {
        e.preventDefault();
        if (!selectedDrugId) {
            alert('⚠️ Vui lòng chọn thuốc trước khi thêm lô.');
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
            alert('✅ Thêm lô thuốc thành công.');
        } catch (error) {
            alert('❌ ' + (error?.response?.data?.message || 'Không thể thêm lô thuốc.'));
        }
    };

    return (
        <div className="admin-container mc-inventory">
            <h2 className="mc-inventory-page-title">Kho thuốc — theo danh mục &amp; lô</h2>
            <p className="text-muted small mb-3">
                <strong>Tồn bán</strong> = tổng <code>available_quantity</code> các lô (đồng bộ với trang mua thuốc của bệnh nhân).
                Bảng <em>medicines</em> cũ chỉ còn để tương thích — dùng mục cuối trang nếu cần.
            </p>

            <AddMedicineModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddMedicineFromModal}
                medicineData={editingMedicine}
                isLoading={isFormLoading}
            />

            <div className="admin-layout">
                <div className="medicine-list-section full-width">
                    <div className="list-header">
                        <h3>Danh mục thuốc &amp; tồn thực tế ({drugs.length})</h3>
                        <button type="button" className="btn-add-medicine" onClick={() => fetchDrugsWithStock()}>
                            <i className="fas fa-rotate me-2"></i> Làm mới
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="medicine-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên thuốc</th>
                                    <th>Tồn bán</th>
                                    <th>Đã nhập kho</th>
                                    <th>HSD gần nhất</th>
                                    <th>Giá bán tham khảo</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drugs.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            Chưa có danh mục thuốc. Tạo thuốc và thêm lô ở mục bên dưới.
                                        </td>
                                    </tr>
                                ) : (
                                    drugs.map((d) => {
                                        const avail = Number(d.total_available ?? 0);
                                        const imported = Number(d.total_imported ?? 0);
                                        return (
                                            <tr
                                                key={d.id}
                                                className={String(selectedDrugId) === String(d.id) ? 'table-active' : ''}
                                            >
                                                <td>#{d.id}</td>
                                                <td>
                                                    <strong>{d.name}</strong>
                                                </td>
                                                <td>
                                                    <span className={`qty-badge ${avail < 50 ? 'low-stock' : 'in-stock'}`}>
                                                        {avail}
                                                    </span>
                                                </td>
                                                <td>{imported}</td>
                                                <td>{d.nearest_expiry ? formatDate(d.nearest_expiry) : '—'}</td>
                                                <td>
                                                    {d.ref_selling_price != null
                                                        ? formatCurrency(d.ref_selling_price)
                                                        : '—'}
                                                </td>
                                                <td className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="btn-edit"
                                                        title="Chọn để thêm / xem lô"
                                                        onClick={() => {
                                                            setSelectedDrugId(d.id);
                                                            fetchBatchesByDrug(d.id);
                                                        }}
                                                    >
                                                        Lô
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="medicine-list-section mt-4">
                <h3>Thao tác nhanh — tạo thuốc, import lô, xem lô đã chọn</h3>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <h5>Tạo thuốc gốc</h5>
                        <form onSubmit={handleCreateDrug}>
                            <div className="form-group">
                                <label>Tên thuốc (drug.name)</label>
                                <input value={newDrugName} onChange={(e) => setNewDrugName(e.target.value)} />
                            </div>
                            <button className="btn-add" type="submit">Tạo thuốc</button>
                        </form>

                        <hr className="divider-soft" />
                        <h5>Import lô từ Excel</h5>
                        <form onSubmit={handleImportBatchExcel}>
                            <div className="form-group">
                                <label>File batch</label>
                                <input type="file" accept=".xlsx,.xls" onChange={(e) => setBatchFile(e.target.files?.[0] || null)} required />
                            </div>
                            <div className="excel-import-actions">
                                <button type="button" className="btn-template" onClick={handleDownloadBatchTemplate} disabled={batchImporting}>
                                    Tải template batch
                                </button>
                                <button type="submit" className="btn-import" disabled={batchImporting}>
                                    {batchImporting ? 'Đang import...' : 'Import batch'}
                                </button>
                            </div>
                        </form>
                        {batchImportFeedback?.summary && (
                            <div className="excel-import-result mt-3">
                                Inserted drugs: <b>{batchImportFeedback.summary.inserted_drugs ?? 0}</b> | Inserted batches: <b>{batchImportFeedback.summary.inserted_batches ?? 0}</b> | Updated batches: <b>{batchImportFeedback.summary.updated_batches ?? 0}</b>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-8">
                        <div className="row g-3">
                            <div className="col-12">
                                <h5>
                                    Thêm lô cho thuốc đã chọn
                                    {selectedDrugId ? (
                                        <span className="text-muted fw-normal ms-2">(ID #{selectedDrugId})</span>
                                    ) : (
                                        <span className="text-muted fw-normal ms-2">— bấm &quot;Lô&quot; trên bảng trên</span>
                                    )}
                                </h5>
                                <form onSubmit={handleAddBatch}>
                                    <div className="form-group"><label>Số lô</label><input value={newBatchNumber} onChange={(e) => setNewBatchNumber(e.target.value)} required disabled={!selectedDrugId} /></div>
                                    <div className="form-group"><label>NSX</label><input type="date" value={newMfgDate} onChange={(e) => setNewMfgDate(e.target.value)} disabled={!selectedDrugId} /></div>
                                    <div className="form-group"><label>HSD</label><input type="date" value={newExpDate} onChange={(e) => setNewExpDate(e.target.value)} required disabled={!selectedDrugId} /></div>
                                    <div className="form-group"><label>Số lượng nhập</label><input type="number" min="0" value={newBatchQty} onChange={(e) => setNewBatchQty(e.target.value)} required disabled={!selectedDrugId} /></div>
                                    <div className="form-group"><label>Giá nhập</label><input type="number" min="0" value={newBatchImportPrice} onChange={(e) => setNewBatchImportPrice(e.target.value)} required disabled={!selectedDrugId} /></div>
                                    <div className="form-group"><label>Giá bán</label><input type="number" min="0" value={newBatchSellingPrice} onChange={(e) => setNewBatchSellingPrice(e.target.value)} required disabled={!selectedDrugId} /></div>
                                    <button className="btn-add" type="submit" disabled={!selectedDrugId}>Thêm lô</button>
                                </form>
                            </div>
                        </div>

                        <hr className="divider-soft" />
                        <h5>Danh sách lô của thuốc đã chọn ({batches.length})</h5>
                        <div className="table-responsive">
                            <table className="medicine-table">
                                <thead>
                                    <tr>
                                        <th>Số lô</th>
                                        <th>NSX</th>
                                        <th>HSD</th>
                                        <th>Tồn bán</th>
                                        <th>SL nhập</th>
                                        <th>Giá nhập</th>
                                        <th>Giá bán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.length === 0 ? (
                                        <tr><td colSpan="7" className="text-center">Chưa có lô.</td></tr>
                                    ) : batches.map((b) => (
                                        <tr key={b.id}>
                                            <td>{b.batch_number}</td>
                                            <td>{b.manufacture_date ? formatDate(b.manufacture_date) : '-'}</td>
                                            <td>{formatDate(b.expiry_date)}</td>
                                            <td>{b.available_quantity ?? b.quantity}</td>
                                            <td>{b.quantity}</td>
                                            <td>{formatCurrency(b.import_price)}</td>
                                            <td>{formatCurrency(b.selling_price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <hr className="divider-soft" />
                        <h5>⚠️ Cảnh báo sắp hết hạn (&lt;= 90 ngày) ({expiringWarnings.length})</h5>
                        <div className="table-responsive">
                            <table className="medicine-table">
                                <thead>
                                    <tr>
                                        <th>Thuốc</th>
                                        <th>Số lô</th>
                                        <th>HSD</th>
                                        <th>Tồn bán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiringWarnings.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center">Không có lô sắp hết hạn.</td></tr>
                                    ) : expiringWarnings.map((w) => (
                                        <tr key={w.id}>
                                            <td>{w.drug_name}</td>
                                            <td>{w.batch_number}</td>
                                            <td>{formatDate(w.expiry_date)}</td>
                                            <td>{w.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <details className="medicine-list-section mt-4">
                <summary className="fw-bold">Bảng medicines cũ (tương thích — không dùng cho tồn thực tế)</summary>
                <div className="list-header mt-3">
                    <span>{medicines.length} dòng</span>
                    <button type="button" className="btn-add-medicine" onClick={() => handleOpenModal()}>
                        <i className="fas fa-plus me-2"></i> Thêm / sửa (legacy)
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="medicine-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên</th>
                                <th>SL (cũ)</th>
                                <th>Giá nhập</th>
                                <th>Giá bán</th>
                                <th>HSD</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        Không có bản ghi legacy.
                                    </td>
                                </tr>
                            ) : (
                                medicines.map((med) => (
                                    <tr key={med.id}>
                                        <td>#{med.id}</td>
                                        <td>{med.name}</td>
                                        <td>{med.quantity}</td>
                                        <td>{formatCurrency(med.import_price)}</td>
                                        <td>{formatCurrency(med.price)}</td>
                                        <td>{formatDate(med.expiry_date)}</td>
                                        <td className="action-buttons">
                                            <button type="button" className="btn-edit" onClick={() => handleOpenModal(med)}>
                                                Sửa
                                            </button>
                                            <button type="button" className="btn-delete" onClick={() => handleDeleteMedicine(med.id)}>
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </details>
        </div>
    );
};

export default MedicineManager;