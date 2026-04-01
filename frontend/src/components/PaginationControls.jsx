/**
 * PaginationControls Component
 * Điều khiển phân trang cho bảng dữ liệu
 */

import React from 'react';
import '../styles/PaginationControls.css';

const PaginationControls = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    pageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50, 100],
    showPageSizeSelector = true,
    totalItems = 0
}) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    // Tạo mảng số trang để hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Số trang tối đa hiển thị
        const halfVisible = Math.floor(maxVisible / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        if (endPage - startPage < maxVisible - 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisible - 1);
            } else {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="pagination-controls">
            <div className="pagination-left">
                {totalItems > 0 && (
                    <span className="item-count">
                        Hiển thị {startItem}-{endItem} trong {totalItems} mục
                    </span>
                )}

                {showPageSizeSelector && (
                    <div className="page-size-selector">
                        <label>Mục trên trang:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                            className="page-size-select"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="pagination-center">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="pagination-btn prev-btn"
                    title="Trang trước"
                >
                    ← Trước
                </button>

                <div className="page-numbers">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (typeof page === 'number') {
                                    handlePageClick(page);
                                }
                            }}
                            className={`page-number ${
                                page === currentPage ? 'active' : ''
                            } ${page === '...' ? 'ellipsis' : ''}`}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="pagination-btn next-btn"
                    title="Trang sau"
                >
                    Sau →
                </button>
            </div>

            <div className="pagination-right">
                <span className="page-info">
                    Trang {currentPage} / {totalPages}
                </span>
            </div>
        </div>
    );
};

export default PaginationControls;
