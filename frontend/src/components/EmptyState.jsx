/**
 * EmptyState Component
 * Dùng để hiển thị trạng thái trống cho bảng, biểu đồ, danh sách
 * 
 * Props:
 * - icon: (string) Font Awesome icon class, ví dụ: "fas fa-chart-line"
 * - title: (string) Tiêu đề thông báo
 * - description: (string, optional) Mô tả thêm
 * - action: (React element, optional) Button/Link action
 */
export const EmptyState = ({ icon = 'fas fa-inbox', title = 'Không có dữ liệu', description, action, variant = 'default' }) => {
    const variants = {
        default: {
            iconColor: '#d1d5db',
            backgroundColor: 'transparent'
        },
        light: {
            iconColor: '#f3f4f6',
            backgroundColor: '#f9fafb'
        },
        info: {
            iconColor: '#dbeafe',
            backgroundColor: '#eff6ff'
        }
    };

    const style = variants[variant] || variants.default;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '2rem',
            backgroundColor: style.backgroundColor,
            borderRadius: '8px'
        }}>
            <i
                className={icon}
                style={{
                    fontSize: '2.5rem',
                    color: style.iconColor,
                    opacity: 0.6,
                    marginBottom: '0.5rem'
                }}
            />
            <h6 style={{
                margin: 0,
                color: '#6b7280',
                fontWeight: 600,
                fontSize: '0.95rem'
            }}>
                {title}
            </h6>
            {description && (
                <p style={{
                    margin: 0,
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    maxWidth: '300px'
                }}>
                    {description}
                </p>
            )}
            {action && (
                <div style={{ marginTop: '0.5rem' }}>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
