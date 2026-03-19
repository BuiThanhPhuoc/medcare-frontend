import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';

const PostEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    // State lưu data thật từ DB
    const [categories, setCategories] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '', danh_muc_id: '', status: 'draft', excerpt: '', 
        content: '', published_at: '', thumbnail: '', meta_title: '', meta_description: '', tags: []
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // Tải đồng thời cả 3 API cùng lúc cho nhanh
                const [postRes, catRes, tagRes] = await Promise.all([
                    api.get(`/api/admin/posts/${id}`),
                    api.get('/api/admin/categories'),
                    api.get('/api/admin/tags')
                ]);

                setCategories(catRes.data.categories || []);
                setTagsList(tagRes.data.tags || []);

                const post = postRes.data.post;
                
                let pubDate = '';
                if(post.published_at) {
                    const d = new Date(post.published_at);
                    pubDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                }

                setFormData({
                    title: post.title || '', 
                    danh_muc_id: post.danh_muc_id || '', 
                    status: post.status || 'draft',
                    excerpt: post.excerpt || '', 
                    content: post.content || '', 
                    published_at: pubDate,
                    thumbnail: post.thumbnail || '', 
                    meta_title: post.meta_title || '', 
                    meta_description: post.meta_description || '', 
                    tags: post.tags || [] // Dữ liệu thẻ mà bài viết này đang sở hữu
                });
                setLoading(false);
            } catch (error) {
                alert("Không tìm thấy dữ liệu hoặc có lỗi!");
                navigate('/admin/posts');
            }
        };
        fetchPostData();
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleTagsChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, tags: values });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/admin/posts/${id}`, formData);
            alert('Cập nhật thành công!');
            navigate('/admin/posts');
        } catch { alert('Lỗi cập nhật!'); }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-edit me-2 text-warning"></i> Sửa Bài viết
                </h1>
                <Link to="/admin/posts" className="btn btn-secondary">
                    <i className="fas fa-arrow-left me-1"></i> Quay lại
                </Link>
            </div>

            <div className="card shadow-lg border-0" style={{borderRadius: '12px'}}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-12">
                                <label className="form-label fw-bold fs-6">Tiêu đề <span className="text-danger">*</span></label>
                                <input type="text" name="title" className="form-control form-control-lg rounded-3" value={formData.title} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Danh mục</label>
                                <select name="danh_muc_id" className="form-select form-select-lg rounded-3" value={formData.danh_muc_id} onChange={handleChange}>
                                    <option value="">-- Không --</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Trạng thái</label>
                                <select name="status" className="form-select form-select-lg rounded-3" value={formData.status} onChange={handleChange}>
                                    <option value="draft">Nháp</option>
                                    <option value="published">Xuất bản</option>
                                </select>
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold fs-6">Tóm tắt</label>
                                <input type="text" name="excerpt" className="form-control form-control-lg rounded-3" value={formData.excerpt} onChange={handleChange} />
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold fs-6">Nội dung <span className="text-danger">*</span></label>
                                <textarea name="content" className="form-control form-control-lg rounded-3" rows="10" value={formData.content} onChange={handleChange} required style={{resize: 'vertical'}}></textarea>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Ngày xuất bản</label>
                                <input type="datetime-local" name="published_at" className="form-control form-control-lg rounded-3" value={formData.published_at} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Thumbnail (URL)</label>
                                <input type="text" name="thumbnail" className="form-control form-control-lg rounded-3" value={formData.thumbnail} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Meta title</label>
                                <input type="text" name="meta_title" className="form-control form-control-lg rounded-3" value={formData.meta_title} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Meta description</label>
                                <textarea name="meta_description" rows="3" className="form-control form-control-lg rounded-3" value={formData.meta_description} onChange={handleChange} style={{resize: 'none'}}></textarea>
                            </div>

                            {/* CHỌN NHIỀU THẺ BẰNG CTRL */}
                            <div className="col-md-12">
                                <label className="form-label fw-bold fs-6">Thẻ (Giữ nút <b>Ctrl</b> hoặc <b>Cmd</b> để chọn nhiều thẻ)</label>
                                <select 
                                    name="tags" 
                                    multiple 
                                    size="5" 
                                    className="form-select form-select-lg rounded-3" 
                                    value={formData.tags} 
                                    onChange={handleTagsChange}
                                >
                                    {tagsList.map(t => <option key={t.id} value={t.id} className="p-2 border-bottom">{t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                            <Link to="/admin/posts" className="btn btn-light me-2 px-4"><i className="fas fa-times me-1"></i> Hủy</Link>
                            <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save me-1"></i> Cập Nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostEdit;