import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/api/admin/posts');
            setPosts(res.data.posts || []);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi tải bài viết:", error);
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa bài viết này vào thùng rác?')) return;
        try {
            await api.delete(`/api/admin/posts/${id}`);
            alert("Đã chuyển vào thùng rác!");
            fetchPosts(); 
        } catch {
            alert("Lỗi khi xóa bài viết!");
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-newspaper me-2"></i> Danh sách Bài viết
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

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle mb-0">
                                <thead className="table-light" style={{textTransform: 'uppercase', fontSize: '13px', fontWeight: 600}}>
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Tiêu đề</th>
                                        <th className="p-3">Danh mục</th>
                                        <th className="p-3">Trạng thái</th>
                                        <th className="p-3">Ngày xuất bản</th>
                                        <th className="p-3" width="15%">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-4">Chưa có bài viết nào.</td></tr>
                                    ) : posts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="p-3">{post.id}</td>
                                            <td className="p-3 fw-bold">{post.title}</td>
                                            <td className="p-3">
                                                <span className="badge bg-info text-dark px-3 py-2">
                                                    {post.category_name || 'Không có'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {post.status === 'published' ? (
                                                    <span className="badge bg-success px-3 py-2">Đã xuất bản</span>
                                                ) : (
                                                    <span className="badge bg-secondary px-3 py-2">Nháp</span>
                                                )}
                                            </td>
                                            <td className="p-3">
                                                {post.published_at ? new Date(post.published_at).toLocaleString('vi-VN') : '—'}
                                            </td>
                                            <td className="p-3">
                                                <Link to={`/admin/posts/${post.id}/edit`} className="btn btn-warning btn-sm me-1 mb-1" title="Sửa">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm mb-1" title="Xóa">
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