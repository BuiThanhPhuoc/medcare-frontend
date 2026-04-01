import { useState, useEffect } from 'react';
import './NotificationCenter.css';

/**
 * NotificationCenter - In-app notification toasts
 * Hiển thị các thông báo ở góc phải trên cùng
 */
const NotificationCenter = ({ notifications = [], onRemove }) => {
    return (
        <div className="notification-center">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`notification-toast notification-${notif.type}`}
                    style={{
                        animation: `slideIn 0.3s ease-out`
                    }}
                >
                    <div className="notification-content">
                        <div className="notification-icon">
                            {notif.type === 'new-patient' && <i className="fas fa-user-plus"></i>}
                            {notif.type === 'prescription' && <i className="fas fa-pills"></i>}
                            {notif.type === 'payment' && <i className="fas fa-check-circle"></i>}
                            {notif.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                            {notif.type === 'info' && <i className="fas fa-info-circle"></i>}
                        </div>
                        <div className="notification-body">
                            <h6 className="notification-title">{notif.title}</h6>
                            <p className="notification-message">{notif.message}</p>
                            <small className="notification-time">
                                {new Date(notif.timestamp).toLocaleTimeString('vi-VN')}
                            </small>
                        </div>
                        <button
                            className="notification-close"
                            onClick={() => onRemove(notif.id)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="notification-progress"></div>
                </div>
            ))}
        </div>
    );
};

export default NotificationCenter;
