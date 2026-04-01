import { useState, useEffect, useCallback } from 'react';

/**
 * useNotificationSystem - Hook for real-time notifications
 * Cung cấp các method để hiện thông báo desktop
 */
export const useNotificationSystem = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Kiểm tra browser support
        const supported = 'Notification' in window;
        setIsSupported(supported);

        if (supported) {
            // Kiểm tra permission
            setIsEnabled(Notification.permission === 'granted');
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!isSupported) return false;

        try {
            const permission = await Notification.requestPermission();
            setIsEnabled(permission === 'granted');
            return permission === 'granted';
        } catch (error) {
            console.error('Lỗi request notification permission:', error);
            return false;
        }
    }, [isSupported]);

    const showNotification = useCallback((title, options = {}) => {
        if (!isSupported || !isEnabled) {
            console.log('[Notification]', title, options);
            return null;
        }

        try {
            const notification = new Notification(title, {
                icon: '/logo.png',
                tag: options.tag || 'medcare',
                ...options
            });

            // Auto close sau 5 giây
            if (!options.requiresInteraction) {
                setTimeout(() => notification.close(), 5000);
            }

            return notification;
        } catch (error) {
            console.error('Lỗi show notification:', error);
            return null;
        }
    }, [isSupported, isEnabled]);

    const notifyNewPatient = useCallback((patientName, specialty) => {
        playNotificationSound();
        return showNotification('🎉 Bệnh nhân mới đặt lịch', {
            body: `${patientName} - ${specialty}`,
            tag: 'new-patient',
            requiresInteraction: true
        });
    }, [showNotification]);

    const notifyPrescriptionReady = useCallback((patientName) => {
        playNotificationSound();
        return showNotification('💊 Đơn thuốc sẵn sàng', {
            body: `${patientName} - Vui lòng gọi bệnh nhân đến quầy thanh toán`,
            tag: 'prescription-ready',
            requiresInteraction: true
        });
    }, [showNotification]);

    const notifyPaymentComplete = useCallback((patientName, amount) => {
        playNotificationSound();
        return showNotification('✅ Thanh toán hoàn tất', {
            body: `${patientName} - ${Number(amount).toLocaleString('vi-VN')} VNĐ`,
            tag: 'payment-complete'
        });
    }, [showNotification]);

    const notifyAppointmentCancelled = useCallback((patientName) => {
        playNotificationSound();
        return showNotification('⚠️ Lịch khám bị huỷ', {
            body: `${patientName} - Vui lòng cập nhật danh sách`,
            tag: 'appointment-cancelled',
            requiresInteraction: true
        });
    }, [showNotification]);

    return {
        isSupported,
        isEnabled,
        requestPermission,
        showNotification,
        notifyNewPatient,
        notifyPrescriptionReady,
        notifyPaymentComplete,
        notifyAppointmentCancelled
    };
};

/**
 * Phát âm thanh chuông thông báo
 */
const playNotificationSound = () => {
    // Sử dụng Web Audio API để tạo âm thanh
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Chuông: 3 tiếng beep
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);

        oscillator.frequency.value = 900;
        oscillator.start(audioContext.currentTime + 0.15);
        oscillator.stop(audioContext.currentTime + 0.25);

        oscillator.frequency.value = 1000;
        oscillator.start(audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
        console.log('Không thể phát âm thanh:', error);
    }
};
