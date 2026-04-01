import '../ReceptionDashboard.css';

/**
 * PersonalInfo Component
 * Hiển thị thông tin cá nhân của nhân viên lễ tân
 */
const PersonalInfo = ({ personalInfo }) => {
    return (
        <div className="soft-panel">
            <div className="panel-header">
                <h5><i className="fas fa-id-badge text-emerald me-2"></i> Thông tin cá nhân</h5>
            </div>
            <div className="panel-body">
                <div className="personal-info-grid">
                    {/* Họ tên */}
                    <div className="info-box">
                        <i className="fas fa-user-circle text-blue fs-3"></i>
                        <div>
                            <small className="text-muted d-block">Họ tên</small>
                            <strong>{personalInfo.fullName}</strong>
                        </div>
                    </div>

                    {/* Chức vụ */}
                    <div className="info-box">
                        <i className="fas fa-briefcase text-emerald fs-3"></i>
                        <div>
                            <small className="text-muted d-block">Chức vụ</small>
                            <strong>{personalInfo.position}</strong>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="info-box">
                        <i className="fas fa-envelope text-purple fs-3"></i>
                        <div>
                            <small className="text-muted d-block">Email</small>
                            <strong>{personalInfo.email}</strong>
                        </div>
                    </div>

                    {/* Điện thoại */}
                    <div className="info-box">
                        <i className="fas fa-phone-alt text-amber fs-3"></i>
                        <div>
                            <small className="text-muted d-block">Điện thoại</small>
                            <strong>{personalInfo.phone}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;