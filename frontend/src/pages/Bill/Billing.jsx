import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import './Billing.css';

const Billing = () => {
    const navigate = useNavigate();
    const [unpaidList, setUnpaidList] = useState([]);
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUnpaidList = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/appointments/unpaid');
            const appointments = res.data.appointments || [];
            setUnpaidList(appointments);
        } catch (error) {
            console.error('Lỗi lấy danh sách chờ thanh toán:', error);
            setNotice({ type: 'error', text: error.response?.data?.message || 'Không thể tải danh sách chờ thanh toán.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUnpaidList(); }, []);

    const openInvoice = (patient) => {
        setNotice(null);
        navigate(`/billing/${patient.id}`);
    };

    if (loading) {
        return (
            <div className="billing-container">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="billing-container">
            <div className="billing-header">
                <h2><i className="fas fa-cash-register"></i> Quầy Thu Ngân</h2>
                <p className="text-muted">Quản lý thanh toán bệnh nhân</p>
            </div>

            {notice && (
                <div className={`billing-notice ${notice.type === 'success' ? 'success' : 'error'}`}>
                    <i className={`fas fa-${notice.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                    {notice.text}
                </div>
            )}
            
            <div className="billing-main">
                {/* Cột trái: Danh sách bệnh nhân */}
                <div className="billing-left">
                    <div className="billing-left-header">
                        <h3>Danh sách chờ thanh toán</h3>
                        <span className="badge bg-danger">{unpaidList.length}</span>
                    </div>

                    {unpaidList.length === 0 ? (
                        <div className="no-data-placeholder">
                            <i className="fas fa-check-circle"></i>
                            <p>Tất cả bệnh nhân đã thanh toán</p>
                        </div>
                    ) : (
                        <div className="billing-list">
                            {unpaidList.map(patient => (
                                <div
                                    key={patient.id}
                                    className="billing-card"
                                    onClick={() => openInvoice(patient)}
                                >
                                    <div className="billing-card-header">
                                        <h4>{patient.patient_name}</h4>
                                        <span className="priority-badge">Chờ TT</span>
                                    </div>
                                    <div className="billing-card-body">
                                        <p><strong>Mã:</strong> #{patient.id}</p>
                                        <p><strong>SĐT:</strong> {patient.patient_phone || patient.phone || 'N/A'}</p>
                                        <p className="amount-text"><strong>💰 Chờ tính tổng</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cột phải: Chi tiết hóa đơn */}
                <div className="billing-right">
                    <div className="invoice-placeholder">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <p>Bấm vào bệnh nhân để xem chi tiết hóa đơn</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;