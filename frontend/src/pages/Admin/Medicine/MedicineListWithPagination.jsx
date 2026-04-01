/**
 * MedicineList with Pagination & Export
 * Danh sách thuốc với server-side pagination
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';
import PaginationControls from '../../../components/PaginationControls';
import ExportButton from '../../../components/ExportButton';
import usePagination from '../../../hooks/usePagination';
import useExport from '../../../hooks/useExport';
import EmptyState from '../../../components/EmptyState';

const MedicineListWithPagination = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const pagination = usePagination(1, 10);
    const { exportMedicinesExcel } = useExport();

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get('/api/admin/categories');
                setCategories(res.data.categories || []);
            } catch (error) {
                console.error('Lỗi tải loại thuốc:', error);
            }
        };
        loadCategories();
    }, []);

    // Load medicines with pagination
    useEffect(() => {
        const loadMedicines = async () => {
            try {
                setLoading(true);
                pagination.setLoading(true);

                // Build query params
                const params = new URLSearchParams({
                    page: pagination.page,
                    limit: pagination.limit
                });

                if (searchTerm) params.append('search', searchTerm);
                if (filterCategory) params.append('category', filterCategory);

                const res = await api.get(`/api/medicines?${params}`);
                
                // Support both response formats
                if (res.data.pagination) {
                    pagination.setData(res.data.data || []);
                    pagination.setTotal(res.data.pagination.total);
                } else {
                    pagination.setData(res.data.medicines || []);
                    pagination.setTotal((res.data.medicines || []).length);
                }

                pagination.setLoading(false);
            } catch (error) {
                console.error('Lỗi tải thuốc:', error);
                pagination.setError('Lỗi tải dữ liệu thuốc');
                pagination.setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        loadMedicines();
    }, [pagination.page, pagination.limit, searchTerm, filterCategory]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc muốn xóa thuốc ${name}?`)) return;
        try {
            await api.delete(`/api/medicines/${id}`);
            alert('Xóa thuốc thành công!');
            pagination.reset();
        } catch {
            alert('Lỗi khi xóa thuốc!');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        pagination.setPage(1);
    };

    const handleExcelClick = () => exportMedicinesExcel();

    const medicines = pagination.data || [];
    const isEmpty = medicines.length === 0 && !loading;

    const isLowStock = (medicine) => medicine.quantity_in_stock < 10;
    const isExpired = (medicine) => new Date(medicine.expiration_date) < new Date();

    return (
        <div className="container-fluid py-4">
            <div style={{ marginBottom: '20px' }}>
                <h2 className="mb-0 fw-bold">Danh sách Thuốc</h2>
                <p className="text-muted mb-0">Quản lý kho thuốc trong hệ thống</p>
            </div>

            <div className="card shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                {/* Filter Bar */}
                <div className="p-3 border-bottom bg-light">
                    <form className="row g-3" onSubmit={(e) => e.preventDefault()}>
                        <div className="col-md-5">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Tìm tên thuốc, liều lượng..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <select 
                                className="form-select"
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    pagination.setPage(1);
                                }}
                            >
                                <option value="">-- Tất cả loại thuốc --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 d-grid">
                            <button type="reset" className="btn btn-dark btn-sm">
                                <i className="fas fa-redo"></i> Làm mới
                            </button>
                        </div>
                    </form>
                </div>

                {/* Header with Actions */}
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 className="mb-0 fw-bold text-secondary">
                        Danh sách <span className="badge bg-primary ms-2">{pagination.total}</span>
                    </h5>
                    <div className="d-flex gap-2">
                        <ExportButton
                            onExcelClick={handleExcelClick}
                            onPdfClick={() => {}}
                            label="Xuất Excel"
                            showPdf={false}
                            showExcel={true}
                            size="sm"
                        />
                        <Link to="/admin/medicines/create" className="btn btn-primary btn-sm">
                            <i className="fas fa-plus"></i> Thêm mới
                        </Link>
                    </div>
                </div>

                {/* Table or Empty State */}
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : isEmpty ? (
                        <EmptyState
                            icon="💊"
                            title="Không có thuốc"
                            description="Chưa có thuốc nào trong kho. Hãy thêm thuốc mới để bắt đầu."
                            actionLabel="Thêm thuốc mới"
                            actionTo="/admin/medicines/create"
                        />
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                                        <th width="5%" className="text-center">ID</th>
                                        <th width="18%">Tên thuốc</th>
                                        <th width="12%">Liều lượng</th>
                                        <th width="10%">Loại</th>
                                        <th width="8%" className="text-center">Tồn kho</th>
                                        <th width="10%" className="text-right">Giá</th>
                                        <th width="12%">HSD</th>
                                        <th width="15%" className="text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicines.map((medicine) => (
                                        <tr key={medicine.medicine_id} className={isExpired(medicine) ? 'table-danger' : ''}>
                                            <td className="text-center">{medicine.medicine_id}</td>
                                            <td>
                                                <strong className="text-dark">{medicine.medicine_name}</strong>
                                                {isLowStock(medicine) && (
                                                    <span className="badge bg-warning ms-2" style={{ fontSize: '10px' }}>Tồn kho thấp</span>
                                                )}
                                                {isExpired(medicine) && (
                                                    <span className="badge bg-danger ms-2" style={{ fontSize: '10px' }}>Đã hết hạn</span>
                                                )}
                                            </td>
                                            <td>{medicine.dosage || 'N/A'}</td>
                                            <td><span className="badge bg-secondary">{medicine.category || 'N/A'}</span></td>
                                            <td className="text-center">
                                                <span className={isLowStock(medicine) ? 'text-danger fw-bold' : ''}>
                                                    {medicine.quantity_in_stock || 0}
                                                </span>
                                            </td>
                                            <td className="text-right">{medicine.price?.toLocaleString('vi-VN')} ₫</td>
                                            <td>{medicine.expiration_date ? new Date(medicine.expiration_date).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                            <td className="text-center">
                                                <Link to={`/admin/medicines/${medicine.medicine_id}/edit`} className="btn btn-sm btn-outline-primary me-1 mb-1" title="Sửa">
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(medicine.medicine_id, medicine.medicine_name)} 
                                                    className="btn btn-sm btn-outline-danger mb-1" 
                                                    title="Xóa"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!isEmpty && (
                    <PaginationControls
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={pagination.goToPage}
                        pageSize={pagination.limit}
                        onPageSizeChange={pagination.setPageSize}
                        totalItems={pagination.total}
                    />
                )}
            </div>
        </div>
    );
};

export default MedicineListWithPagination;
