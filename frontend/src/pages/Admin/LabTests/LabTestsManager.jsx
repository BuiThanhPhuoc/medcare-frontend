import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './LabTestsManager.css';

/**
 * Admin Page: Quản Lý Xét Nghiệm
 * CRUD loại xét nghiệm + giá (với danh mục)
 */
const LabTestsManager = () => {
    // ===== STATE =====
    const [labTests, setLabTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // ===== FORM STATE =====
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        lab_test_category_id: '',
        price: '',
        description: '',
        normal_range_min: '',
        normal_range_max: '',
        unit: ''
    });

    // ===== FETCH DATA =====
    useEffect(() => {
        fetchCategories();
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            setLoading(true);
            const params = filterCategoryId ? { category_id: filterCategoryId } : {};
            const res = await api.get('/api/health/lab-tests', { params });
            setLabTests(res.data.tests || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi lấy danh sách xét nghiệm');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/health/lab-test-categories');
            setCategories(res.data.data || []);
        } catch (err) {
            console.error('Lỗi lấy danh mục:', err);
        }
    };

    // ===== FORM HANDLERS =====
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            lab_test_category_id: '',
            price: '',
            description: '',
            normal_range_min: '',
            normal_range_max: '',
            unit: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (test) => {
        setFormData({
            name: test.name,
            code: test.code,
            lab_test_category_id: test.lab_test_category_id || '',
            price: test.price,
            description: test.description || '',
            normal_range_min: test.normal_range_min || '',
            normal_range_max: test.normal_range_max || '',
            unit: test.unit || ''
        });
        setEditingId(test.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate
        if (!formData.name || !formData.code || !formData.price || !formData.lab_test_category_id) {
            setError('Vui lòng điền đầy đủ thông tin bắt buộc (tên, mã, giá, danh mục)');
            return;
        }

        try {
            setLoading(true);

            if (editingId) {
                // Update
                await api.put(`/api/health/lab-tests/${editingId}`, {
                    name: formData.name,
                    code: formData.code,
                    lab_test_category_id: Number(formData.lab_test_category_id),
                    price: Number(formData.price),
                    description: formData.description || null,
                    normal_range_min: formData.normal_range_min || null,
                    normal_range_max: formData.normal_range_max || null,
                    unit: formData.unit || null
                });
                setSuccess('✅ Đã cập nhật xét nghiệm thành công!');
            } else {
                // Create
                await api.post('/api/health/lab-tests', {
                    name: formData.name,
                    code: formData.code,
                    lab_test_category_id: Number(formData.lab_test_category_id),
                    price: Number(formData.price),
                    description: formData.description || null,
                    normal_range_min: formData.normal_range_min || null,
                    normal_range_max: formData.normal_range_max || null,
                    unit: formData.unit || null
                });
                setSuccess('✅ Đã thêm xét nghiệm thành công!');
            }

            fetchLabTests();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi lưu xét nghiệm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Xác nhận xóa xét nghiệm "${name}"?`)) return;

        try {
            setLoading(true);
            await api.delete(`/api/health/lab-tests/${id}`);
            setSuccess('✅ Đã xóa xét nghiệm thành công!');
            fetchLabTests();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi xóa xét nghiệm');
        } finally {
            setLoading(false);
        }
    };

    // ===== FILTER DATA =====
    const filteredTests = labTests.filter((test) => {
        const matchSearch =
            test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !filterCategoryId || test.lab_test_category_id === Number(filterCategoryId);
        return matchSearch && matchCategory;
    });

    return (
        <div className="lab-tests-manager">
            <div className="lab-tests-header">
                <h1>🧪 Quản Lý Xét Nghiệm</h1>
                <button
                    className="btn-add-test"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    disabled={loading}
                >
                    ➕ Thêm Xét Nghiệm Mới
                </button>
            </div>

            {/* ALERTS */}
            {error && <div className="success-message" style={{ backgroundColor: '#fadbd8', borderColor: '#f5b7b1', color: '#c0392b' }}>{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* FILTERS */}
            <div className="lab-tests-controls">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo tên hoặc mã xét nghiệm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={filterCategoryId}
                    onChange={(e) => {
                        setFilterCategoryId(e.target.value);
                        fetchLabTests();
                    }}
                    className="category-filter"
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* TABLE */}
            {loading && !showForm ? (
                <div className="loading" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>⏳ Đang tải dữ liệu...</div>
            ) : filteredTests.length === 0 ? (
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                    <p>📭 Không có xét nghiệm nào</p>
                </div>
            ) : (
                <table className="lab-tests-table">
                    <thead>
                        <tr>
                            <th>Tên Xét Nghiệm</th>
                            <th>Mã</th>
                            <th>Danh Mục</th>
                            <th>Giá (VND)</th>
                            <th>Đơn Vị</th>
                            <th>Khoảng BT</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTests.map((test) => {
                            const category = categories.find(c => c.id === test.lab_test_category_id);
                            return (
                                <tr key={test.id}>
                                    <td><strong>{test.name}</strong></td>
                                    <td><span className="test-code">{test.code}</span></td>
                                    <td>{category?.name || 'N/A'}</td>
                                    <td><span className="test-price">{Number(test.price).toLocaleString()}</span></td>
                                    <td>{test.unit || '—'}</td>
                                    <td className="test-range">{test.normal_range_min || '—'} ~ {test.normal_range_max || '—'}</td>
                                    <td className="test-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(test)} disabled={loading}>✏️ Sửa</button>
                                        <button className="btn-delete" onClick={() => handleDelete(test.id, test.name)} disabled={loading}>🗑️ Xóa</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {/* FORM: CREATE/EDIT */}
            {showForm && (
                <div className="modal-overlay" onClick={() => resetForm()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? '✏️ Sửa Xét Nghiệm' : '➕ Thêm Xét Nghiệm Mới'}</h2>
                            <button className="btn-close" onClick={resetForm}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tên Xét Nghiệm *</label>
                                    <input type="text" required placeholder="VD: Xét nghiệm máu toàn bộ" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Mã Xét Nghiệm *</label>
                                    <input type="text" required placeholder="VD: CBC" value={formData.code} onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Danh Mục *</label>
                                    <select required value={formData.lab_test_category_id} onChange={(e) => handleInputChange('lab_test_category_id', e.target.value)}>
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Giá (VND) *</label>
                                    <input type="number" required min="0" placeholder="VD: 150000" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Đơn Vị Đo</label>
                                    <input type="text" placeholder="VD: mg/dL, Cells/μL" value={formData.unit} onChange={(e) => handleInputChange('unit', e.target.value)} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Khoảng Bình Thường (Min)</label>
                                    <input type="text" placeholder="VD: 70" value={formData.normal_range_min} onChange={(e) => handleInputChange('normal_range_min', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Khoảng Bình Thường (Max)</label>
                                    <input type="text" placeholder="VD: 100" value={formData.normal_range_max} onChange={(e) => handleInputChange('normal_range_max', e.target.value)} />
                                </div>
                            </div>

                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Mô Tả</label>
                                <textarea rows="3" placeholder="Mô tả chi tiết về xét nghiệm..." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={resetForm} disabled={loading}>Hủy</button>
                                <button type="submit" className="btn-submit" disabled={loading}>{loading ? '🔄 Đang xử lý...' : (editingId ? '✅ Cập nhật' : '✅ Thêm mới')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabTestsManager;
