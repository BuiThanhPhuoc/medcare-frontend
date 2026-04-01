import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';
import ImageWithFallback from '../../../components/ImageWithFallback';

const PostTrashed = () => {
    const [trashedPosts, setTrashedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTrashed = async () => {
        try {
            const res = await api.get('/api/admin/posts/trashed');
            setTrashedPosts(res.data.posts || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải thùng rác:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrashed(); }, []);

    const handleRestore = async (id) => {
        if (!window.confirm('Bạn muốn khôi phục bài viết này?')) return;
        try {
            await api.post(`/api/admin/posts/${id}/restore`, {});
            alert("Khôi phục thành công!");
            fetchTrashed();
        } catch { alert("Lỗi khi khôi phục!"); }
    };

    const handleForceDelete = async (id) => {
        if (!window.confirm('XÓA VĨNH VIỄN bài viết này? Không thể hoàn tác!')) return;
        try {
            await api.delete(`/api/admin/posts/${id}/force`);
            alert("Đã xóa vĩnh viễn!");
            fetchTrashed();
        } catch { alert("Lỗi khi xóa!"); }
    };

    const filteredTrashed = trashedPosts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-trash-restore me-2 text-warning"></i> Thùng rác Bài viết
                </h1>
                <Link to="/admin/posts" className="btn btn-primary">
                    <i className="fas fa-arrow-left me-2"></i> Trở về Danh sách
                </Link>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="p-3 border-bottom bg-light">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Tìm bài viết trong thùng rác..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
                    ) : filteredTrashed.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light" style={{textTransform: 'uppercase', fontSize: '13px', fontWeight: 600}}>
                                    <tr>
                                        <th className="p-3 text-center" width="5%">ID</th>
                                        <th className="p-3" width="40%">Tiêu đề</th>
                                        <th className="p-3">Danh mục</th>
                                        <th className="p-3 text-center">Đã xóa lúc</th>
                                        <th className="p-3 text-center" width="20%">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTrashed.map((post) => (
                                        <tr key={post.id}>
                                            <td className="p-3 text-center">{post.id}</td>
                                            <td className="p-3">
                                                <strong className="text-dark">{post.title}</strong>
                                                {post.thumbnail && (
                                                    <div>
                                                        <ImageWithFallback
                                                            src={post.thumbnail}
                                                            alt="thumbnail"
                                                            fallback="https://via.placeholder.com/200x40?text=No+Image"
                                                            width="auto"
                                                            height="40px"
                                                            className="rounded"
                                                            style={{ marginTop: '5px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                <span className="badge bg-secondary px-2 py-1">{post.category_name || 'Không có'}</span>
                                            </td>
                                            <td className="p-3 text-center text-muted small">
                                                {new Date(post.deleted_at).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => handleRestore(post.id)} className="btn btn-sm btn-success me-2" title="Khôi phục">
                                                    <i className="fas fa-undo"></i> Khôi phục
                                                </button>
                                                <button onClick={() => handleForceDelete(post.id)} className="btn btn-sm btn-danger" title="Xóa vĩnh viễn">
                                                    <i className="fas fa-times"></i> Xóa luôn
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-trash-alt fs-1 text-muted opacity-50"></i>
                            <p className="text-muted mt-3">Thùng rác trống hoặc không tìm thấy bài viết.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostTrashed;