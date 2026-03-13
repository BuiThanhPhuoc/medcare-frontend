import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../../lib/api';

const SpecialtyForm = () => {
    const { id } = useParams(); // Nếu có id -> Edit Mode
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(isEditMode);
    const [doctorsList, setDoctorsList] = useState([]); // List bác sĩ để chọn

    const [formData, setFormData] = useState({
        ten: '',
        slug: '',
        mo_ta: '',
        bac_si_ids: [] // Mảng ID bác sĩ được gán
    });

    useEffect(() => {
        // Fetch danh sách toàn bộ Bác sĩ để đổ vào Select
        const fetchDoctors = async () => {
            try {
                const res = await api.get('/api/admin/doctors');
                setDoctorsList(res.data.doctors || []);
            } catch (error) { console.error("Lỗi tải DS bác sĩ", error); }
        };

        // Fetch chi tiết Chuyên khoa nếu đang ở chế độ Edit
        const fetchSpecialty = async () => {
            try {
                const res = await api.get(`/api/admin/specialties/${id}`);
                const data = res.data.specialty;
                setFormData({
                    ten: data.ten || '',
                    slug: data.slug || '',
                    mo_ta: data.mo_ta || '',
                    bac_si_ids: data.bac_sis ? data.bac_sis.map(bs => bs.id) : [] // Lấy mảng ID bác sĩ cũ
                });
                setLoading(false);
            } catch {
                alert("Không tìm thấy chuyên khoa!");
                navigate('/admin/specialties');
            }
        };

        fetchDoctors();
        if (isEditMode) fetchSpecialty();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý khi chọn nhiều Bác sĩ (Multiple Select)
    const handleDoctorSelectChange = (e) => {
        const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, bac_si_ids: selectedValues });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {};
            
            if (isEditMode) {
                await api.put(`/api/admin/specialties/${id}`, formData, config);
                alert('Cập nhật chuyên khoa thành công!');
            } else {
                await api.post('/api/admin/specialties', formData, config);
                alert('Thêm chuyên khoa thành công!');
            }
            navigate('/admin/specialties');
        } catch (error) {
            alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0 text-dark">
                    <i className="fas fa-stethoscope text-primary me-2"></i>
                    {isEditMode ? 'Sửa chuyên khoa' : 'Thêm chuyên khoa'}
                </h2>
                <Link to="/admin/specialties" className="btn btn-secondary btn-sm px-3 py-2">
                    <i className="fas fa-arrow-left me-1"></i> Quay lại
                </Link>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            {/* Tên chuyên khoa */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Tên chuyên khoa <span className="text-danger">*</span></label>
                                <input type="text" name="ten" className="form-control form-control-lg rounded-3" 
                                    value={formData.ten} onChange={handleChange} required />
                            </div>

                            {/* Slug */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold fs-6">Slug (URL)</label>
                                <input type="text" name="slug" className="form-control form-control-lg rounded-3" 
                                    value={formData.slug} onChange={handleChange} placeholder="vd: tim-mach" />
                                <small className="text-muted mt-1 d-block">Để trống hệ thống sẽ tự tạo từ tên chuyên khoa</small>
                            </div>

                            {/* Mô tả */}
                            <div className="col-12">
                                <label className="form-label fw-bold fs-6">Mô tả chi tiết</label>
                                <textarea name="mo_ta" rows="3" className="form-control form-control-lg rounded-3" 
                                    style={{resize: 'none'}} value={formData.mo_ta} onChange={handleChange}></textarea>
                            </div>

                            {/* Gán Bác Sĩ (Mô phỏng Select2 Multiple) */}
                            <div className="col-12">
                                <label className="form-label fw-bold fs-6">Gán bác sĩ vào chuyên khoa</label>
                                <select 
                                    name="bac_si_ids" 
                                    multiple 
                                    size="6" 
                                    className="form-select form-select-lg rounded-3" 
                                    value={formData.bac_si_ids} 
                                    onChange={handleDoctorSelectChange}
                                >
                                    {doctorsList.map((doc) => (
                                        <option key={doc.id} value={doc.id} className="p-2 border-bottom">
                                            BS. {doc.ho_ten} {doc.email ? `(${doc.email})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <small className="text-muted mt-2 d-block">
                                    <i className="fas fa-info-circle me-1"></i> Giữ nút <b>Ctrl</b> (Windows) hoặc <b>Cmd</b> (Mac) để chọn nhiều bác sĩ cùng lúc.
                                </small>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                            <Link to="/admin/specialties" className="btn btn-light me-2 px-4 py-2">
                                <i className="fas fa-times me-1"></i> Hủy
                            </Link>
                            <button type="submit" className="btn btn-primary px-4 py-2">
                                <i className="fas fa-save me-1"></i> Lưu Chuyên Khoa
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SpecialtyForm;