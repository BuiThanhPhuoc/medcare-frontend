import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../../lib/api';

/**
 * ReceptionistSchedule Component
 * 🎯 CHỨC NĂNG: Quản lý lịch làm việc của Lễ tân
 * 
 * Admin sử dụng component này để:
 * - Xem lịch hiện tại của 1 lễ tân
 * - Gán/cập nhật lịch làm việc hàng tuần (ca sáng/chiều)
 * 
 * ⚠️ KHÁC BIỆT: Đây KHÔNG phải trang CRUD lễ tân
 *    - Không thêm/sửa/xóa lễ tân
 *    - Chỉ quản lý lịch làm việc
 *    - Để quản lý thông tin lễ tân, xem /admin/receptionists
 * 
 * Giao diện:
 * - Calendar chọn ngày bắt đầu tuần
 * - Checkbox for morning/afternoon shifts for each day
 * - Hiển thị lịch hiện tại
 */
const ReceptionistSchedule = () => {
    const { receptionistId } = useParams();
    const navigate = useNavigate();
    const [receptionist, setReceptionist] = useState(null);
    const [currentSchedules, setCurrentSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for week picker
    const [startDate, setStartDate] = useState('');
    const [newSchedules, setNewSchedules] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Fetch receptionist info & current schedule
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thông tin lễ tân từ API
                const listRes = await api.get('/api/admin/receptionists');
                const found = listRes.data.receptionists.find(r => r.receptionist_id == receptionistId);
                setReceptionist(found || {});

                // Lấy lịch hiện tại - sử dụng receptionist_id
                const receptionist_id = parseInt(receptionistId);
                const schedRes = await api.get(`/api/admin/receptionists/${receptionist_id}/schedule`);
                setCurrentSchedules(schedRes.data.schedules || []);

                setLoading(false);
            } catch (error) {
                console.error('Lỗi tải dữ liệu:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [receptionistId]);

    // Helper: Tính toán tuần từ startDate
    const generateWeekSchedule = () => {
        if (!startDate) return;

        const start = new Date(startDate);
        const schedules = {};

        // Tạo 7 ngày (thứ 2 - CN)
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            schedules[dateStr] = {
                morning: false,
                afternoon: false
            };
        }

        setNewSchedules(schedules);
    };

    // Handle checkbox change
    const handleShiftChange = (date, shift) => {
        setNewSchedules(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [shift]: !prev[date][shift]
            }
        }));
    };

    // Handle select all shifts for the week
    const handleSelectAllShifts = () => {
        const allSelected = Object.entries(newSchedules).every(
            ([, shifts]) => shifts.morning && shifts.afternoon
        );

        if (allSelected) {
            // Deselect all
            setNewSchedules(prev => 
                Object.entries(prev).reduce((acc, [date, shifts]) => ({
                    ...acc,
                    [date]: { morning: false, afternoon: false }
                }), {})
            );
        } else {
            // Select all
            setNewSchedules(prev =>
                Object.entries(prev).reduce((acc, [date, shifts]) => ({
                    ...acc,
                    [date]: { morning: true, afternoon: true }
                }), {})
            );
        }
    };

    // Gửi API lưu lịch
    const handleSaveSchedule = async () => {
        if (Object.keys(newSchedules).length === 0) {
            alert('Vui lòng chọn ngày!');
            return;
        }

        // Chuẩn bị dữ liệu
        const schedules = [];
        Object.entries(newSchedules).forEach(([date, shifts]) => {
            if (shifts.morning) {
                schedules.push({ work_date: date, shift: 'morning' });
            }
            if (shifts.afternoon) {
                schedules.push({ work_date: date, shift: 'afternoon' });
            }
        });

        if (schedules.length === 0) {
            alert('Vui lòng chọn ít nhất 1 ca làm việc!');
            return;
        }

        setIsSaving(true);
        try {
            await api.post(`/api/admin/receptionists/${receptionistId}/schedule`, { schedules });
            alert('Cập nhật lịch thành công!');
            navigate('/admin/receptionists');
        } catch (error) {
            console.error('Lỗi save:', error);
            alert('Lỗi cập nhật lịch: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-calendar-alt text-primary me-2"></i> Gán Lịch Làm Việc
                </h2>
                <Link to="/admin/receptionists" className="btn btn-secondary btn-sm">
                    <i className="fas fa-arrow-left"></i> Quay lại
                </Link>
            </div>

            {/* Info Card */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                        <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                            <i className="fas fa-user"></i>
                        </div>
                        <div>
                            <h4 className="mb-1 fw-bold">{receptionist?.full_name || 'Lễ Tân'}</h4>
                            <p className="text-muted mb-0">
                                Email: {receptionist?.email || 'N/A'} | Phone: {receptionist?.phone || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Card */}
            <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Chọn Tuần &amp; Gán Ca Làm Việc</h5>
                </div>

                <div className="card-body p-4">
                    {/* Start Date Picker */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Chọn ngày bắt đầu (Thứ 2 của tuần)</label>
                        <div className="row g-2">
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control form-control-lg"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={generateWeekSchedule}
                                    disabled={!startDate}
                                >
                                    <i className="fas fa-sync-alt me-2"></i> Tạo Tuần
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Grid */}
                    {Object.keys(newSchedules).length > 0 && (
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold text-muted mb-0">Chọn Ca Làm Việc</h6>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="selectAllShifts"
                                        checked={Object.entries(newSchedules).every(
                                            ([, shifts]) => shifts.morning && shifts.afternoon
                                        )}
                                        onChange={handleSelectAllShifts}
                                    />
                                    <label className="form-check-label fw-bold text-primary" htmlFor="selectAllShifts">
                                        Chọn tất cả ca làm
                                    </label>
                                </div>
                            </div>
                            <div className="row g-3">
                                {Object.entries(newSchedules).map(([date, shifts]) => {
                                    const dayObj = new Date(date);
                                    const dayName = dayObj.toLocaleDateString('vi-VN', { weekday: 'short' });
                                    const dayDisplay = dayObj.toLocaleDateString('vi-VN');

                                    return (
                                        <div className="col-md-4" key={date}>
                                            <div className="card border shadow-sm h-100">
                                                <div className="card-header bg-light py-2 border-0">
                                                    <h6 className="mb-0 fw-bold text-dark">
                                                        {dayName.toUpperCase()} - {dayDisplay}
                                                    </h6>
                                                </div>
                                                <div className="card-body p-3">
                                                    <div className="form-check mb-2">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`morning-${date}`}
                                                            checked={shifts.morning}
                                                            onChange={() => handleShiftChange(date, 'morning')}
                                                        />
                                                        <label className="form-check-label" htmlFor={`morning-${date}`}>
                                                            <i className="fas fa-sun text-warning me-2"></i> Ca Sáng (08:00 - 12:00)
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`afternoon-${date}`}
                                                            checked={shifts.afternoon}
                                                            onChange={() => handleShiftChange(date, 'afternoon')}
                                                        />
                                                        <label className="form-check-label" htmlFor={`afternoon-${date}`}>
                                                            <i className="fas fa-cloud-sun text-info me-2"></i> Ca Chiều (13:00 - 17:00)
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Current Schedule Display */}
                    {currentSchedules.length > 0 && (
                        <div className="mb-4">
                            <div className="alert alert-info border-0">
                                <h6 className="fw-bold mb-2">
                                    <i className="fas fa-info-circle me-2"></i> Lịch Hiện Tại ({currentSchedules.length} ca)
                                </h6>
                                <div className="row g-2">
                                    {currentSchedules.map(sch => (
                                        <div className="col-auto" key={sch.id}>
                                            <span className="badge bg-secondary me-1">
                                                {new Date(sch.work_date).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className={`badge ${sch.shift === 'morning' ? 'bg-warning text-dark' : 'bg-info'}`}>
                                                {sch.shift === 'morning' ? 'Sáng' : 'Chiều'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="d-flex justify-content-between gap-2">
                        <Link to="/admin/receptionists" className="btn btn-secondary px-4">
                            <i className="fas fa-times me-2"></i> Hủy
                        </Link>
                        <button
                            className="btn btn-success px-4"
                            onClick={handleSaveSchedule}
                            disabled={isSaving || Object.keys(newSchedules).length === 0}
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save me-2"></i> Lưu Lịch
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistSchedule;
