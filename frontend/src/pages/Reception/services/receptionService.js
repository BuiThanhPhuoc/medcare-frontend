import api from '../../../lib/api';

/**
 * Reception Service - API calls for reception dashboard
 */

export const receptionService = {
  /**
   * Get reception statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/reception/stats');
      return response.data?.data || {
        todayAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        totalRevenue: 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        todayAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        totalRevenue: 0
      };
    }
  },

  /**
   * Get reception's personal schedule
   */
  getMySchedule: async () => {
    try {
      const response = await api.get('/api/reception/my-schedule');
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return [];
    }
  }
};
