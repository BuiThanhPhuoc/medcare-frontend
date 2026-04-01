/**
 * Admin Appointment Calendar View
 * Hiển thị lịch khám dạng calendar grid với chức năng phê duyệt
 */

import { useState, useEffect, useRef } from 'react';
import api from '../../../lib/api';
import { toast } from 'react-toastify';
import './AdminAppointmentCalendar.css';

const AdminAppointmentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [exporting, setExporting] = useState(false);
    const audioRef = useRef(null);

    // Play notification sound
    const playNotificationSound = () => {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800; // Frequency in Hz
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Sound notification skipped (audio context unavailable)');
        }
    };

    // Load doctors for filter
    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const res = await api.get('/api/admin/doctors?page=1&limit=100');
                const doctorList = res.data.data || res.data.doctors || [];
                setDoctors(doctorList);
            } catch (error) {
                console.error('Lỗi tải danh sách bác sĩ:', error);
            }
        };
        loadDoctors();
    }, []);

    // Load appointments for current month
    useEffect(() => {
        const loadAppointments = async () => {
            try {
                setLoading(true);
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const dateFrom = `${year}-${month}-01`;
                
                // Get last day of month
                const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
                const dateTo = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

                const params = new URLSearchParams({
                    page: 1,
                    limit: 1000,
                    dateFrom,
                    dateTo
                });

                if (filterStatus) params.append('status', filterStatus);
                if (filterDoctor) params.append('doctorId', filterDoctor);

                const res = await api.get(`/api/admin/appointments?${params}`);
                const appts = res.data.data || res.data.appointments || [];
                setAppointments(appts);
                setSelectedIds(new Set()); // Clear selection on reload
            } catch (error) {
                console.error('Lỗi tải lịch khám:', error);
                toast.error('❌ Lỗi tải lịch khám');
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, [currentDate, filterStatus, filterDoctor]);

    // Get appointments for specific date
    const getAppointmentsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return appointments.filter(appt => appt.appointment_date === dateStr);
    };

    // Handle status change
    const handleStatusChange = async (appointmentId, newStatus) => {
        try {
            await api.put(`/api/admin/appointments/${appointmentId}/status`, { status: newStatus });
            toast.success(`✅ Cập nhật trạng thái thành công!`);
            playNotificationSound();
            
            // Update local state
            setAppointments(prevState =>
                prevState.map(appt =>
                    appt.id === appointmentId ? { ...appt, status: newStatus } : appt
                )
            );
            
            if (selectedAppointment?.id === appointmentId) {
                setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            toast.error('❌ Lỗi cập nhật trạng thái');
            console.error(error);
        }
    };

    // Export appointments to Excel
    const handleExportExcel = async () => {
        try {
            setExporting(true);
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            
            const res = await api.get('/api/export/appointments/excel', {
                params: {
                    year,
                    month,
                    status: filterStatus || undefined,
                    doctorId: filterDoctor || undefined
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Lich_khám_${year}-${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('✅ Export Excel thành công!');
            playNotificationSound();
        } catch (error) {
            toast.error('❌ Lỗi export Excel');
            console.error(error);
        } finally {
            setExporting(false);
        }
    };

    // Toggle appointment selection
    const toggleSelection = (appointmentId, e) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(appointmentId)) {
            newSelected.delete(appointmentId);
        } else {
            newSelected.add(appointmentId);
        }
        setSelectedIds(newSelected);
    };

    // Select all appointments
    const selectAll = () => {
        if (selectedIds.size === appointments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(appointments.map(appt => appt.id)));
        }
    };

    // Handle bulk status change
    const handleBulkStatusChange = async (newStatus) => {
        if (selectedIds.size === 0) {
            toast.warning('⚠️ Vui lòng chọn ít nhất 1 lịch khám');
            return;
        }

        try {
            setBulkUpdating(true);
            const ids = Array.from(selectedIds);
            
            const res = await api.put('/api/admin/appointments/bulk-status', {
                ids,
                status: newStatus
            });

            if (res.data.success) {
                toast.success(`✅ ${res.data.message}`);
                playNotificationSound();
                
                // Update local state
                setAppointments(prevState =>
                    prevState.map(appt =>
                        ids.includes(appt.id) ? { ...appt, status: newStatus } : appt
                    )
                );
                
                // Clear selection
                setSelectedIds(new Set());
            }
        } catch (error) {
            toast.error('❌ Lỗi cập nhật hàng loạt');
            console.error(error);
        } finally {
            setBulkUpdating(false);
        }
    };

    // Navigate months
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            pending: 'badge-warning',
            confirmed: 'badge-info',
            completed: 'badge-success',
            cancelled: 'badge-danger'
        };
        return statusMap[status] || 'badge-secondary';
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: 'Chờ',
            confirmed: 'Xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Hủy'
        };
        return statusMap[status] || status;
    };

    const calendarDays = getDaysInMonth(currentDate);
    const monthYear = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    return (
        <div className="admin-calendar-container">
            <div className="calendar-header-section">
                <div>
                    <h2 className="mb-0 fw-bold">📅 Lịch khám hẹn</h2>
                    <p className="text-muted mb-0">Quản lý và phê duyệt lịch khám bệnh nhân</p>
                </div>
                <div className="export-buttons">
                    <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={handleExportExcel}
                        disabled={exporting || appointments.length === 0}
                        title="Export danh sách lịch khám ra Excel"
                    >
                        <i className="fas fa-file-excel"></i> Excel
                    </button>
                </div>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Filter Bar */}
                <div className="calendar-filter-bar p-3 border-bottom bg-light">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <select 
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Hủy</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select 
                                className="form-select"
                                value={filterDoctor}
                                onChange={(e) => setFilterDoctor(e.target.value)}
                            >
                                <option value="">-- Tất cả bác sĩ --</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedIds.size > 0 && (
                    <div className="bulk-actions-bar p-3 border-bottom bg-info bg-opacity-10">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                            <div className="bulk-info fw-bold text-primary">
                                ✓ Đã chọn {selectedIds.size}/{appointments.length} lịch khám
                            </div>
                            <div className="bulk-buttons d-flex gap-2 flex-wrap">
                                <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleBulkStatusChange('confirmed')}
                                    disabled={bulkUpdating}
                                >
                                    <i className="fas fa-check"></i> Phê duyệt ({selectedIds.size})
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleBulkStatusChange('cancelled')}
                                    disabled={bulkUpdating}
                                >
                                    <i className="fas fa-times"></i> Từ chối ({selectedIds.size})
                                </button>
                                <button 
                                    className="btn btn-sm btn-warning"
                                    onClick={() => setSelectedIds(new Set())}
                                    disabled={bulkUpdating}
                                >
                                    <i className="fas fa-times-circle"></i> Bỏ chọn
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calendar Navigation */}
                <div className="calendar-nav-bar p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={goToPreviousMonth}
                    >
                        <i className="fas fa-chevron-left"></i> Tháng trước
                    </button>
                    <div className="calendar-month-year fw-bold text-center" style={{ flex: 1, fontSize: '16px' }}>
                        {monthYear}
                    </div>
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={goToNextMonth}
                    >
                        Tháng sau <i className="fas fa-chevron-right"></i>
                    </button>
                    <button 
                        className="btn btn-primary btn-sm ms-2"
                        onClick={goToToday}
                    >
                        Hôm nay
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="calendar-body p-3">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : (
                        <div className="calendar-grid">
                            {/* Day Headers */}
                            <div className="calendar-day-headers">
                                <div className="calendar-day-header">CN</div>
                                <div className="calendar-day-header">T2</div>
                                <div className="calendar-day-header">T3</div>
                                <div className="calendar-day-header">T4</div>
                                <div className="calendar-day-header">T5</div>
                                <div className="calendar-day-header">T6</div>
                                <div className="calendar-day-header">T7</div>
                            </div>

                            {/* Calendar Cells */}
                            <div className="calendar-cells">
                                {calendarDays.map((day, index) => {
                                    const dayAppointments = day ? getAppointmentsForDate(day) : [];
                                    const isToday = day && 
                                        day.toDateString() === new Date().toDateString();
                                    const isCurrentMonth = day && 
                                        day.getMonth() === currentDate.getMonth();

                                    return (
                                        <div 
                                            key={index} 
                                            className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                                        >
                                            {day && (
                                                <>
                                                    <div className="calendar-date-number">
                                                        {day.getDate()}
                                                    </div>
                                                    <div className="calendar-appointments">
                                                        {dayAppointments.map((appt, i) => {
                                                            const isSelected = selectedIds.has(appt.id);
                                                            return (
                                                                <div 
                                                                    key={i}
                                                                    className={`appointment-badge-container ${isSelected ? 'selected' : ''}`}
                                                                    onClick={() => {
                                                                        setSelectedAppointment(appt);
                                                                        setShowModal(true);
                                                                    }}
                                                                >
                                                                    <input 
                                                                        type="checkbox" 
                                                                        className="appointment-checkbox"
                                                                        checked={isSelected}
                                                                        onChange={(e) => toggleSelection(appt.id, e)}
                                                                        title="Chọn để hành động hàng loạt"
                                                                    />
                                                                    <div 
                                                                        className={`appointment-badge badge ${getStatusBadgeClass(appt.status)}`}
                                                                        title={appt.patient_name}
                                                                        style={{ cursor: 'pointer', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
                                                                    >
                                                                        <small>
                                                                            {appt.appointment_time.substring(0, 5)} {appt.patient_name.substring(0, 8)}...
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="calendar-legend p-3 border-top bg-light">
                    <div className="d-flex gap-3 flex-wrap">
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge badge-warning"></span>
                            <small>Chờ xác nhận</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge badge-info"></span>
                            <small>Đã xác nhận</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge badge-success"></span>
                            <small>Hoàn thành</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge badge-danger"></span>
                            <small>Hủy</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {showModal && selectedAppointment && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-bottom">
                                <h5 className="modal-title fw-bold">Chi tiết lịch khám</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="appointment-details">
                                    <div className="detail-row">
                                        <label className="detail-label">Bệnh nhân:</label>
                                        <span className="fw-bold">{selectedAppointment.patient_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Email:</label>
                                        <span>{selectedAppointment.patient_email}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Điện thoại:</label>
                                        <span>{selectedAppointment.patient_phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Bác sĩ:</label>
                                        <span className="fw-bold">{selectedAppointment.doctor_name}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Chuyên khoa:</label>
                                        <span>{selectedAppointment.specialty || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Ngày khám:</label>
                                        <span className="fw-bold">
                                            {new Date(selectedAppointment.appointment_date).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Giờ khám:</label>
                                        <span className="fw-bold">{selectedAppointment.appointment_time}</span>
                                    </div>
                                    <div className="detail-row">
                                        <label className="detail-label">Trạng thái:</label>
                                        <span className={`badge ${getStatusBadgeClass(selectedAppointment.status)}`}>
                                            {getStatusText(selectedAppointment.status)}
                                        </span>
                                    </div>
                                    {selectedAppointment.payment_status && (
                                        <div className="detail-row">
                                            <label className="detail-label">Thanh toán:</label>
                                            <span className={`badge ${selectedAppointment.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                                {selectedAppointment.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-top">
                                <div className="d-flex gap-2">
                                    {selectedAppointment.status === 'pending' && (
                                        <>
                                            <button 
                                                className="btn btn-success btn-sm"
                                                onClick={() => {
                                                    handleStatusChange(selectedAppointment.id, 'confirmed');
                                                    setShowModal(false);
                                                }}
                                            >
                                                <i className="fas fa-check"></i> Phê duyệt
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    handleStatusChange(selectedAppointment.id, 'cancelled');
                                                    setShowModal(false);
                                                }}
                                            >
                                                <i className="fas fa-times"></i> Từ chối
                                            </button>
                                        </>
                                    )}
                                    {selectedAppointment.status === 'confirmed' && (
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                handleStatusChange(selectedAppointment.id, 'completed');
                                                setShowModal(false);
                                            }}
                                        >
                                            <i className="fas fa-check-double"></i> Hoàn thành
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointmentCalendar;
