import { Link } from 'react-router-dom';
import '../CSS/Reception.css';

/**
 * Quick Actions Bar Component
 * Hiển thị các action nhanh chóng cho lễ tân
 */
const QuickActionsBar = ({ actions }) => {
    return (
        <div className="quick-actions-bar mb-4">
            <div className="action-label">
                <i className="fas fa-bolt text-coral"></i> <strong>Thao tác nhanh:</strong>
            </div>
            {actions.map((action) => (
                <Link 
                    key={action.id}
                    to={action.path} 
                    className={action.className}
                >
                    <i className={action.icon}></i> {action.label}
                </Link>
            ))}
        </div>
    );
};

export default QuickActionsBar;
