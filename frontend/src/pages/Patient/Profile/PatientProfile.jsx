import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { toast } from 'react-toastify';
import BasicInfoSection from './sections/BasicInfoSection';
import EmergencyContactSection from './sections/EmergencyContactSection';
import MedicalInfoSection from './sections/MedicalInfoSection';
import './PatientProfile.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BHYT_REGEX = /^[A-Z]{2}\d{8}$/;

function resolveAvatarUrl(path) {
    if (!path) return null;
    const s = String(path);
    if (s.startsWith('data:') || s.startsWith('http')) return s;
    return `${API_BASE}${s.startsWith('/') ? s : `/${s}`}`;
}

function normalizeDateInput(v) {
    if (v == null || v === '') return '';
    const str = String(v);
    return str.includes('T') ? str.slice(0, 10) : str.slice(0, 10);
}

function digitsOnly(s) {
    return String(s || '').replace(/\D/g, '');
}

function maskIdDigits(digits) {
    const d = digitsOnly(digits);
    if (!d) return '';
    if (d.length < 4) return '*'.repeat(d.length);
    return '*'.repeat(d.length - 4) + d.slice(-4);
}

function maskBhyt(code) {
    const s = String(code || '').trim().toUpperCase().replace(/\s/g, '');
    if (!s) return '';
    if (s.length < 4) return '*'.repeat(s.length);
    return '*'.repeat(s.length - 4) + s.slice(-4);
}

function validateIdDoc(idDocType, idNumberRaw) {
    const digits = digitsOnly(idNumberRaw);
    if (!digits && !idDocType) return { ok: true };
    if (!idDocType) {
        return { ok: false, message: 'Vui lòng chọn loại giấy tờ (CMND / CCCD).' };
    }
    if (!digits) {
        return { ok: false, message: 'Vui lòng nhập số CCCD/CMND.' };
    }
    if (idDocType === 'CCCD') {
        if (digits.length !== 12) return { ok: false, message: 'CCCD phải gồm 12 chữ số' };
        return { ok: true };
    }
    if (idDocType === 'CMND') {
        if (digits.length !== 9 && digits.length !== 12) {
            return { ok: false, message: 'CMND phải gồm 9 hoặc 12 chữ số' };
        }
        return { ok: true };
    }
    return { ok: true };
}

const PatientProfile = () => {
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        blood_type: '',
        height: '',
        weight: '',
        medical_history: '',
        allergies: '',
        current_health_status: '',
        notes: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        address: '',
        id_document_type: '',
        id_number: '',
        health_insurance_code: '',
        occupation: '',
        hobbies: '',
        avatar: ''
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basicInfo');

    useEffect(() => {
        fetchPatientProfile();
    }, []);

    const applyPatientPayload = (patientData) => {
        setFormData((prevData) => ({
            ...prevData,
            username: patientData.username || '',
            full_name: patientData.full_name || '',
            email: patientData.email || '',
            phone: patientData.phone || '',
            date_of_birth: normalizeDateInput(patientData.date_of_birth),
            gender: patientData.gender || '',
            address: patientData.address || '',
            blood_type: patientData.blood_type || '',
            height: patientData.height != null && patientData.height !== '' ? String(patientData.height) : '',
            weight: patientData.weight != null && patientData.weight !== '' ? String(patientData.weight) : '',
            medical_history: patientData.medical_history || '',
            allergies: patientData.allergies || '',
            id_document_type: patientData.id_document_type || '',
            id_number: patientData.id_number ? digitsOnly(patientData.id_number) : '',
            health_insurance_code: patientData.health_insurance_code
                ? String(patientData.health_insurance_code).trim().replace(/\s/g, '').toUpperCase()
                : '',
            emergency_contact_name: patientData.emergency_contact_name || '',
            emergency_contact_phone: patientData.emergency_contact_phone || '',
            emergency_contact_relationship: patientData.emergency_contact_relationship || '',
            chronic_disease: patientData.chronic_disease || '',
            current_medications: patientData.current_medications || '',
            current_health_status: patientData.current_health_status || '',
            notes: patientData.notes || '',
            occupation: patientData.occupation || '',
            hobbies: patientData.hobbies || '',
            avatar: patientData.avatar || ''
        }));
        const av = patientData.avatar;
        setAvatarPreview(av ? resolveAvatarUrl(av) : '');
    };

    const fetchPatientProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/patient/profile');
            if (res.data && res.data.patient) {
                applyPatientPayload(res.data.patient);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('❌ Lỗi tải thông tin hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleIdNumberChange = (e) => {
        const raw = digitsOnly(e.target.value);
        const next = raw.slice(0, 12);
        setFieldErrors((prev) => ({ ...prev, id_number: undefined }));
        setFormData((prev) => ({ ...prev, id_number: next }));
    };

    const handleIdDocTypeChange = (e) => {
        const v = e.target.value;
        setFieldErrors((prev) => ({ ...prev, id_number: undefined, id_document_type: undefined }));
        setFormData((prev) => ({
            ...prev,
            id_document_type: v,
            id_number: v ? digitsOnly(prev.id_number).slice(0, 12) : ''
        }));
    };

    const handleBhytChange = (e) => {
        let v = String(e.target.value).replace(/\s/g, '').toUpperCase();
        v = v.replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setFieldErrors((prev) => ({ ...prev, health_insurance_code: undefined }));
        setFormData((prev) => ({ ...prev, health_insurance_code: v }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setFormData((prevData) => ({
                    ...prevData,
                    avatar: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const runClientValidation = () => {
        const err = {};
        const idVal = validateIdDoc(formData.id_document_type, formData.id_number);
        if (!idVal.ok) err.id_number = idVal.message;

        const bh = formData.health_insurance_code.trim();
        if (bh && !BHYT_REGEX.test(bh)) {
            err.health_insurance_code = 'Mã BHYT không hợp lệ';
        }
        return err;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = runClientValidation();
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            const first = Object.values(errs)[0];
            if (first) toast.error(first);
            return;
        }
        setFieldErrors({});

        try {
            setSubmitting(true);
            const formDataToSend = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key !== 'avatar') {
                    let val = formData[key];
                    if (key === 'health_insurance_code' && typeof val === 'string') {
                        val = val.trim().toUpperCase();
                    }
                    if (key === 'id_number' && val !== undefined && val !== null) {
                        val = digitsOnly(val);
                    }
                    formDataToSend.append(key, val ?? '');
                }
            });

            if (formData.avatar instanceof File) {
                formDataToSend.append('avatar', formData.avatar);
            }

            const res = await api.put('/api/patient/profile', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('✅ Cập nhật hồ sơ thành công!');
            setIsEditMode(false);
            if (res.data?.patient) {
                applyPatientPayload(res.data.patient);
            } else {
                await fetchPatientProfile();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Không thể cập nhật hồ sơ';
            toast.error('❌ Lỗi: ' + errorMsg);
            console.error('Error updating profile:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const tabs = [
        { id: 'basicInfo', label: '📋 Thông Tin Cơ Bản' },
        { id: 'emergency', label: '🚨 Liên Hệ Khẩn Cấp' },
        { id: 'medical', label: '🏥 Thông Tin Y Tế' }
    ];

    const avatarSrc =
        resolveAvatarUrl(avatarPreview) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=667eea&color=fff`;

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner-dot"></div>
                <p>⏳ Đang tải hồ sơ...</p>
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="profile-card">
                {isEditMode ? (
                    <div className="edit-mode-banner">
                        <i className="fas fa-edit"></i>
                        <span>Đang chỉnh sửa - Bấm "Lưu Thông Tin" để cập nhật</span>
                    </div>
                ) : (
                    <div className="readonly-mode-banner">
                        <i className="fas fa-eye"></i>
                        <span>Chế độ xem - Bấm "Chỉnh Sửa" để chỉnh sửa thông tin</span>
                    </div>
                )}

                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <div className="avatar-container">
                            <img src={avatarSrc} alt="Ảnh đại diện" className="profile-avatar" />
                        </div>
                        {isEditMode && (
                            <label className="avatar-upload-label">
                                <i className="fas fa-camera"></i>
                                <span>Tải ảnh đại diện</span>
                                <input
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    className="file-input"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    disabled={!isEditMode}
                                />
                                <small className="file-hint">JPG, PNG hoặc GIF (Max 5MB)</small>
                            </label>
                        )}
                    </div>

                    <div className="profile-info-header">
                        <h2 className="profile-name">{formData.full_name || 'Người Dùng'}</h2>
                        <p className="profile-email">{formData.email || 'email@example.com'}</p>
                    </div>

                    <div className="profile-actions">
                        <button
                            type="button"
                            className={`edit-btn ${isEditMode ? 'cancel' : 'edit'}`}
                            onClick={() => {
                                if (isEditMode) {
                                    fetchPatientProfile();
                                    setFieldErrors({});
                                }
                                setIsEditMode(!isEditMode);
                            }}
                        >
                            <i className={`fas fa-${isEditMode ? 'times' : 'edit'}`}></i>
                            <span>{isEditMode ? ' Hủy' : ' Chỉnh Sửa'}</span>
                        </button>
                    </div>
                </div>

                <form className="patient-profile-form" onSubmit={handleSubmit}>
                    <div className="tabs-container">
                        <div className="tabs-nav">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="tab-content">
                            {activeTab === 'basicInfo' && (
                                <BasicInfoSection
                                    formData={formData}
                                    isEditMode={isEditMode}
                                    handleChange={handleChange}
                                />
                            )}

                            {activeTab === 'emergency' && (
                                <EmergencyContactSection
                                    formData={formData}
                                    isEditMode={isEditMode}
                                    handleChange={handleChange}
                                />
                            )}

                            {activeTab === 'medical' && (
                                <MedicalInfoSection
                                    formData={formData}
                                    isEditMode={isEditMode}
                                    fieldErrors={fieldErrors}
                                    handleChange={handleChange}
                                    handleIdNumberChange={handleIdNumberChange}
                                    handleIdDocTypeChange={handleIdDocTypeChange}
                                    handleBhytChange={handleBhytChange}
                                />
                            )}
                        </div>
                    </div>

                    {isEditMode && (
                        <div className="form-submit-section">
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? '⏳ Đang cập nhật...' : '💾 Lưu Thông Tin'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
