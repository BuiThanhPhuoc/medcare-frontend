import { Link } from 'react-router-dom';
import '../ReceptionDashboard.css';

/**
 * Quick Actions Bar Component
 * Hiển thị các action nhanh chóng cho lễ tân
 */
const QuickActionsBar = ({ actions, onQuickCheckIn }) => {
    const handleActionClick = (action) => {
        // Nếu là Check-in, mở Modal thay vì navigate
        if (action.id === 1 && onQuickCheckIn) {
            onQuickCheckIn();
        }
    };

    return (
        <div className="quick-actions-bar mb-4">
            <div className="action-label">
                <i className="fas fa-bolt text-coral"></i> <strong>Thao tác nhanh:</strong>
            </div>
            {actions.map((action) => (
                action.id === 1 ? (
                    // Check-in Button - Open Modal
                    <button 
                        key={action.id}
                        className={action.className}
                        onClick={() => handleActionClick(action)}
                        title="Mở tìm kiếm check-in nhanh"
                    >
                        <i className={action.icon}></i> {action.label}
                    </button>
                ) : (
                    // Other buttons - Navigate
                    <Link 
                        key={action.id}
                        to={action.path} 
                        className={action.className}
                    >
                        <i className={action.icon}></i> {action.label}
                    </Link>
                )
            ))}
        </div>
    );
};

export default QuickActionsBar;
