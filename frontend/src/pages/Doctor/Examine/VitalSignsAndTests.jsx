import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import './VitalSignsAndTests.css';

/**
 * Component cho bác sĩ nhập Chỉ số Sức Khỏe + Chỉ định Xét Nghiệm
 */
const VitalSignsAndTests = ({ appointmentId, patientName, onSave }) => {
    // ===== VITAL SIGNS =====
    const [vitalSigns, setVitalSigns] = useState({
        heart_rate: '',
        respiratory_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        body_temperature: '',
        preliminary_assessment: ''
    });

    // ===== LAB TESTS =====
    const [labTests, setLabTests] = useState([]);
    const [labTestsLoaded, setLabTestsLoaded] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);
    const [testNotes, setTestNotes] = useState({});

    // ===== STATE =====
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('vital-signs');

    // ===== FETCH LAB TESTS =====
    useEffect(() => {
        if (appointmentId) {
            fetchLabTestsList();
        }
    }, [appointmentId]);

    const fetchLabTestsList = async () => {
        try {
            const res = await api.get('/api/health/lab-tests?is_active=true');
            setLabTests(res.data.tests || []);
        } catch (err) {
            console.error('Lỗi lấy danh sách xét nghiệm:', err);
            setLabTests([]);
        } finally {
            setLabTestsLoaded(true);
        }
    };

    // ===== VITAL SIGNS HANDLERS =====
    const handleVitalSignChange = (field, value) => {
        setVitalSigns((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const generatePreliminaryAssessment = () => {
        const assessments = [];
        const { heart_rate, respiratory_rate, blood_pressure_systolic, body_temperature } = vitalSigns;

        if (heart_rate) {
            const hr = Number(heart_rate);
            if (hr < 60) assessments.push('Nhịp tim chậm');
            else if (hr > 100) assessments.push('Nhịp tim nhanh');
            else assessments.push('Nhịp tim bình thường');
        }

        if (respiratory_rate) {
            const rr = Number(respiratory_rate);
            if (rr < 12) assessments.push('Nhịp thở chậm');
            else if (rr > 20) assessments.push('Nhịp thở nhanh');
            else assessments.push('Nhịp thở bình thường');
        }

        if (blood_pressure_systolic && vitalSigns.blood_pressure_diastolic) {
            const sys = Number(blood_pressure_systolic);
            const dia = Number(vitalSigns.blood_pressure_diastolic);
            if (sys >= 140 || dia >= 90) assessments.push('⚠️ Tăng huyết áp');
            else if (sys < 90 || dia < 60) assessments.push('⚠️ Hạ huyết áp');
            else assessments.push('Huyết áp bình thường');
        }

        if (body_temperature) {
            const temp = Number(body_temperature);
            if (temp < 36) assessments.push('Hạ thân nhiệt');
            else if (temp > 38) assessments.push('Sốt cao');
            else if (temp > 37.5) assessments.push('Sốt nhẹ');
            else assessments.push('Nhiệt độ bình thường');
        }

        return assessments.join(' | ');
    };

    const saveVitalSigns = async () => {
        if (!appointmentId) {
            setError('Không có appointment ID');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Auto-generate assessment nếu chưa nhập
            const assessment = vitalSigns.preliminary_assessment || generatePreliminaryAssessment();

            await api.post('/api/health/vital-signs', {
                appointment_id: appointmentId,
                heart_rate: vitalSigns.heart_rate ? Number(vitalSigns.heart_rate) : null,
                respiratory_rate: vitalSigns.respiratory_rate ? Number(vitalSigns.respiratory_rate) : null,
                blood_pressure_systolic: vitalSigns.blood_pressure_systolic ? Number(vitalSigns.blood_pressure_systolic) : null,
                blood_pressure_diastolic: vitalSigns.blood_pressure_diastolic ? Number(vitalSigns.blood_pressure_diastolic) : null,
                body_temperature: vitalSigns.body_temperature ? Number(vitalSigns.body_temperature) : null,
                preliminary_assessment: assessment
            });

            alert('✅ Đã lưu chỉ số sức khỏe thành công!');
            onSave?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi lưu chỉ số sức khỏe');
        } finally {
            setLoading(false);
        }
    };

    // ===== LAB TESTS HANDLERS =====
    const toggleTestSelection = (testId) => {
        setSelectedTests((prev) => {
            if (prev.includes(testId)) {
                return prev.filter((id) => id !== testId);
            } else {
                return [...prev, testId];
            }
        });
    };

    const handleTestNoteChange = (testId, note) => {
        setTestNotes((prev) => ({
            ...prev,
            [testId]: note
        }));
    };

    const orderSelectedTests = async () => {
        if (selectedTests.length === 0) {
            setError('Vui lòng chọn ít nhất 1 xét nghiệm');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Tạo chỉ định cho từng xét nghiệm
            for (const testId of selectedTests) {
                await api.post('/api/health/test-orders', {
                    appointment_id: appointmentId,
                    lab_test_id: testId,
                    quantity: 1,
                    notes: testNotes[testId] || null
                });
            }

            alert(`✅ Đã chỉ định ${selectedTests.length} xét nghiệm thành công!`);
            setSelectedTests([]);
            setTestNotes({});
            onSave?.();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi chỉ định xét nghiệm');
        } finally {
            setLoading(false);
        }
    };

    // ===== GROUP TESTS BY CATEGORY (API trả category_name) =====
    const groupedTests = (Array.isArray(labTests) ? labTests : []).reduce((acc, test) => {
        const category = test.category_name || test.category || 'Khác';
        if (!acc[category]) acc[category] = [];
        acc[category].push(test);
        return acc;
    }, {});

    return (
        <div className="vital-signs-container">
            <h3>🏥 {patientName} - Khám Sức Khỏe & Chỉ định Xét Nghiệm</h3>

            {error && <div className="alert alert-error">{error}</div>}

            {/* TABS */}
            <div className="tabs-header">
                <button
                    type="button"
                    className={`tab-btn ${activeTab === 'vital-signs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('vital-signs')}
                >
                    📊 Chỉ Số Sức Khỏe
                </button>
                <button
                    type="button"
                    className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tests')}
                >
                    🧪 Chỉ định Xét Nghiệm ({selectedTests.length})
                </button>
            </div>

            {/* TAB: VITAL SIGNS */}
            {activeTab === 'vital-signs' && (
                <div className="tab-content vital-signs-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>❤️ Nhịp Tim (bpm):</label>
                            <input
                                type="number"
                                min="40"
                                max="200"
                                placeholder="60-100"
                                value={vitalSigns.heart_rate}
                                onChange={(e) => handleVitalSignChange('heart_rate', e.target.value)}
                            />
                            <small>Bình thường: 60-100 bpm</small>
                        </div>

                        <div className="form-group">
                            <label>🫁 Nhịp Thở (breaths/min):</label>
                            <input
                                type="number"
                                min="8"
                                max="40"
                                placeholder="12-20"
                                value={vitalSigns.respiratory_rate}
                                onChange={(e) => handleVitalSignChange('respiratory_rate', e.target.value)}
                            />
                            <small>Bình thường: 12-20 breaths/min</small>
                        </div>

                        <div className="form-group">
                            <label>🩸 Huyết Áp Tâm Thu (mmHg):</label>
                            <input
                                type="number"
                                min="70"
                                max="200"
                                placeholder="120"
                                value={vitalSigns.blood_pressure_systolic}
                                onChange={(e) => handleVitalSignChange('blood_pressure_systolic', e.target.value)}
                            />
                            <small>Bình thường: &lt; 120 mmHg</small>
                        </div>

                        <div className="form-group">
                            <label>🩸 Huyết Áp Tâm Trương (mmHg):</label>
                            <input
                                type="number"
                                min="40"
                                max="130"
                                placeholder="80"
                                value={vitalSigns.blood_pressure_diastolic}
                                onChange={(e) => handleVitalSignChange('blood_pressure_diastolic', e.target.value)}
                            />
                            <small>Bình thường: &lt; 80 mmHg</small>
                        </div>

                        <div className="form-group">
                            <label>🌡️ Nhiệt Độ Cơ Thể (°C):</label>
                            <input
                                type="number"
                                min="34"
                                max="42"
                                step="0.1"
                                placeholder="37"
                                value={vitalSigns.body_temperature}
                                onChange={(e) => handleVitalSignChange('body_temperature', e.target.value)}
                            />
                            <small>Bình thường: 36.5-37.5°C</small>
                        </div>

                        <div className="form-group full-width">
                            <label>📝 Đánh Giá Sơ Bộ:</label>
                            <textarea
                                rows="3"
                                placeholder="Nhập đánh giá hoặc để trống để auto-generate..."
                                value={vitalSigns.preliminary_assessment}
                                onChange={(e) => handleVitalSignChange('preliminary_assessment', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* AUTO-GENERATED ASSESSMENT PREVIEW */}
                    {!vitalSigns.preliminary_assessment && (vitalSigns.heart_rate || vitalSigns.body_temperature) && (
                        <div className="assessment-preview">
                            <h4>📋 Đánh giá tự động:</h4>
                            <p>{generatePreliminaryAssessment()}</p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            className="btn-primary"
                            onClick={saveVitalSigns}
                            disabled={loading}
                        >
                            {loading ? '⏳ Đang lưu...' : '✅ Lưu Chỉ Số Sức Khỏe'}
                        </button>
                    </div>
                </div>
            )}

            {/* TAB: TESTS */}
            {activeTab === 'tests' && (
                <div className="tab-content tests-selection">
                    {labTestsLoaded && labTests.length === 0 && (
                        <p className="tests-empty-hint">
                            Chưa có xét nghiệm nào (hoặc không tải được). Vào Admin → Xét nghiệm để thêm danh mục.
                        </p>
                    )}
                    {!labTestsLoaded && (
                        <p className="tests-loading-hint">Đang tải danh sách xét nghiệm…</p>
                    )}
                    <div className="tests-grid">
                        {Object.entries(groupedTests).map(([category, tests]) => (
                            <div key={category} className="test-category">
                                <h4>{category}</h4>
                                <div className="test-list">
                                    {tests.map((test) => (
                                        <div key={test.id} className="test-item">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTests.includes(test.id)}
                                                    onChange={() => toggleTestSelection(test.id)}
                                                />
                                                <span className="checkbox-text">
                                                    <strong>{test.name}</strong>
                                                    <br />
                                                    <small>
                                                        Mã: {test.code} | Giá: {Number(test.price).toLocaleString('vi-VN')}đ
                                                    </small>
                                                </span>
                                            </label>

                                            {selectedTests.includes(test.id) && (
                                                <textarea
                                                    className="test-note"
                                                    rows="2"
                                                    placeholder="Ghi chú cho xét nghiệm này..."
                                                    value={testNotes[test.id] || ''}
                                                    onChange={(e) => handleTestNoteChange(test.id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedTests.length > 0 && (
                        <div className="selected-tests-summary">
                            <h4>🧪 Đã chọn: {selectedTests.length} xét nghiệm</h4>
                            <ul>
                                {selectedTests.map((testId) => {
                                    const test = labTests.find((t) => t.id === testId);
                                    return (
                                        <li key={testId}>
                                            {test?.name} - {Number(test?.price).toLocaleString('vi-VN')}đ
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="total-cost">
                                💰 Tổng chi phí: {selectedTests.reduce(
                                    (sum, testId) => sum + (labTests.find((t) => t.id === testId)?.price || 0),
                                    0
                                ).toLocaleString('vi-VN')}đ
                            </p>
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            className="btn-primary"
                            onClick={orderSelectedTests}
                            disabled={loading || selectedTests.length === 0}
                        >
                            {loading ? '⏳ Đang tạo...' : `🧪 Chỉ định ${selectedTests.length} Xét Nghiệm`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VitalSignsAndTests;
