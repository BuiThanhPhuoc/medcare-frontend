import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

const SpecialtyList = () => {
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSpecialties = async () => {
        try {
            const res = await api.get('/api/admin/specialties');
            setSpecialties(res.data.specialties || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải danh sách chuyên khoa:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchSpecialties(); }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa chuyên khoa ${name}?`)) return;
        try {
            await api.delete(`/api/admin/specialties/${id}`);
            alert("Xóa thành công!");
            fetchSpecialties();
        } catch {
            alert("Lỗi khi xóa chuyên khoa!");
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0 text-dark">
                    <i className="fas fa-stethoscope text-primary me-2"></i> Quản lý Chuyên khoa
                </h2>
                <Link to="/admin/specialties/create" className="btn btn-primary btn-sm px-3 py-2">
                    <i className="fas fa-plus me-1"></i> Thêm Chuyên khoa
                </Link>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped mb-0 align-middle">
                                <thead className="table-light">
                                    <tr style={{ textTransform: 'uppercase', fontSize: '13px', fontWeight: 600 }}>
                                        <th width="35%" className="p-3">Tên chuyên khoa</th>
                                        <th width="25%" className="p-3">Slug</th>
                                        <th width="15%" className="p-3">Số bác sĩ</th>
                                        <th width="25%" className="text-center p-3">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {specialties.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">
                                                <i className="fas fa-folder-open fs-1 mb-3 d-block opacity-50"></i>
                                                <p className="mb-0">Chưa có chuyên khoa nào</p>
                                            </td>
                                        </tr>
                                    ) : specialties.map((item) => (
                                        <tr key={item.id} style={{ transition: 'background 0.2s' }}>
                                            <td className="fw-semibold p-3">{item.ten}</td>
                                            <td className="p-3">
                                                <span className="badge bg-secondary px-2 py-1" style={{ fontSize: '12px' }}>{item.slug || '---'}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className="badge bg-info text-dark px-3 py-2" style={{ fontSize: '13px' }}>
                                                    {item.bac_sis_count || 0}
                                                </span>
                                            </td>
                                            <td className="text-center text-nowrap p-3">
                                                <Link to={`/admin/specialties/${item.id}/edit`} className="btn btn-sm btn-outline-primary me-2" title="Sửa">
                                                    <i className="fas fa-pencil-alt"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id, item.ten)} className="btn btn-sm btn-outline-danger" title="Xóa">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpecialtyList;