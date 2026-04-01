import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PaginationControls from '../../../components/PaginationControls';
import api from '../../../lib/api';

// 🔥 Hàm "thần thánh" lột sạch dấu tiếng Việt và chuyển thành chữ thường
const removeAccents = (str) => {
    if (!str) return '';
    return str
        .normalize('NFD') // Tách dấu ra khỏi chữ
        .replace(/[\u0300-\u036f]/g, '') // Xóa hết các dấu phẩy, ngã, hỏi, nặng, huyền...
        .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Xử lý riêng chữ đ/Đ
        .toLowerCase(); // Chuyển về chữ thường hết
};

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const [docsRes, specsRes] = await Promise.all([
                api.get('/api/admin/doctors'),
                api.get('/api/admin/specialties')
            ]);
            setDoctors(docsRes.data.doctors || []);
            setSpecialties(specsRes.data.specialties || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
            console.error("Error response:", error.response?.data);
            alert(`❌ Lỗi tải dữ liệu: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa bác sĩ ${name}?`)) return;
        try {
            await api.delete(`/api/admin/doctors/${id}`);
            alert("Xóa thành công!");
            fetchData();
        } catch { alert("Lỗi khi xóa bác sĩ!"); }
    };

    // ==========================================
    // LOGIC LỌC VÀ SẮP XẾP DỮ LIỆU
    // ==========================================
    const filteredDoctors = doctors
        .filter((doc) => {
            const docName = doc.full_name || doc.ho_ten || '';
            const docSpecialty = doc.specialty || doc.chuyen_khoa || '';
            const docStatus = doc.status || doc.trang_thai || '';

            // 🔥 Áp dụng hàm lột dấu cho cả từ khóa nhập vào và dữ liệu của DB
            const safeSearchTerm = removeAccents(searchTerm);
            const matchSearch = 
                removeAccents(docName).includes(safeSearchTerm) ||
                removeAccents(docSpecialty).includes(safeSearchTerm);

            const matchSpecialty = filterSpecialty ? docSpecialty === filterSpecialty : true;
            const matchStatus = filterStatus ? docStatus === filterStatus : true;

            return matchSearch && matchSpecialty && matchStatus;
        })
        .sort((a, b) => a.id - b.id); // Vẫn giữ sắp xếp tăng dần 1, 2, 3...

    // Pagination
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold">Danh sách Bác sĩ</h2>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-4">
                            <input 
                                type="text" 
                                id="searchInput"
                                name="searchInput"
                                className="form-control" 
                                placeholder="Tìm tên bác sĩ, chuyên khoa..." 
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                id="specialtyFilter"
                                name="specialtyFilter"
                                className="form-select"
                                value={filterSpecialty}
                                onChange={(e) => {
                                    setFilterSpecialty(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">-- Tất cả chuyên khoa --</option>
                                {specialties.map(sp => {
                                    const spName = sp.name || sp.ten; 
                                    return <option key={sp.id} value={spName}>{spName}</option>;
                                })}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                id="statusFilter"
                                name="statusFilter"
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="Active">Đang hoạt động</option>
                                <option value="Inactive">Ngừng hoạt động</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
                            <button type="button" className="btn btn-dark btn-sm">
                                <i className="fas fa-filter"></i> Lọc
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách hiện tại <span className="badge bg-primary ms-2">{paginatedDoctors.length}/{filteredDoctors.length} (Trang {currentPage}/{totalPages || 1})</span>
                    </h5>
                    <Link to="/admin/doctors/create" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus"></i> Thêm Bác sĩ mới
                    </Link>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped align-middle mb-0">
                                    <thead className="table-light" style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <tr>
                                            <th width="5%" className="text-center">ID</th>
                                            <th width="6%" className="text-center">Ảnh</th>
                                            <th width="14%">Họ Tên</th>
                                            <th width="13%">Chuyên Khoa</th>
                                            <th width="12%">Số điện thoại</th>
                                            <th width="15%">Email</th>
                                            <th width="8%">KN</th>
                                            <th width="10%" className="text-center">Trạng thái</th>
                                            <th width="22%" className="text-center">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedDoctors.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5">
                                                    <i className="fas fa-search fs-2 text-muted mb-3 d-block opacity-50"></i>
                                                    <p className="mb-0">Không tìm thấy bác sĩ nào phù hợp.</p>
                                                </td>
                                            </tr>
                                        ) : paginatedDoctors.map((doc) => {
                                            const docName = doc.full_name || doc.ho_ten || 'N/A';
                                            const docSpecialty = doc.specialty || doc.chuyen_khoa || 'N/A';
                                            const docPhone = doc.phone || doc.so_dien_thoai || '---';
                                            const docStatus = doc.status || doc.trang_thai || 'Active';

                                            return (
                                            <tr key={doc.id}>
                                                <td className="text-center">{doc.id}</td>
                                                <td className="text-center">
                                                    {doc.avatar_url ? (
                                                        <img src={doc.avatar_url} alt={docName} className="rounded-circle" style={{width:'40px', height:'40px', objectFit:'cover'}} />
                                                    ) : (
                                                        <div className="rounded-circle bg-light text-muted d-inline-flex align-items-center justify-content-center fw-bold" style={{width:'40px', height:'40px'}}>
                                                            {docName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td><strong className="text-dark">{docName}</strong></td>
                                                <td><span className="badge bg-primary px-2 py-1">{docSpecialty}</span></td>
                                                <td>{docPhone}</td>
                                                <td>{doc.email || 'N/A'}</td>
                                                <td>{doc.experience || doc.kinh_nghiem ? `${doc.experience || doc.kinh_nghiem} năm` : '0 năm'}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${docStatus === 'Đang hoạt động' || docStatus === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                        {docStatus === 'Active' || docStatus === 'Đang hoạt động' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <Link to={`/admin/doctors/${doc.id}`} className="btn btn-sm btn-outline-info me-1 mb-1" title="Xem"><i className="fas fa-eye"></i></Link>
                                                    <Link to={`/admin/doctors/${doc.id}/edit`} className="btn btn-sm btn-outline-primary me-1 mb-1" title="Sửa"><i className="fas fa-edit"></i></Link>
                                                    <button onClick={() => handleDelete(doc.id, docName)} className="btn btn-sm btn-outline-danger mb-1" title="Xóa"><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <div className="card-footer">
                                    <PaginationControls
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorList;