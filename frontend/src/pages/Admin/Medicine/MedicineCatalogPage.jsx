import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './Medicine.css';

const MedicineCatalogPage = () => {
    const [drugs, setDrugs] = useState([]);
    const [selectedDrugId, setSelectedDrugId] = useState('');
    const [newDrugName, setNewDrugName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDrugsWithStock = async () => {
        try {
            const res = await api.get('/api/medicines/drugs');
            setDrugs(res.data.drugs || []);
        } catch (err) {
            console.error('Lỗi lấy danh mục drugs:', err);
        }
    };

    useEffect(() => {
        fetchDrugsWithStock();
    }, []);

    const handleCreateDrug = async (e) => {
        e.preventDefault();
        if (!newDrugName.trim()) {
            alert('⚠️ Vui lòng nhập tên thuốc!');
            return;
        }
        try {
            await api.post('/api/medicines/drugs', { name: newDrugName.trim() });
            setNewDrugName('');
            fetchDrugsWithStock();
            alert('✅ Tạo danh mục thuốc thành công!');
        } catch (error) {
            alert('❌ ' + (error?.response?.data?.message || 'Lỗi tạo thuốc'));
        }
    };

    const filteredDrugs = drugs.filter(drug =>
        drug.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="medicine-page">
            <div className="page-header">
                <h1>💊 Quản Lý Danh Mục Thuốc</h1>
                <p>Quản lý danh mục thuốc và thông tin cơ bản</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon stat-blue">
                        <i className="fas fa-list"></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Tổng Danh Mục</div>
                        <div className="stat-value">{drugs.length}</div>
                    </div>
                </div>
            </div>

            <div className="medicine-grid">
                <div className="medicine-sidebar">
                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-plus-circle"></i> Tạo Danh Mục Thuốc Mới
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCreateDrug}>
                                <div className="form-group">
                                    <label>Tên Thuốc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="VD: Paracetamol 500mg"
                                        value={newDrugName}
                                        onChange={(e) => setNewDrugName(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">
                                    <i className="fas fa-check"></i> Tạo Thuốc
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="medicine-content">
                    <div className="card">
                        <div className="card-header">
                            <i className="fas fa-database"></i> Danh Mục Thuốc ({filteredDrugs.length}/{drugs.length})
                        </div>
                        <div className="card-body">
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm tên danh mục..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {filteredDrugs.length === 0 ? (
                                <p className="text-muted mt-3">
                                    {drugs.length === 0 ? 'Chưa có danh mục nào' : 'Không tìm thấy danh mục'}
                                </p>
                            ) : (
                                <div className="mt-3">
                                    {filteredDrugs.map((drug) => (
                                        <div
                                            key={drug.id}
                                            className={`drug-item ${selectedDrugId === drug.id ? 'active' : ''}`}
                                            onClick={() => setSelectedDrugId(drug.id)}
                                        >
                                            <div className="drug-name">#{drug.id} - {drug.name}</div>
                                            <div className="drug-info">
                                                <span className="badge badge-success">
                                                    Tồn: {drug.total_quantity}
                                                </span>
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
            </div>
        </div>
    );
};

export default MedicineCatalogPage;
