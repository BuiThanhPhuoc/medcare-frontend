import { useState } from 'react';
import api from '../../../lib/api';

const QuickActionCheckInModal = ({ show, onHide, onSuccess }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError('Vui lòng nhập số điện thoại hoặc CCCD');
            return;
        }

        try {
            setSearching(true);
            setError(null);
            setSearchResults([]);

            // Tìm kiếm bệnh nhân
            const res = await api.get(`/api/appointments/search?query=${searchTerm}`);
            const results = res.data.appointments || [];
            
            if (results.length === 0) {
                setError(`Không tìm thấy bệnh nhân nào với: ${searchTerm}`);
            } else {
                setSearchResults(results);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi tìm kiếm');
        } finally {
            setSearching(false);
        }
    };

    const handleCheckIn = async (patientId) => {
        try {
            setError(null);
            await api.put(`/api/appointments/${patientId}/check-in`);
            
            setSuccess('Check-in thành công! 🎉');
            setTimeout(() => {
                onSuccess && onSuccess();
                resetModal();
                onHide();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể check-in');
        }
    };

    const resetModal = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSelectedPatient(null);
        setError(null);
        setSuccess(null);
    };

    const handleClose = () => {
        resetModal();
        onHide();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div 
            className={`modal fade ${show ? 'show' : ''}`}
            style={{ 
                display: show ? 'block' : 'none', 
                backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' 
            }}
            tabIndex="-1" 
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-search me-2"></i>
                            Check-in Nhanh - Tìm Bệnh Nhân
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={handleClose}
                        ></button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Messages */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                <strong>Lỗi:</strong> {error}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setError(null)}
                                ></button>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                <i className="fas fa-check-circle me-2"></i>
                                {success}
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSuccess(null)}
                                ></button>
                            </div>
                        )}

                        {!selectedPatient ? (
                            <>
                                {/* Search Form */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold mb-2">
                                        <i className="fas fa-phone me-2 text-primary"></i>
                                        Nhập số điện thoại hoặc CCCD
                                    </label>
                                    <div className="input-group input-group-lg">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="0912345678 hoặc 123456789"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setError(null);
                                            }}
                                            onKeyPress={handleKeyPress}
                                            disabled={searching}
                                            autoFocus
                                        />
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={handleSearch}
                                            disabled={searching || !searchTerm.trim()}
                                        >
                                            {searching ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Đang tìm...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-search me-2"></i>
                                                    Tìm kiếm
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Results */}
                                {searchResults.length > 0 && (
                                    <div>
                                        <h6 className="fw-bold mb-3">
                                            <i className="fas fa-list me-2 text-info"></i>
                                            Kết quả tìm kiếm ({searchResults.length})
                                        </h6>
                                        <div className="list-group">
                                            {searchResults.map(patient => (
                                                <div
                                                    key={patient.id}
                                                    className="list-group-item list-group-item-action p-3"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setSelectedPatient(patient)}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="mb-1">
                                                                <i className="fas fa-user me-2 text-primary"></i>
                                                                {patient.patient_name}
                                                            </h6>
                                                            <p className="mb-1 text-muted">
                                                                <i className="fas fa-phone me-2"></i>
                                                                {patient.patient_phone}
                                                            </p>
                                                            <p className="mb-0 text-muted">
                                                                <i className="fas fa-stethoscope me-2"></i>
                                                                {patient.doctor_name || 'Chưa phân công'} | 
                                                                <span className="ms-2">
                                                                    {new Date(patient.appointment_date).toLocaleDateString('vi-VN')} 
                                                                    {' '}{patient.appointment_time}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <span className={`badge ${
                                                            patient.status === 'pending' ? 'bg-warning' :
                                                            patient.status === 'checked-in' ? 'bg-success' : 'bg-secondary'
                                                        }`}>
                                                            {patient.status === 'pending' ? 'Chưa Check-in' :
                                                             patient.status === 'checked-in' ? 'Đã Check-in' : 'Hoàn tất'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Selected Patient Details */}
                                <div className="card border-primary mb-4">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-check me-2"></i>
                                            Xác nhận Check-in
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <strong>Tên:</strong> {selectedPatient.patient_name}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>SĐT:</strong> {selectedPatient.patient_phone}
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <strong>Ngày:</strong> {new Date(selectedPatient.appointment_date).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Giờ:</strong> {selectedPatient.appointment_time}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <strong>Bác sĩ:</strong> {selectedPatient.doctor_name || 'Chưa phân công'}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Chuyên khoa:</strong> {selectedPatient.specialty_name || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={selectedPatient ? () => setSelectedPatient(null) : handleClose}
                        >
                            <i className={`fas fa-${selectedPatient ? 'arrow-left' : 'times'} me-2`}></i>
                            {selectedPatient ? 'Quay lại' : 'Hủy'}
                        </button>
                        {selectedPatient && (
                            <button
                                type="button"
                                className="btn btn-success btn-lg"
                                onClick={() => handleCheckIn(selectedPatient.id)}
                                disabled={searching}
                            >
                                <i className="fas fa-check-circle me-2"></i>
                                Check-in Ngay
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickActionCheckInModal;
