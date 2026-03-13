import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

const PostTrashed = () => {
    const [trashedPosts, setTrashedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
        if (!window.confirm('Khôi phục bài viết này?')) return;
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

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-trash-restore me-2 text-warning"></i> Thùng rác Bài viết
                </h1>
                <Link to="/admin/posts" className="btn btn-primary">
                    <i className="fas fa-arrow-left"></i> Danh sách bài viết
                </Link>
            </div>

            <div className="card shadow-lg border-0">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
                    ) : trashedPosts.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Tiêu đề</th>
                                        <th className="p-3">Danh mục</th>
                                        <th className="p-3">Đã xóa lúc</th>
                                        <th className="p-3" width="200">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trashedPosts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="p-3">{post.id}</td>
                                            <td className="p-3">
                                                <strong>{post.title}</strong>
                                                {post.thumbnail && <div><img src={post.thumbnail} alt="" style={{height: '40px', borderRadius: '4px', marginTop:'5px'}} /></div>}
                                            </td>
                                            <td className="p-3"><span className="badge bg-secondary">{post.category_name || '--'}</span></td>
                                            <td className="p-3 text-muted small">{new Date(post.deleted_at).toLocaleString('vi-VN')}</td>
                                            <td className="p-3">
                                                <button onClick={() => handleRestore(post.id)} className="btn btn-sm btn-success me-2">
                                                    <i className="fas fa-undo"></i> Khôi phục
                                                </button>
                                                <button onClick={() => handleForceDelete(post.id)} className="btn btn-sm btn-danger">
                                                    <i className="fas fa-trash"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-trash-alt fs-1 text-muted"></i>
                            <p className="text-muted mt-3">Thùng rác trống</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostTrashed;