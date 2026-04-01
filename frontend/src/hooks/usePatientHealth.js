import { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from 'react-toastify';

/**
 * Hook để lấy thông tin sức khỏe của bệnh nhân
 * @returns {Object} { healthData, loading, error }
 */
export const usePatientHealth = () => {
    const [healthData, setHealthData] = useState({
        height: null,
        weight: null,
        blood_type: null,
        bmi: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHealthData();
    }, []);

    const fetchHealthData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/patient/profile');
            const patient = response.data.patient;

            // Tính BMI tự động
            let bmi = null;
            if (patient.height && patient.weight) {
                const heightInMeters = patient.height / 100;
                bmi = (patient.weight / (heightInMeters * heightInMeters)).toFixed(1);
            }

            setHealthData({
                height: patient.height || null,
                weight: patient.weight || null,
                blood_type: patient.blood_type || 'Chưa cập nhật',
                bmi: bmi
            });

            setError(null);
        } catch (err) {
            console.error('Lỗi lấy dữ liệu sức khỏe:', err);
            setError(err.response?.data?.message || 'Lỗi khi lấy dữ liệu sức khỏe');
        } finally {
            setLoading(false);
        }
    };

    const getBMIStatus = (bmi) => {
        if (!bmi) return { status: '', color: 'gray' };
        if (bmi < 18.5) return { status: 'Nhẹ hơn bình thường', color: '#3498db' };
        if (bmi < 25) return { status: 'Bình thường', color: '#2ecc71' };
        if (bmi < 30) return { status: 'Thừa cân', color: '#f39c12' };
        return { status: 'Béo phì', color: '#e74c3c' };
    };

    return { healthData, loading, error, getBMIStatus };
};
