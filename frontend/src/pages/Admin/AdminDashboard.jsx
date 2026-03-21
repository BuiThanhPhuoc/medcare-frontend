import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();

    return (
        <div className="admin-dashboard">
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.totalRevenue')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">45,000,000 ₫</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-success border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.newPatients')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">128</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-warning border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.pendingAppointments')}</div>
                            <div className="h3 mb-0 fw-bold text-dark">24</div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm border-start border-danger border-4 h-100">
                        <div className="card-body">
                            <div className="text-muted small fw-bold text-uppercase mb-1">{t('admin.inventoryWarning')}</div>
                            <div className="h3 mb-0 fw-bold text-danger">5 {t('admin.medicines')}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">{t('admin.shortcuts')}</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/admin/medicines" className="btn btn-outline-primary px-4 py-3">
                                    <i className="fas fa-pills mb-2 fs-4 d-block"></i> {t('admin.manageMedicines')}
                                </Link>
                                <Link to="/admin/doctors" className="btn btn-outline-success px-4 py-3">
                                    <i className="fas fa-user-md mb-2 fs-4 d-block"></i> {t('admin.manageDoctors')}
                                </Link>
                                <Link to="/admin/specialties" className="btn btn-outline-info px-4 py-3">
                                    <i className="fas fa-stethoscope mb-2 fs-4 d-block"></i> {t('admin.specialties')}
                                </Link>
                                <Link to="/admin/posts" className="btn btn-outline-secondary px-4 py-3">
                                    <i className="fas fa-newspaper mb-2 fs-4 d-block"></i> {t('admin.managePosts')}
                                </Link>
                                <Link to="/admin/schedules" className="btn btn-outline-danger px-4 py-3">
                                    <i className="fas fa-calendar-check mb-2 fs-4 d-block"></i> {t('admin.approveSchedules')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
