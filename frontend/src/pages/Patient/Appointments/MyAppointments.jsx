import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../lib/api';
import './MyAppointments.css';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState(null);

    // Fetch patient appointments
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/appointments/my-appointments');
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error('Lỗi lấy lịch khám:', error);
            toast.error('Không thể tải danh sách lịch khám');
        } finally {
            setLoading(false);
        }
    };

    // Format date and time
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString.slice(0, 5);
    };

    // Check if appointment can be cancelled (more than 24 hours away)
    const canCancel = (appointment) => {
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        const currentDateTime = new Date();
        const hoursUntilAppointment = (appointmentDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);
        return hoursUntilAppointment > 24 && appointment.status !== 'checked-in' && appointment.status !== 'completed';
    };

    // Get remaining hours to cancel
    const getHoursRemaining = (appointment) => {
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
        const currentDateTime = new Date();
        const hoursRemaining = (appointmentDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);
        return hoursRemaining;
    };

    // Cancel appointment
    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch khám này?')) {
            return;
        }

        try {
            setCancelingId(appointmentId);
            const response = await api.put(`/api/appointments/${appointmentId}/cancel`);
            toast.success(response.data.message);
            
            // Update the appointment status to cancelled
            setAppointments(appointments.map(apt => 
                apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
            ));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi khi hủy lịch khám';
            toast.error(errorMessage);
            console.error('Lỗi hủy lịch khám:', error);
        } finally {
            setCancelingId(null);
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { text: 'Chờ khám', color: 'status-pending' },
            'checked-in': { text: 'Đã check-in', color: 'status-checkin' },
            'completed': { text: 'Đã khám', color: 'status-completed' },
            'cancelled': { text: 'Đã hủy', color: 'status-cancelled' }
        };
        const statusInfo = statusMap[status] || { text: status, color: 'status-unknown' };
        return <span className={`status-badge ${statusInfo.color}`}>{statusInfo.text}</span>;
    };

    // Get payment status badge
    const getPaymentBadge = (paymentStatus) => {
        const paymentMap = {
            'paid': { text: 'Đã thanh toán', color: 'payment-paid' },
            'unpaid': { text: 'Chưa thanh toán', color: 'payment-unpaid' },
            'pending': { text: 'Chờ xử lý', color: 'payment-pending' }
        };
        const paymentInfo = paymentMap[paymentStatus] || { text: paymentStatus, color: 'payment-unknown' };
        return <span className={`payment-badge ${paymentInfo.color}`}>{paymentInfo.text}</span>;
    };

    return (
        <div className="my-appointments-container">
            <div className="appointments-header">
                <h1>📅 Lịch Khám Của Tôi</h1>
                <p className="header-subtitle">Quản lý và hủy lịch khám của bạn</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải lịch khám...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h2>Bạn chưa có lịch khám nào</h2>
                    <p>Hãy đặt lịch khám với bác sĩ ngay bây giờ</p>
                </div>
            ) : (
                <div className="appointments-list">
                    {appointments.map((appointment) => {
                        const canCancelThisOne = canCancel(appointment);
                        const hoursRemaining = getHoursRemaining(appointment);
                        
                        return (
                            <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                                <div className="appointment-content">
                                    {/* Left section - Date and time */}
                                    <div className="appointment-datetime">
                                        <div className="date-box">
                                            <div className="appointment-date">
                                                {new Date(appointment.appointment_date).getDate()}
                                            </div>
                                            <div className="appointment-month">
                                                {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', { month: 'short' })}
                                            </div>
                                        </div>
                                        <div className="time-info">
                                            <p className="appointment-time">⏰ {formatTime(appointment.appointment_time)}</p>
                                            <p className="appointment-date-full">{formatDate(appointment.appointment_date)}</p>
                                        </div>
                                    </div>

                                    {/* Middle section - Doctor and speciality */}
                                    <div className="appointment-doctor">
                                        <div className="doctor-avatar">👨‍⚕️</div>
                                        <div className="doctor-info">
                                            <h3>{appointment.doctor_name}</h3>
                                            <p className="specialty">{appointment.specialty}</p>
                                            {appointment.doctor_phone && (
                                                <p className="phone">📞 {appointment.doctor_phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right section - Status and actions */}
                                    <div className="appointment-status">
                                        <div className="status-badges">
                                            {getStatusBadge(appointment.status)}
                                            {appointment.payment_status && getPaymentBadge(appointment.payment_status)}
                                        </div>

                                        {appointment.status !== 'cancelled' && canCancelThisOne && (
                                            <div className="cancel-info">
                                                <p className="hours-remaining">
                                                    ⏳ Còn {hoursRemaining.toFixed(1)} giờ để hủy
                                                </p>
                                                <button
                                                    className="btn-cancel"
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    disabled={cancelingId === appointment.id}
                                                >
                                                    {cancelingId === appointment.id ? '⏳ Đang xử lý...' : '❌ Hủy Lịch'}
                                                </button>
                                            </div>
                                        )}

                                        {appointment.status !== 'cancelled' && !canCancelThisOne && (
                                            <div className="cancel-info cannot-cancel">
                                                {appointment.status === 'checked-in' && (
                                                    <p>✓ Khám viện đang được tiến hành</p>
                                                )}
                                                {appointment.status === 'completed' && (
                                                    <p>✓ Lịch khám đã hoàn thành</p>
                                                )}
                                                {hoursRemaining <= 24 && hoursRemaining > 0 && (
                                                    <p>⚠️ Quá hạn hủy (còn {hoursRemaining.toFixed(1)} giờ)</p>
                                                )}
                                                {hoursRemaining <= 0 && appointment.status === 'pending' && (
                                                    <p>⚠️ Lịch khám đã bắt đầu</p>
                                                )}
                                            </div>
                                        )}

                                        {appointment.status === 'cancelled' && (
                                            <div className="cancel-info cancelled-info">
                                                <p>✓ Lịch khám này đã bị hủy</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
