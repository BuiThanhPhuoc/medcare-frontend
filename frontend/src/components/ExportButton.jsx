/**
 * ExportButton Component
 * Nút xuất dữ liệu ra Excel/PDF
 */

import React from 'react';
import useExport from '../hooks/useExport';
import '../styles/ExportButton.css';

const ExportButton = ({
    onExcelClick,
    onPdfClick,
    label = 'Xuất dữ liệu',
    showPdf = true,
    showExcel = true,
    variant = 'outline', // 'outline' | 'solid'
    size = 'md' // 'sm' | 'md' | 'lg'
}) => {
    const { loading } = useExport();

    const buttonClasses = `
        export-btn export-btn-${variant} export-btn-${size}
        ${loading ? 'loading' : ''}
    `;

    return (
        <div className="export-button-group">
            {showExcel && (
                <button
                    onClick={onExcelClick}
                    disabled={loading}
                    className={buttonClasses}
                    title="Xuất ra Excel"
                >
                    <span className="icon">📊</span>
                    <span className="label">{label}</span>
                    {loading && <span className="spinner">⏳</span>}
                </button>
            )}

            {showPdf && (
                <button
                    onClick={onPdfClick}
                    disabled={loading}
                    className={buttonClasses}
                    title="Xuất ra PDF"
                >
                    <span className="icon">📄</span>
                    <span className="label">{label}</span>
                    {loading && <span className="spinner">⏳</span>}
                </button>
            )}
        </div>
    );
};

export default ExportButton;
