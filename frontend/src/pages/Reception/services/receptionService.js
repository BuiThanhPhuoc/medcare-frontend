import api from '../../../lib/api';

/**
 * Service để gọi API Reception
 * Sẵn sàng để thay thế mock data bằng dữ liệu thực từ backend
 */

export const receptionService = {
    /**
     * Lấy thống kê của nhân viên lễ tân
     * @param userId 
     * @returns Promise<stats>
     */
    async getStats(userId) {
        try {
            const response = await api.get(`/api/reception/stats/${userId}`);
            return response.data.stats;
        } catch (error) {
            console.error('Lỗi lấy statistics:', error);
            throw error;
        }
    },

    /**
     * Lấy thông tin cá nhân của nhân viên lễ tân
     * @param userId 
     * @returns Promise<personalInfo>
     */
    async getPersonalInfo(userId) {
        try {
            const response = await api.get(`/api/reception/personal-info/${userId}`);
            return response.data.personalInfo;
        } catch (error) {
            console.error('Lỗi lấy thông tin cá nhân:', error);
            throw error;
        }
    },

    /**
     * Lấy lịch ca làm việc hôm nay
     * @param userId 
     * @returns Promise<shifts>
     */
    async getTodayShifts(userId) {
        try {
            const response = await api.get(`/api/reception/shifts/today/${userId}`);
            return response.data.shifts;
        } catch (error) {
            console.error('Lỗi lấy lịch hôm nay:', error);
            throw error;
        }
    },

    /**
     * Lấy lịch làm việc tuần này
     * @param userId 
     * @returns Promise<schedule>
     */
    async getWeeklySchedule(userId) {
        try {
            const response = await api.get(`/api/reception/schedule/weekly/${userId}`);
            return response.data.schedule;
        } catch (error) {
            console.error('Lỗi lấy lịch tuần:', error);
            throw error;
        }
    },

    /**
     * Đăng xuất
     * @returns Promise
     */
    async logout() {
        try {
            await api.post('/api/logout');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            throw error;
        }
    }
};
