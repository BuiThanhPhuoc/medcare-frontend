import { useState, useEffect, useMemo } from 'react';
import api from '../../../lib/api';
import './MedicalHistory.css';

const MedicalHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterByDoctor, setFilterByDoctor] = useState('');
    const [filterByDateRange, setFilterByDateRange] = useState('all');
    const [expandedRecord, setExpandedRecord] = useState(null);
    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'list'

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/medical-records/my-records');
                const sortedRecords = (res.data.records || []).sort(
                    (a, b) => new Date(b.appointment_date) - new Date(a.appointment_date)
                );
                setRecords(sortedRecords);
            } catch (error) {
                console.error('Lỗi lấy bệnh án:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    // Format ngày
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    // Lấy danh sách bác sĩ duy nhất
    const uniqueDoctors = useMemo(() => {
        return [...new Set(records.map(r => r.doctor_name))].filter(Boolean);
    }, [records]);

    // Lọc dữ liệu theo tìm kiếm và bộ lọc
    const filteredRecords = useMemo(() => {
        let filtered = records;

        // Lọc theo tìm kiếm
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                record.diagnosis?.toLowerCase().includes(term) ||
                record.prescription?.toLowerCase().includes(term) ||
                record.note?.toLowerCase().includes(term) ||
                record.doctor_name?.toLowerCase().includes(term)
            );
        }

        // Lọc theo bác sĩ
        if (filterByDoctor && filterByDoctor !== 'all') {
            filtered = filtered.filter(record => record.doctor_name === filterByDoctor);
        }

        // Lọc theo khoảng thời gian
        if (filterByDateRange !== 'all') {
            const now = new Date();
            let startDate = new Date();

            switch (filterByDateRange) {
                case '7days':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case '30days':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case '90days':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case '1year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(record => {
                const recordDate = new Date(record.appointment_date);
                return recordDate >= startDate;
            });
        }

        return filtered;
    }, [records, searchTerm, filterByDoctor, filterByDateRange]);

    // Tính toán overview stats
    const stats = useMemo(() => {
        return {
            totalVisits: records.length,
            latestVisit: records[0] ? formatDate(records[0].appointment_date) : 'N/A',
            uniqueDiseases: [...new Set(records.map(r => r.diagnosis))].filter(Boolean).length,
            totalPrescriptions: records.length,
        };
    }, [records]);

    // Parse prescription text (cải thiện hơn)
    const parsePrescription = (prescriptionText) => {
        if (!prescriptionText) return [];
        
        const lines = prescriptionText.split('\n').filter(line => line.trim());
        const medicines = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('-')) {
                medicines.push(trimmed);
            }
        }
        
        return medicines;
    };

    if (loading) {
        return (
            <div className="history-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Đang tải lịch sử khám bệnh...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            {/* Header */}
            <div className="history-header">
                <h2>📋 Lịch Sử Khám Bệnh & Đơn Thuốc</h2>
                <p className="header-subtitle">Theo dõi các lần khám bệnh và đơn thuốc của bạn</p>
            </div>

            {/* Quick Overview */}
            {records.length > 0 && (
                <div className="quick-stats">
                    <div className="stat-item">
                        <span className="stat-label">Tổng lần khám</span>
                        <span className="stat-value">{stats.totalVisits}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Lần khám gần nhất</span>
                        <span className="stat-value">{stats.latestVisit}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Loại bệnh khác nhau</span>
                        <span className="stat-value">{stats.uniqueDiseases}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Đơn thuốc</span>
                        <span className="stat-value">{stats.totalPrescriptions}</span>
                    </div>
                </div>
            )}

            {/* Search & Filter Section */}
            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm bệnh, thuốc, bác sĩ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters-row">
                    <select
                        value={filterByDoctor}
                        onChange={(e) => setFilterByDoctor(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Tất cả bác sĩ</option>
                        {uniqueDoctors.map(doctor => (
                            <option key={doctor} value={doctor}>
                                {doctor}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterByDateRange}
                        onChange={(e) => setFilterByDateRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="7days">7 ngày gần nhất</option>
                        <option value="30days">30 ngày gần nhất</option>
                        <option value="90days">90 ngày gần nhất</option>
                        <option value="1year">1 năm gần nhất</option>
                    </select>

                    <div className="view-mode-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                            onClick={() => setViewMode('timeline')}
                            title="Timeline view"
                        >
                            📅 Timeline
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            📝 Danh sách
                        </button>
                    </div>
                </div>
            </div>

            {/* Records Display */}
            <div className="records-display">
                {filteredRecords.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <p className="empty-text">
                            {searchTerm || filterByDoctor || filterByDateRange !== 'all'
                                ? 'Không tìm thấy bệnh án phù hợp với tiêu chí tìm kiếm'
                                : 'Bạn chưa có hồ sơ bệnh án nào'}
                        </p>
                    </div>
                ) : (
                    <div className={`records-${viewMode}`}>
                        {viewMode === 'timeline' ? (
                            <div className="timeline">
                                {filteredRecords.map((record, index) => (
                                    <div key={record.id} className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-date">{formatDate(record.appointment_date)}</div>
                                        <div className="timeline-content">
                                            <div
                                                className="record-card-timeline"
                                                onClick={() => setExpandedRecord(
                                                    expandedRecord === record.id ? null : record.id
                                                )}
                                            >
                                                <div className="record-header">
                                                    <h3>Lần khám #{filteredRecords.length - index}</h3>
                                                    <span className="doctor-badge">👨‍⚕️ {record.doctor_name}</span>
                                                </div>
                                                <div className="record-preview">
                                                    <p className="diagnosis-preview">
                                                        <strong>🩺 Chẩn đoán:</strong> {record.diagnosis}
                                                    </p>
                                                </div>
                                                <div className="expand-indicator">
                                                    {expandedRecord === record.id ? '▼ Ẩn chi tiết' : '▶ Xem chi tiết'}
                                                </div>

                                                {expandedRecord === record.id && (
                                                    <div className="record-details">
                                                        <div className="detail-section">
                                                            <h4>💊 Đơn Thuốc</h4>
                                                            <div className="prescription-table">
                                                                {parsePrescription(record.prescription).length > 0 ? (
                                                                    <div className="medicine-list">
                                                                        {parsePrescription(record.prescription).map((med, idx) => (
                                                                            <div key={idx} className="medicine-item">
                                                                                {med}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="no-medicine">Không có đơn thuốc</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {record.note && (
                                                            <div className="detail-section">
                                                                <h4>📌 Lời Dặn</h4>
                                                                <p className="note-text">{record.note}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="list-view">
                                {filteredRecords.map((record, index) => (
                                    <div key={record.id} className="record-card">
                                        <div className="record-header">
                                            <div className="header-left">
                                                <h3>Lần khám #{filteredRecords.length - index} · {formatDate(record.appointment_date)}</h3>
                                                <span className="doctor-badge">👨‍⚕️ {record.doctor_name}</span>
                                            </div>
                                            <button
                                                className="expand-btn"
                                                onClick={() => setExpandedRecord(
                                                    expandedRecord === record.id ? null : record.id
                                                )}
                                            >
                                                {expandedRecord === record.id ? '▼' : '▶'}
                                            </button>
                                        </div>

                                        <div className="record-body">
                                            <div className="info-row">
                                                <strong>🩺 Chẩn đoán</strong>
                                                <p className="highlight-text">{record.diagnosis}</p>
                                            </div>

                                            {expandedRecord === record.id && (
                                                <>
                                                    <div className="info-row">
                                                        <strong>💊 Đơn thuốc</strong>
                                                        <div className="prescription-box">
                                                            {parsePrescription(record.prescription).length > 0 ? (
                                                                <div className="medicine-list">
                                                                    {parsePrescription(record.prescription).map((med, idx) => (
                                                                        <div key={idx} className="medicine-item">
                                                                            • {med}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="no-medicine">Không có đơn thuốc</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {record.note && (
                                                        <div className="info-row">
                                                            <strong>📌 Lời dặn</strong>
                                                            <p>{record.note}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {filteredRecords.length > 0 && (
                    <div className="results-info">
                        Hiển thị {filteredRecords.length} trong {records.length} bệnh án
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalHistory;
