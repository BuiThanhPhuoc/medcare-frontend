import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('/api/admin/doctors');
            setDoctors(res.data.doctors || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải danh sách bác sĩ", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa bác sĩ ${name}?`)) return;
        try {
            await api.delete(`/api/admin/doctors/${id}`);
            alert("Xóa thành công!");
            fetchDoctors(); 
        } catch {
            alert("Lỗi khi xóa bác sĩ!");
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">Danh sách Bác sĩ</h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* BỘ LỌC */}
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Tìm tên bác sĩ, chuyên khoa..." />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select">
                                <option value="">-- Chọn chuyên khoa --</option>
                                <option value="Tim mạch">Tim mạch</option>
                                <option value="Nhi khoa">Nhi khoa</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select">
                                <option value="">-- Trạng thái --</option>
                                <option value="Đang hoạt động">Đang hoạt động</option>
                                <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
                            <button type="button" className="btn btn-dark btn-sm"><i className="fas fa-filter"></i> Lọc</button>
                        </div>
                    </form>
                </div>

                {/* HEADER BẢNG */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">Danh sách hiện tại</h5>
                    <Link to="/admin/doctors/create" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus"></i> Thêm Bác sĩ mới
                    </Link>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light" style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                    <tr>
                                        <th width="5%">ID</th>
                                        <th width="6%">Ảnh</th>
                                        <th width="14%">Họ Tên</th>
                                        <th width="13%">Chuyên Khoa</th>
                                        <th width="12%">Số điện thoại</th>
                                        <th width="15%">Email</th>
                                        <th width="8%">KN</th>
                                        <th width="10%">Trạng thái</th>
                                        <th width="22%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="text-center py-5">
                                                <i className="fas fa-inbox fs-2 text-muted mb-3 d-block"></i>
                                                <p className="mb-0">Chưa có bác sĩ nào.</p>
                                            </td>
                                        </tr>
                                    ) : doctors.map((doc) => (
                                        <tr key={doc.id}>
                                            <td>{doc.id}</td>
                                            <td>
                                                {doc.avatar_url ? (
                                                    <img src={doc.avatar_url} alt={doc.ho_ten} className="rounded-circle" style={{width:'48px', height:'48px', objectFit:'cover'}} />
                                                ) : (
                                                    <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center fw-bold" style={{width:'48px', height:'48px'}}>
                                                        {doc.ho_ten?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td><strong>{doc.ho_ten}</strong></td>
                                            <td><span className="badge bg-primary px-3 py-2">{doc.chuyen_khoa || 'N/A'}</span></td>
                                            <td>{doc.so_dien_thoai || '---'}</td>
                                            <td>{doc.email || 'N/A'}</td>
                                            <td>{doc.kinh_nghiem ? `${doc.kinh_nghiem} năm` : '0 năm'}</td>
                                            <td>
                                                <span className={`badge ${doc.trang_thai === 'Đang hoạt động' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {doc.trang_thai || 'Đang hoạt động'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <Link to={`/admin/doctors/${doc.id}`} className="btn btn-sm btn-outline-info me-1 mb-1" title="Xem"><i className="fas fa-eye"></i></Link>
                                                <Link to={`/admin/doctors/${doc.id}/edit`} className="btn btn-sm btn-outline-primary me-1 mb-1" title="Sửa"><i className="fas fa-edit"></i></Link>
                                                <button className="btn btn-sm btn-outline-success me-1 mb-1" title="Lịch làm việc"><i className="fas fa-calendar-check"></i></button>
                                                <button className="btn btn-sm btn-outline-secondary me-1 mb-1" title="Lịch nghỉ"><i className="fas fa-calendar-times"></i></button>
                                                <button onClick={() => handleDelete(doc.id, doc.ho_ten)} className="btn btn-sm btn-outline-danger mb-1" title="Xóa"><i className="fas fa-trash"></i></button>
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

export default DoctorList;