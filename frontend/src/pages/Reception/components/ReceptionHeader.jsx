import { Link } from 'react-router-dom';
import '../CSS/Reception.css';

/**
 * ReceptionHeader Component
 * Header chính với:
 * - Chào mừng user
 * - Đồng hồ thời gian
 * - Nút đăng xuất
 * - Quick action links
 */
const ReceptionHeader = ({ user, currentTime, onLogout }) => {
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('vi-VN', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        }).format(date);
    };

    return (
        <>
            {/* Welcome Section + Time + Logout */}
            <div className="reception-header mb-4">
                <div className="header-left">
                    <h2>👋 Xin chào, {user.username}!</h2>
                    <p>Lễ Tân / Thu Ngân • {formatDate(currentTime)}</p>
                </div>
                <div className="header-right">
                    <div className="time-display">
                        <div className="time-text text-coral">
                            {currentTime.toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </div>
                        <div className="date-text">Thời gian hiện tại</div>
                    </div>
                    <button 
                        onClick={onLogout} 
                        className="btn-soft-logout text-coral" 
                        title="Đăng xuất"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            {/* Quick Actions Bar sẽ được render riêng trong ReceptionDashboard */}
        </>
    );
};

export default ReceptionHeader;