import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../lib/api';
import './DoctorExamPages.css';

const DoctorVitalSignsPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [patientName, setPatientName] = useState('');
    const [vitalSigns, setVitalSigns] = useState({
        heart_rate: '',
        respiratory_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        body_temperature: '',
        preliminary_assessment: ''
    });
    const [loading, setLoading] = useState(false);

    const generatePreliminaryAssessment = (vitals) => {
        const assessments = [];

        const {
            heart_rate,
            respiratory_rate,
            blood_pressure_systolic,
            blood_pressure_diastolic,
            body_temperature
        } = vitals;

        // Nhịp tim: 60-100 bpm
        if (heart_rate !== '') {
            const hr = Number(heart_rate);
            if (Number.isFinite(hr)) {
                if (hr < 60) assessments.push(`Nhịp tim chậm ( < 60 bpm )`);
                else if (hr > 100) assessments.push(`Nhịp tim nhanh ( > 100 bpm )`);
                else assessments.push(`Nhịp tim bình thường (60-100 bpm)`);
            }
        }

        // Nhịp thở: 12-20 lần/phút
        if (respiratory_rate !== '') {
            const rr = Number(respiratory_rate);
            if (Number.isFinite(rr)) {
                if (rr < 12) assessments.push(`Nhịp thở chậm ( < 12 lần/phút )`);
                else if (rr > 20) assessments.push(`Nhịp thở nhanh ( > 20 lần/phút )`);
                else assessments.push(`Nhịp thở bình thường (12-20 lần/phút)`);
            }
        }

        // HA: sys 90-139 & dia 60-89 (mang tính tham khảo)
        if (blood_pressure_systolic !== '' && blood_pressure_diastolic !== '') {
            const sys = Number(blood_pressure_systolic);
            const dia = Number(blood_pressure_diastolic);
            if (Number.isFinite(sys) && Number.isFinite(dia)) {
                if (sys >= 140 || dia >= 90) assessments.push(`⚠️ Tăng huyết áp (>=140/90)`);
                else if (sys < 90 || dia < 60) assessments.push(`⚠️ Hạ huyết áp (<90 hoặc <60)`);
                else assessments.push(`Huyết áp bình thường (90-139 / 60-89)`);
            }
        }

        // Nhiệt độ: 36.5-37.5
        if (body_temperature !== '') {
            const temp = Number(body_temperature);
            if (Number.isFinite(temp)) {
                if (temp < 36.5) assessments.push(`Hạ thân nhiệt ( < 36.5°C )`);
                else if (temp > 38) assessments.push(`Sốt cao ( > 38°C )`);
                else if (temp > 37.5) assessments.push(`Sốt nhẹ ( > 37.5°C )`);
                else assessments.push(`Nhiệt độ bình thường (36.5-37.5°C)`);
            }
        }

        if (assessments.length === 0) return 'Nhập ít nhất 1 chỉ số để hệ thống tự đánh giá.';
        return assessments.join(' | ');
    };

    const assessmentPreview = generatePreliminaryAssessment(vitalSigns);
    const assessmentTone = (() => {
        const hasDanger = /Sốt cao|Tăng huyết áp|Nhịp tim nhanh|Nhịp thở nhanh/i.test(assessmentPreview);
        const hasWarning = /⚠️|Sốt nhẹ|Hạ huyết áp|Hạ thân nhiệt|chậm|nhanh/i.test(assessmentPreview);
        if (hasDanger) return 'danger';
        if (hasWarning) return 'warning';
        return 'normal';
    })();

    useEffect(() => {
        api.get(`/api/appointments/doctor-appointment/${appointmentId}`)
            .then((res) => setPatientName(res.data.appointment?.patient_name || ''))
            .catch(() => {});
    }, [appointmentId]);

    const handleChange = (field, value) => setVitalSigns((p) => ({ ...p, [field]: value }));

    const save = async () => {
        try {
            setLoading(true);
            const assessment = vitalSigns.preliminary_assessment?.trim()
                ? vitalSigns.preliminary_assessment
                : generatePreliminaryAssessment(vitalSigns);
            await api.post('/api/health/vital-signs', {
                appointment_id: Number(appointmentId),
                heart_rate: vitalSigns.heart_rate ? Number(vitalSigns.heart_rate) : null,
                respiratory_rate: vitalSigns.respiratory_rate ? Number(vitalSigns.respiratory_rate) : null,
                blood_pressure_systolic: vitalSigns.blood_pressure_systolic
                    ? Number(vitalSigns.blood_pressure_systolic)
                    : null,
                blood_pressure_diastolic: vitalSigns.blood_pressure_diastolic
                    ? Number(vitalSigns.blood_pressure_diastolic)
                    : null,
                body_temperature: vitalSigns.body_temperature ? Number(vitalSigns.body_temperature) : null,
                preliminary_assessment: assessment || null
            });
            toast.success('Đã lưu chỉ số sức khỏe!');
            navigate(`/doctor/examine/${appointmentId}/write`);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Lỗi lưu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doc-exam-page doc-vitals-page">
            <button type="button" className="btn-back" onClick={() => navigate(`/doctor/examine/${appointmentId}/write`)}>
                ← Quay lại viết bệnh án
            </button>
            <h1>📊 Khám sức khỏe — {patientName}</h1>
            <div className="vitals-grid">
                <label>
                    Nhịp tim (bpm)
                    <input
                        type="number"
                        value={vitalSigns.heart_rate}
                        min="40"
                        max="200"
                        placeholder="60-100"
                        onChange={(e) => handleChange('heart_rate', e.target.value)}
                    />
                    <small className="vitals-normal-range">Bình thường: 60–100 bpm</small>
                </label>
                <label>
                    Nhịp thở
                    <input
                        type="number"
                        value={vitalSigns.respiratory_rate}
                        min="8"
                        max="40"
                        placeholder="12-20"
                        onChange={(e) => handleChange('respiratory_rate', e.target.value)}
                    />
                    <small className="vitals-normal-range">Bình thường: 12–20 lần/phút</small>
                </label>
                <label>
                    HA tâm thu
                    <input
                        type="number"
                        value={vitalSigns.blood_pressure_systolic}
                        min="50"
                        max="250"
                        placeholder="90-139"
                        onChange={(e) => handleChange('blood_pressure_systolic', e.target.value)}
                    />
                    <small className="vitals-normal-range">Bình thường: 90–139 mmHg</small>
                </label>
                <label>
                    HA tâm trương
                    <input
                        type="number"
                        value={vitalSigns.blood_pressure_diastolic}
                        min="30"
                        max="150"
                        placeholder="60-89"
                        onChange={(e) => handleChange('blood_pressure_diastolic', e.target.value)}
                    />
                    <small className="vitals-normal-range">Bình thường: 60–89 mmHg</small>
                </label>
                <label>
                    Nhiệt độ (°C)
                    <input
                        type="number"
                        step="0.1"
                        value={vitalSigns.body_temperature}
                        min="34"
                        max="42"
                        placeholder="36.5-37.5"
                        onChange={(e) => handleChange('body_temperature', e.target.value)}
                    />
                    <small className="vitals-normal-range">Bình thường: 36.5–37.5 °C</small>
                </label>
            </div>
            <label className="full">
                Đánh giá sơ bộ
                <textarea
                    rows={3}
                    value={vitalSigns.preliminary_assessment}
                    onChange={(e) => handleChange('preliminary_assessment', e.target.value)}
                />
            </label>

            <div className="auto-assessment-preview" aria-live="polite">
                <div className="auto-assessment-title">📋 Tự động đánh giá</div>
                <div className={`auto-assessment-box auto-assessment-box--${assessmentTone}`}>
                    {assessmentPreview}
                </div>
            </div>

            <button type="button" className="btn-save-main" disabled={loading} onClick={save}>
                {loading ? 'Đang lưu...' : 'Lưu & quay lại'}
            </button>
        </div>
    );
};

export default DoctorVitalSignsPage;
