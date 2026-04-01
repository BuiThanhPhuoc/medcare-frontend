/**
 * useExport Hook
 * Xử lý export dữ liệu ra Excel/PDF từ frontend
 */

import { useState } from 'react';
import api from '../lib/api';

export const useExport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Tải file từ API endpoint
     * @param {String} url - API endpoint (e.g., '/export/doctors/excel')
     * @param {String} filename - Tên file gợi ý (e.g., 'doctors.xlsx')
     * @param {String} mimeType - MIME type của file
     */
    const downloadFile = async (url, filename, mimeType = 'application/octet-stream') => {
        try {
            setLoading(true);
            setError(null);

            // Fetch file với responseType blob
            const response = await api.get(url, {
                responseType: 'blob'
            });

            // Tạo blob từ response
            const blob = new Blob([response.data], { type: mimeType });

            // Tạo temporary link và click để tải
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'export';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            window.URL.revokeObjectURL(blobUrl);

            console.log('✅ Tải thành công:', filename);
            return true;

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Lỗi tải file';
            setError(errorMsg);
            console.error('❌ Export error:', errorMsg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Export Bác sĩ ra Excel
     */
    const exportDoctorsExcel = () => {
        return downloadFile(
            '/export/doctors/excel',
            `Danh_sach_bac_si_${new Date().toISOString().split('T')[0]}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    };

    /**
     * Export Bác sĩ ra PDF
     */
    const exportDoctorsPDF = () => {
        return downloadFile(
            '/export/doctors/pdf',
            `Danh_sach_bac_si_${new Date().toISOString().split('T')[0]}.pdf`,
            'application/pdf'
        );
    };

    /**
     * Export Bệnh nhân ra Excel
     */
    const exportPatientsExcel = () => {
        return downloadFile(
            '/export/patients/excel',
            `Danh_sach_benh_nhan_${new Date().toISOString().split('T')[0]}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    };

    /**
     * Export Bệnh nhân ra PDF
     */
    const exportPatientsPDF = () => {
        return downloadFile(
            '/export/patients/pdf',
            `Danh_sach_benh_nhan_${new Date().toISOString().split('T')[0]}.pdf`,
            'application/pdf'
        );
    };

    /**
     * Export Lịch khám ra Excel
     */
    const exportAppointmentsExcel = () => {
        return downloadFile(
            '/export/appointments/excel',
            `Danh_sach_lich_kham_${new Date().toISOString().split('T')[0]}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    };

    /**
     * Export Thuốc ra Excel
     */
    const exportMedicinesExcel = () => {
        return downloadFile(
            '/export/medicines/excel',
            `Danh_sach_thuoc_${new Date().toISOString().split('T')[0]}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    };

    /**
     * Export Doanh thu ra Excel
     * @param {String} startDate - Ngày bắt đầu (YYYY-MM-DD)
     * @param {String} endDate - Ngày kết thúc (YYYY-MM-DD)
     */
    const exportRevenueExcel = (startDate, endDate) => {
        let url = '/export/revenue/excel';
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        return downloadFile(
            url,
            `Bao_cao_doanh_thu_${startDate || 'all'}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
    };

    return {
        loading,
        error,
        downloadFile,
        exportDoctorsExcel,
        exportDoctorsPDF,
        exportPatientsExcel,
        exportPatientsPDF,
        exportAppointmentsExcel,
        exportMedicinesExcel,
        exportRevenueExcel
    };
};

export default useExport;
