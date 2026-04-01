const BasicInfoSection = ({ formData, isEditMode, handleChange }) => {
    return (
        <div className="form-content">
            <div className="form-group">
                <label className="form-label">Tên Đăng Nhập</label>
                <input
                    type="text"
                    name="username"
                    className="form-control readonly-input"
                    value={formData.username}
                    disabled
                />
                <small className="text-muted">Không thể thay đổi</small>
            </div>

            <div className="form-group">
                <label className="form-label">Họ và Tên *</label>
                <input
                    type="text"
                    name="full_name"
                    className="form-control"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập họ và tên"
                    disabled={!isEditMode}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Nhập email"
                        disabled={!isEditMode}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Số Điện Thoại *</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Nhập số điện thoại"
                        disabled={!isEditMode}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Ngày Sinh</label>
                    <input
                        type="date"
                        name="date_of_birth"
                        className="form-control"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        disabled={!isEditMode}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Giới Tính</label>
                    <select
                        name="gender"
                        className="form-control"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={!isEditMode}
                    >
                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Địa Chỉ</label>
                    <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                        disabled={!isEditMode}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Nghề Nghiệp</label>
                    <input
                        type="text"
                        name="occupation"
                        className="form-control"
                        value={formData.occupation}
                        onChange={handleChange}
                        placeholder="Nhập nghề nghiệp"
                        disabled={!isEditMode}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Sở Thích</label>
                    <input
                        type="text"
                        name="hobbies"
                        className="form-control"
                        value={formData.hobbies}
                        onChange={handleChange}
                        placeholder="Nhập sở thích"
                        disabled={!isEditMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfoSection;
