/**
 * Mock data cho Reception Dashboard
 * Tương đương thiết kế Laravel
 */

export const MOCK_STATS = {
    todayShifts: 1,
    weeklyShifts: 5,
    status: 'Hoạt động',
    totalHours: 40
};

export const MOCK_PERSONAL_INFO = {
    fullName: 'Nhân viên',
    position: 'Lễ Tân / Thu Ngân',
    email: 'letan@medcare.vn',
    phone: '0912 345 678'
};

export const MOCK_TODAY_SHIFTS = [
    {
        id: 1,
        startTime: '07:00',
        endTime: '15:00',
        note: 'Ca hành chính'
    }
];

export const MOCK_WEEKLY_SCHEDULE = [
    {
        id: 1,
        dayLabel: 'Hôm nay',
        dayOfWeek: 'today', // use currentTime to get
        startTime: '07:00',
        endTime: '15:00',
        note: 'Ca sáng'
    },
    {
        id: 2,
        dayLabel: 'Ngày mai',
        dayOfWeek: 'Thứ Sáu',
        startTime: '14:00',
        endTime: '22:00',
        note: 'Ca chiều'
    }
];

/**
 * Quick actions (navigation links)
 */
export const QUICK_ACTIONS = [
    {
        id: 1,
        label: 'Check-in Bệnh nhân',
        icon: 'fas fa-user-check',
        path: '/reception',
        className: 'soft-btn btn-coral-soft'
    },
    {
        id: 2,
        label: 'Quầy Thu ngân',
        icon: 'fas fa-file-invoice-dollar',
        path: '/billing',
        className: 'soft-btn btn-outline-soft'
    }
];
