import React from 'react';

const DoctorScheduleDetail = ({ 
    doctorName, 
    schedules, 
    selectedScheduleIds, 
    setSelectedScheduleIds, 
    onBack, 
    onAction 
}) => {

    // Logic tick chọn 1 ca lẻ tẻ
    const handleSelectSingleSchedule = (scheduleId, isChecked) => {
        if (isChecked) {
            setSelectedScheduleIds(prev => [...prev, scheduleId]);
        } else {
            setSelectedScheduleIds(prev => prev.filter(id => id !== scheduleId));
        }
    };

    // Logic kiểm tra xem đã tick "Chọn tất cả" ca của bác sĩ này chưa
    const isAllSelected = () => {
        const docScheduleIds = schedules.map(s => s.id);
        if (docScheduleIds.length === 0) return false;
        return docScheduleIds.every(id => selectedScheduleIds.includes(id));
    };

    // Logic khi bấm "Chọn tất cả"
    const handleSelectAll = (isChecked) => {
        const docScheduleIds = schedules.map(s => s.id);
        if (isChecked) {
            setSelectedScheduleIds(prev => [...new Set([...prev, ...docScheduleIds])]);
        } else {
            setSelectedScheduleIds(prev => prev.filter(id => !docScheduleIds.includes(id)));
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center mb-4">
                <button onClick={onBack} className="btn btn-outline-secondary me-3 shadow-sm">
                    <i className="fas fa-arrow-left"></i> Quay lại
                </button>
                <h2 className="fw-bold mb-0">Chi tiết lịch chờ duyệt</h2>
            </div>

            <div className="card shadow-sm border-0 border-top border-primary border-4">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                            <i className="fas fa-user-md fs-4"></i>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-dark">BS. {doctorName}</h4>
                            <span className="badge bg-warning text-dark mt-1 fs-6">{schedules.length} ca đang chờ duyệt</span>
                        </div>
                    </div>
                    {selectedScheduleIds.length > 0 && (
                        <div>
                            <span className="text-muted me-3">Đã chọn: <b>{selectedScheduleIds.length}</b> ca</span>
                            <button onClick={() => onAction('rejected')} className="btn btn-outline-danger me-2 shadow-sm">
                                <i className="fas fa-times me-1"></i> Từ chối
                            </button>
                            <button onClick={() => onAction('approved')} className="btn btn-primary shadow-sm">
                                <i className="fas fa-check-circle me-1"></i> Phê duyệt
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="card-body bg-light p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-muted mb-0">Danh sách các ca đăng ký:</h6>
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="selectAllSchedules"
                                checked={isAllSelected()}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label fw-bold cursor-pointer" htmlFor="selectAllSchedules">
                                Chọn tất cả
                            </label>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                        {schedules.map(sch => {
                            const isChecked = selectedScheduleIds.includes(sch.id);
                            return (
                                <div 
                                    key={sch.id} 
                                    className={`border rounded px-3 py-2 d-flex align-items-center shadow-sm ${isChecked ? 'bg-primary bg-opacity-10 border-primary' : 'bg-white'}`} 
                                    style={{ minWidth: '220px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => handleSelectSingleSchedule(sch.id, !isChecked)}
                                >
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input me-3 mt-0" 
                                        checked={isChecked}
                                        onChange={(e) => handleSelectSingleSchedule(sch.id, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()} 
                                    />
                                    <div>
                                        <div className="fw-bold text-dark">{new Date(sch.work_date).toLocaleDateString('vi-VN')}</div>
                                        <span className={`badge mt-1 ${sch.shift === 'morning' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                                            {sch.shift === 'morning' ? 'Sáng (08:00 - 12:00)' : 'Chiều (13:00 - 17:00)'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorScheduleDetail;