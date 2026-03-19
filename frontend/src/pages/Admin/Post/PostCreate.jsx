import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const PostCreate = () => {
    const navigate = useNavigate();
    
    // Đổi sang state rỗng để hứng dữ liệu thật từ DB
    const [categories, setCategories] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '', danh_muc_id: '', status: 'draft', excerpt: '', 
        content: '', published_at: '', thumbnail: '', meta_title: '', meta_description: '', tags: []
    });

    // Gọi API lấy Danh mục và Thẻ khi vừa vào trang
    useEffect(() => {
        const fetchCategoriesAndTags = async () => {
            try {
                // Giả định bạn có 2 API này ở Backend (nếu chưa có thì tí nữa ta tạo nhé)
                const [catRes, tagRes] = await Promise.all([
                    api.get('/api/admin/categories'),
                    api.get('/api/admin/tags')
                ]);
                setCategories(catRes.data.categories || []);
                setTagsList(tagRes.data.tags || []);
            } catch (error) {
                console.error("Lỗi tải danh mục hoặc thẻ:", error);
            }
        };
        fetchCategoriesAndTags();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle chọn nhiều Tag bằng Ctrl / Cmd
    const handleTagsChange = (e) => {
        // Lấy tất cả các value của những option đang được bôi xanh
        const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, tags: values });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/posts', formData);
            alert('Thêm bài viết thành công!');
            navigate('/admin/posts');
        } catch {
            alert('Có lỗi xảy ra khi lưu bài viết!');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-pen-to-square me-2 text-primary"></i> Thêm Bài viết
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
                            <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save me-1"></i> Lưu Bài Viết</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostCreate;