import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../lib/api';

const PostCreate = () => {
    const navigate = useNavigate();
    // Giả lập Categories và Tags (Sẽ fetch từ API thực tế)
    const categories = [{ id: 1, name: 'Tin tức Y Tế' }, { id: 2, name: 'Sức khỏe' }];
    const tagsList = [{ id: 1, name: 'Covid-19' }, { id: 2, name: 'Dinh dưỡng' }];
    
    const [formData, setFormData] = useState({
        title: '', danh_muc_id: '', status: 'draft', excerpt: '', 
        content: '', published_at: '', thumbnail: '', meta_title: '', meta_description: '', tags: []
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle chọn nhiều Tag
    const handleTagsChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, tags: values });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/posts', formData);
            alert('Thêm bài viết thành công!');
            navigate('/admin/posts');
        } catch {
            alert('Có lỗi xảy ra!');
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold fs-3">
                    <i className="fas fa-pen-to-square me-2"></i> Thêm Bài viết
                </h1>
                <Link to="/admin/posts" className="btn btn-secondary">
                    <i className="fas fa-arrow-left"></i> Quay lại
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
                                {/* Dùng textarea mặc định, nếu cần CKEditor có thể cài thư viện @ckeditor/ckeditor5-react sau */}
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

                            <div className="col-md-12">
                                <label className="form-label fw-bold fs-6">Thẻ (giữ Ctrl để chọn nhiều)</label>
                                <select name="tags" multiple size="4" className="form-select form-select-lg rounded-3" value={formData.tags} onChange={handleTagsChange}>
                                    {tagsList.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                            <Link to="/admin/posts" className="btn btn-light me-2"><i className="fas fa-times"></i> Hủy</Link>
                            <button type="submit" className="btn btn-primary px-4"><i className="fas fa-save"></i> Lưu Bài Viết</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostCreate;