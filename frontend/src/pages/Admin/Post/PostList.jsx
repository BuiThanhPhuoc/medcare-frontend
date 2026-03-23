import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm mượt mà
const removeAccents = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
};

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchData = async () => {
        try {
            const [postsRes, catRes] = await Promise.all([
                api.get('/api/admin/posts'),
                api.get('/api/admin/categories')
            ]);
            setPosts(postsRes.data.posts || []);
            setCategories(catRes.data.categories || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            console.error("Error response:", error.response?.data);
            alert(`❌ Lỗi tải bài viết: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn chuyển bài viết này vào thùng rác?')) return;
        try {
            await api.delete(`/api/admin/posts/${id}`);
            alert("Đã chuyển vào thùng rác!");
            fetchData(); 
        } catch {
            alert("Lỗi khi xóa bài viết!");
        }
    };

    // ==========================================
    // LOGIC LỌC VÀ SẮP XẾP DỮ LIỆU
    // ==========================================
    const filteredPosts = posts
        .filter((post) => {
            const postTitle = post.title || '';
            const postCategory = post.category_id?.toString() || '';
            const postStatus = post.status || '';

            // Tìm kiếm thông minh (không quan tâm viết hoa/thường hay có dấu)
            const safeSearchTerm = removeAccents(searchTerm);
            const matchSearch = removeAccents(postTitle).includes(safeSearchTerm);
            
            const matchCategory = filterCategory ? postCategory === filterCategory : true;
            const matchStatus = filterStatus ? postStatus === filterStatus : true;

            return matchSearch && matchCategory && matchStatus;
        })
        // Sắp xếp ID TĂNG DẦN (1, 2, 3...)
        .sort((a, b) => a.id - b.id); 

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-newspaper me-2 text-primary"></i> Danh sách Bài viết
                </h1>
                <div>
                    <Link to="/admin/posts/trashed" className="btn btn-warning me-2">
                        <i className="fas fa-trash-restore"></i> Thùng rác
                    </Link>
                    <Link to="/admin/posts/create" className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm bài viết
                    </Link>
                </div>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-4">
                            <input 
                                type="text" 
                                id="searchPost"
                                name="searchPost"
                                className="form-control" 
                                placeholder="Tìm tiêu đề bài viết (không cần gõ dấu)..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <div className="col-md-3">
                            <select 
                                id="categoryFilter"
                                name="categoryFilter"
                                className="form-select"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)} 
                            >
                                <option value="">-- Tất cả danh mục --</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id.toString()}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select 
                                id="statusFilter"
                                name="statusFilter"
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)} 
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="published">Đã xuất bản</option>
                                <option value="draft">Bản nháp</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-grid">
                            <button type="button" className="btn btn-dark btn-sm">
                                <i className="fas fa-filter"></i> Lọc
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Đang hiển thị <span className="badge bg-primary ms-2">{filteredPosts.length}</span> bài viết
                    </h5>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle mb-0">
                                <thead className="table-light" style={{textTransform: 'uppercase', fontSize: '13px', fontWeight: 600}}>
                                    <tr>
                                        <th className="p-3 text-center" width="5%">ID</th>
                                        <th className="p-3 text-center" width="8%">Ảnh</th>
                                        <th className="p-3" width="28%">Tiêu đề</th>
                                        <th className="p-3 text-center" width="15%">Danh mục</th>
                                        <th className="p-3 text-center" width="12%">Trạng thái</th>
                                        <th className="p-3 text-center" width="17%">Ngày xuất bản</th>
                                        <th className="p-3 text-center" width="15%">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5 text-muted">
                                                <i className="fas fa-search fs-2 mb-3 d-block opacity-50"></i>
                                                Không tìm thấy bài viết nào phù hợp.
                                            </td>
                                        </tr>
                                    ) : filteredPosts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="p-3 text-center">{post.id}</td>
                                            
                                            {/* XỬ LÝ HIỂN THỊ THUMBNAIL */}
                                            <td className="p-3 text-center">
                                                {post.thumbnail ? (
                                                    <img src={post.thumbnail} alt={post.title} className="rounded shadow-sm" style={{width: '60px', height: '40px', objectFit: 'cover'}} />
                                                ) : (
                                                    <div className="bg-light rounded d-inline-flex align-items-center justify-content-center border" style={{width: '60px', height: '40px'}}>
                                                        <i className="fas fa-image text-muted opacity-50"></i>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-3 fw-bold text-dark">{post.title}</td>
                                            <td className="p-3 text-center">
                                                <span className="badge bg-info text-dark px-3 py-2">
                                                    {post.category_name || 'Không có'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {post.status === 'published' ? (
                                                    <span className="badge bg-success px-3 py-2">Đã xuất bản</span>
                                                ) : (
                                                    <span className="badge bg-secondary px-3 py-2">Nháp</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-center text-muted small">
                                                {post.published_at ? new Date(post.published_at).toLocaleString('vi-VN') : '—'}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Link to={`/admin/posts/${post.id}/edit`} className="btn btn-warning btn-sm me-2" title="Sửa">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm" title="Xóa vào thùng rác">
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

export default PostList;