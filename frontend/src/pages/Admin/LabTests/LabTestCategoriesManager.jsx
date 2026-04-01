import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './LabTestsManager.css';

const LabTestCategoriesManager = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/api/health/lab-test-categories');
            setCategories(res.data.data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Lỗi tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
        setShowForm(false);
        setError('');
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setEditingId(category.id);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Vui lòng nhập tên danh mục');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            if (editingId) {
                // Update
                await api.put(`/api/health/lab-test-categories/${editingId}`, formData);
                setSuccess('✅ Cập nhật danh mục thành công');
            } else {
                // Create
                await api.post('/api/health/lab-test-categories', formData);
                setSuccess('✅ Tạo danh mục thành công');
            }

            resetForm();
            fetchCategories();
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.response?.data?.message || '❌ Lỗi khi lưu danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?`)) {
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await api.delete(`/api/health/lab-test-categories/${id}`);
            setSuccess('✅ Xóa danh mục thành công');
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            setError(err.response?.data?.message || '❌ Lỗi khi xóa danh mục');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-lg mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>📁 Quản Lý Danh Mục Xét Nghiệm</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    disabled={loading}
                >
                    {showForm ? '❌ Hủy' : '➕ Thêm Danh Mục'}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            {/* FORM */}
            {showForm && (
                <div className="card mb-4" style={{backgroundColor: 'rgba(200, 210, 220, 0.3)', border: '1px solid #ccc'}}>
                    <div className="card-body">
                        <h5 className="card-title mb-4">
                            {editingId ? '✏️ Sửa Danh Mục' : '➕ Thêm Danh Mục Mới'}
                        </h5>

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Tên Danh Mục *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ví dụ: Xét nghiệm máu"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mô Tả</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Mô tả chi tiết về danh mục..."
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={loading}
                                >
                                    {loading ? '⏳ Đang lưu...' : '💾 Lưu'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                    disabled={loading}
                                >
                                    ❌ Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TABLE */}
            {loading && !showForm ? (
                <div className="alert alert-info">⏳ Đang tải dữ liệu...</div>
            ) : categories.length === 0 ? (
                <div className="alert alert-warning">📭 Không có danh mục nào</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Tên Danh Mục</th>
                                <th>Mô Tả</th>
                                <th>Ngày Tạo</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td className="fw-bold">{category.name}</td>
                                    <td>{category.description || '—'}</td>
                                    <td>{new Date(category.created_at).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() => handleEdit(category)}
                                            disabled={loading}
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(category.id, category.name)}
                                            disabled={loading}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LabTestCategoriesManager;
