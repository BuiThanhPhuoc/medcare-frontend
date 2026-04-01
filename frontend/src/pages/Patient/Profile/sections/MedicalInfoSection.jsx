import { useMemo } from 'react';

const BHYT_REGEX = /^[A-Z]{2}\d{8}$/;

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

const MedicalInfoSection = ({
    formData,
    isEditMode,
    fieldErrors,
    handleChange,
    handleIdNumberChange,
    handleIdDocTypeChange,
    handleBhytChange
}) => {
    const bmi = useMemo(() => {
        const h = parseFloat(formData.height);
        const w = parseFloat(formData.weight);
        if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
        const m = h / 100;
        const v = w / (m * m);
        return Math.round(v * 10) / 10;
    }, [formData.height, formData.weight]);

    return (
        <div className="form-content">
            <div className="form-group">
                <label className="form-label">Nhóm Máu</label>
                <select
                    name="blood_type"
                    className="form-control"
                    value={formData.blood_type}
                    onChange={handleChange}
                    disabled={!isEditMode}
                >
                    <option value="">Chưa cập nhật</option>
                    <option value="O">O</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Chiều Cao (cm)</label>
                    <input
                        type="number"
                        name="height"
                        className="form-control"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Ví dụ: 170"
                        min="0"
                        step="0.1"
                        disabled={!isEditMode}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Cân Nặng (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        className="form-control"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Ví dụ: 65"
                        min="0"
                        step="0.1"
                        disabled={!isEditMode}
                    />
                </div>
            </div>

            {bmi != null && (
                <div className="bmi-display" role="status">
                    <span className="bmi-label">BMI (tự động)</span>
                    <strong className="bmi-value">{bmi}</strong>
                    <span className="bmi-hint">kg/m² — tính từ chiều cao &amp; cân nặng</span>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Tiền Sử Bệnh</label>
                <textarea
                    name="medical_history"
                    className="form-control"
                    rows="3"
                    value={formData.medical_history}
                    onChange={handleChange}
                    placeholder="Nhập tiền sử bệnh (nếu có)"
                    disabled={!isEditMode}
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">Dị Ứng</label>
                <textarea
                    name="allergies"
                    className="form-control"
                    rows="3"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Nhập dị ứng (nếu có)"
                    disabled={!isEditMode}
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">Tình Trạng Sức Khỏe Hiện Tại</label>
                <textarea
                    name="current_health_status"
                    className="form-control"
                    rows="3"
                    value={formData.current_health_status}
                    onChange={handleChange}
                    placeholder="Nhập tình trạng sức khỏe hiện tại"
                    disabled={!isEditMode}
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">Ghi Chú Khác</label>
                <textarea
                    name="notes"
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm (nếu có)"
                    disabled={!isEditMode}
                ></textarea>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Loại giấy tờ</label>
                    {isEditMode ? (
                        <select
                            name="id_document_type"
                            className={`form-control ${fieldErrors.id_document_type ? 'input-invalid' : ''}`}
                            value={formData.id_document_type}
                            onChange={handleIdDocTypeChange}
                        >
                            <option value="">-- Chọn --</option>
                            <option value="CMND">CMND</option>
                            <option value="CCCD">CCCD</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            className="form-control readonly-input"
                            value={formData.id_document_type || '—'}
                            disabled
                        />
                    )}
                </div>
                <div className="form-group">
                    <label className="form-label">Số CCCD/CMND</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        name="id_number"
                        className={`form-control ${fieldErrors.id_number ? 'input-invalid' : ''}`}
                        value={
                            isEditMode
                                ? formData.id_number
                                : maskIdDigits(formData.id_number)
                        }
                        onChange={handleIdNumberChange}
                        placeholder={
                            formData.id_document_type === 'CCCD'
                                ? '12 chữ số'
                                : formData.id_document_type === 'CMND'
                                  ? '9 hoặc 12 chữ số'
                                  : 'Chọn loại giấy tờ trước'
                        }
                        readOnly={!isEditMode}
                        disabled={!isEditMode}
                    />
                    {fieldErrors.id_number && (
                        <small className="field-error">{fieldErrors.id_number}</small>
                    )}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Mã BHYT</label>
                    <input
                        type="text"
                        name="health_insurance_code"
                        className={`form-control ${fieldErrors.health_insurance_code ? 'input-invalid' : ''}`}
                        value={
                            isEditMode
                                ? formData.health_insurance_code
                                : maskBhyt(formData.health_insurance_code)
                        }
                        onChange={handleBhytChange}
                        placeholder="VD: DN12345678"
                        readOnly={!isEditMode}
                        disabled={!isEditMode}
                        maxLength={10}
                    />
                    {fieldErrors.health_insurance_code && (
                        <small className="field-error">{fieldErrors.health_insurance_code}</small>
                    )}
                    {isEditMode && (
                        <small className="text-muted">10 ký tự: 2 chữ cái (mã đối tượng) + 8 số</small>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalInfoSection;
