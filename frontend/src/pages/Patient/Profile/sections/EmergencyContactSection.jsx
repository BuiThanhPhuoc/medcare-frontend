const EmergencyContactSection = ({ formData, isEditMode, handleChange }) => {
    return (
        <div className="form-content">
            <div className="form-group">
                <label className="form-label">Tên Liên Hệ</label>
                <input
                    type="text"
                    name="emergency_contact_name"
                    className="form-control"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="Nhập tên liên hệ"
                    disabled={!isEditMode}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Số Điện Thoại Liên Hệ</label>
                    <input
                        type="text"
                        name="emergency_contact_phone"
                        className="form-control"
                        value={formData.emergency_contact_phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        disabled={!isEditMode}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mối Quan Hệ</label>
                    <input
                        type="text"
                        name="emergency_contact_relationship"
                        className="form-control"
                        value={formData.emergency_contact_relationship}
                        onChange={handleChange}
                        placeholder="Ví dụ: Mẹ, Bố, Vợ..."
                        disabled={!isEditMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactSection;
