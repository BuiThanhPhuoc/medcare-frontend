import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
// Nhúng Component Chi tiết vừa tạo vào
import DoctorScheduleDetail from './DoctorScheduleDetail'; 

const DoctorSchedule = () => {
    const [pendingSchedules, setPendingSchedules] = useState([]);
    const [selectedDoctorName, setSelectedDoctorName] = useState(null);
    const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);

    const fetchPendingSchedules = async () => {
        try {
            const res = await api.get('/api/admin/schedules/pending');
            setPendingSchedules(res.data.schedules || []);
            setSelectedScheduleIds([]); 
        } catch (error) { console.error("Lỗi tải lịch", error); }
    };

    useEffect(() => { fetchPendingSchedules(); }, []);

    const groupedSchedules = pendingSchedules.reduce((acc, schedule) => {
        const docName = schedule.doctor_name;
        if (!acc[docName]) acc[docName] = [];
        acc[docName].push(schedule);
        return acc;
    }, {});

    useEffect(() => {
        if (selectedDoctorName && !groupedSchedules[selectedDoctorName]) {
            setSelectedDoctorName(null);
        }
    }, [pendingSchedules, selectedDoctorName, groupedSchedules]);

    // Hành động gửi API chung
    const handleBulkAction = async (status) => {
        if (selectedScheduleIds.length === 0) return alert("Vui lòng chọn ít nhất 1 ca làm việc!");

        const actionName = status === 'approved' ? 'DUYỆT' : 'TỪ CHỐI';
        if (!window.confirm(`Bạn có chắc muốn ${actionName} ${selectedScheduleIds.length} ca khám đã chọn?`)) return;
        
        try {
            await api.put('/api/admin/schedules/bulk-update', { ids: selectedScheduleIds, status });
            alert(`Đã ${actionName} thành công!`);
            fetchPendingSchedules();
        } catch (error) { alert("Có lỗi xảy ra!"); }
    };

    // ==========================================
    // RENDER: ĐIỀU HƯỚNG MÀN HÌNH
    // ==========================================
    
    // NẾU ĐANG CHỌN BÁC SĨ -> HIỂN THỊ COMPONENT CHI TIẾT
    if (selectedDoctorName && groupedSchedules[selectedDoctorName]) {
        return (
            <DoctorScheduleDetail 
                doctorName={selectedDoctorName}
                schedules={groupedSchedules[selectedDoctorName]}
                selectedScheduleIds={selectedScheduleIds}
                setSelectedScheduleIds={setSelectedScheduleIds}
                onBack={() => setSelectedDoctorName(null)}
                onAction={handleBulkAction}
            />
        );
    }

    // NẾU KHÔNG CHỌN AI -> HIỂN THỊ DANH SÁCH BẢNG
    const doctorNames = Object.keys(groupedSchedules);

    const handleSelectDoctor = (docName, isChecked) => {
        const docScheduleIds = groupedSchedules[docName].map(s => s.id);
        if (isChecked) setSelectedScheduleIds(prev => [...new Set([...prev, ...docScheduleIds])]);
        else setSelectedScheduleIds(prev => prev.filter(id => !docScheduleIds.includes(id)));
    };

    const isDoctorFullySelected = (docName) => {
        if (!groupedSchedules[docName]) return false;
        return groupedSchedules[docName].every(s => selectedScheduleIds.includes(s.id));
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">
                    <i className="fas fa-clipboard-list text-primary me-2"></i> Danh sách chờ duyệt
                </h2>
                <span className="badge bg-danger fs-6 px-3 py-2">Tổng: {pendingSchedules.length} ca</span>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-secondary fw-bold">Danh sách Bác sĩ</h5>
                    {selectedScheduleIds.length > 0 && (
                        <div>
                            <span className="text-muted me-3">Đã chọn: <b>{selectedScheduleIds.length}</b> ca</span>
                            <button onClick={() => handleBulkAction('rejected')} className="btn btn-outline-danger btn-sm me-2">
                                <i className="fas fa-times me-1"></i> Từ chối Nhanh
                            </button>
                            <button onClick={() => handleBulkAction('approved')} className="btn btn-success btn-sm">
                                <i className="fas fa-check me-1"></i> Duyệt Nhanh
                            </button>
                        </div>
                    )}
                </div>

                <div className="card-body p-0">
                    {doctorNames.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-check-double fs-1 text-success mb-3 d-block opacity-50"></i>
                            <h5 className="text-secondary fw-bold">Hiện không có lịch nào cần duyệt.</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th width="5%" className="text-center py-3">
                                            <input 
                                                type="checkbox" className="form-check-input" 
                                                checked={pendingSchedules.length > 0 && pendingSchedules.every(s => selectedScheduleIds.includes(s.id))}
                                                onChange={(e) => setSelectedScheduleIds(e.target.checked ? pendingSchedules.map(s => s.id) : [])}
                                            />
                                        </th>
                                        <th width="5%" className="text-center py-3">STT</th>
                                        <th width="40%" className="py-3">Họ tên Bác sĩ</th>
                                        <th width="20%" className="text-center py-3">Số lượng ca</th>
                                        <th width="15%" className="text-center py-3">Chi tiết</th>
                                        <th width="15%" className="text-center py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctorNames.map((docName, index) => {
                                        const count = groupedSchedules[docName].length;
                                        const isChecked = isDoctorFullySelected(docName);
                                        return (
                                            <tr key={index} className={isChecked ? "bg-primary bg-opacity-10" : ""}>
                                                <td className="text-center">
                                                    <input 
                                                        type="checkbox" className="form-check-input" 
                                                        checked={isChecked}
                                                        onChange={(e) => handleSelectDoctor(docName, e.target.checked)}
                                                    />
                                                </td>
                                                <td className="text-center fw-bold text-muted">{index + 1}</td>
                                                <td><strong className="text-dark fs-6">BS. {docName}</strong></td>
                                                <td className="text-center"><span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill">{count} ca chờ duyệt</span></td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-outline-info rounded-pill px-3" onClick={() => setSelectedDoctorName(docName)}>
                                                        Xem chi tiết <i className="fas fa-arrow-right ms-1"></i>
                                                    </button>
                                                </td>
                                                <td></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;