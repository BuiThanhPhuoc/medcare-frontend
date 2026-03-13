import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
    return (
        <div className="admin-dashboard">
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">Tổng Doanh Thu</div>
                            <div className="h3 mb-0 fw-bold text-dark">45,000,000 ₫</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-success border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">Bệnh Nhân Mới</div>
                            <div className="h3 mb-0 fw-bold text-dark">128</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-warning border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">Lịch Khám Chờ</div>
                            <div className="h3 mb-0 fw-bold text-dark">24</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-danger border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">Cảnh báo Tồn Kho</div>
                            <div className="h3 mb-0 fw-bold text-danger">5 Thuốc</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">Lối tắt quản trị</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/admin" className="btn btn-outline-primary px-4 py-3">
                                    <i className="fas fa-pills mb-2 fs-4 d-block"></i> Quản lý Thuốc
                                </Link>
                                <Link to="/admin/doctors" className="btn btn-outline-success px-4 py-3">
                                    <i className="fas fa-user-md mb-2 fs-4 d-block"></i> Quản lý Bác sĩ
                                </Link>
                                <Link to="/admin/posts" className="btn btn-outline-secondary px-4 py-3">
                                    <i className="fas fa-newspaper mb-2 fs-4 d-block"></i> Quản lý Bài Viết
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;