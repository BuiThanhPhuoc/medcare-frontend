import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/api/health/posts/detail/${id}`);
                setPost(response.data.post);
            } catch (err) {
                console.error('Lỗi fetch bài viết:', err);
                setError('Không tìm thấy bài viết này');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="post-detail-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Đang tải bài viết...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="post-detail-container">
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{error || 'Không tìm thấy bài viết'}</p>
                    <Link to="/" className="btn-back">← Quay lại trang chủ</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="post-detail-wrapper">
            <div className="post-detail-container">
                {/* Header với back button */}
                <div className="post-header">
                    <button onClick={() => navigate(-1)} className="btn-back-icon">
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </button>
                </div>

                {/* Main Content */}
                <article className="post-detail-content">
                    {/* Thumbnail */}
                    {post.thumbnail && (
                        <div className="post-thumbnail">
                            <img src={post.thumbnail} alt={post.title} />
                        </div>
                    )}

                    {/* Title Section */}
                    <div className="post-meta-header">
                        {post.category_name && (
                            <span className="post-category">{post.category_name}</span>
                        )}
                        <h1 className="post-title">{post.title}</h1>
                        <div className="post-meta-info">
                            <span className="post-date">
                                <i className="fas fa-calendar-alt"></i>
                                {new Date(post.created_at).toLocaleDateString('vi-VN')}
                            </span>
                            <span className="post-status">
                                <i className="fas fa-check-circle"></i>
                                Đã xuất bản
                            </span>
                        </div>
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="post-excerpt">
                            <p>{post.excerpt}</p>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="post-body">
                        {post.content ? (
                            <div 
                                className="post-content-html"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <p className="no-content">Bài viết này chưa có nội dung</p>
                        )}
                    </div>

                    {/* Meta Tags */}
                    {post.meta_title && (
                        <div className="post-meta-tags">
                            <div className="meta-item">
                                <strong>Meta Title:</strong>
                                <p>{post.meta_title}</p>
                            </div>
                            {post.meta_description && (
                                <div className="meta-item">
                                    <strong>Meta Description:</strong>
                                    <p>{post.meta_description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </article>

                {/* Related Posts (tùy chọn) */}
                <div className="post-footer">
                    <Link to="/" className="btn-primary-outline">
                        ← Xem thêm bài viết
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
