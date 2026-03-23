// Export main component
export { default as ReceptionDashboard } from './ReceptionDashboard';

// Export components
export { default as ReceptionHeader } from './components/ReceptionHeader';
export { default as QuickActionsBar } from './components/QuickActionsBar';
export { default as QuickStats } from './components/QuickStats';
export { default as PersonalInfo } from './components/PersonalInfo';
export { TodayShifts, WeeklySchedule } from './components/ScheduleWidgets';

// Export hooks
export { useCurrentTime } from './hooks/useCurrentTime';
export { useReceptionUser } from './hooks/useReceptionUser';

// Export constants
export { 
    MOCK_STATS, 
    MOCK_PERSONAL_INFO, 
    MOCK_TODAY_SHIFTS, 
    MOCK_WEEKLY_SCHEDULE, 
    QUICK_ACTIONS 
} from './constants/mockData';

// Export services
export { receptionService } from './services/receptionService';
