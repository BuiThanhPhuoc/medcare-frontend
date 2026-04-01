import { useState } from 'react';

/**
 * ImageWithFallback - Hiển thị ảnh với fallback image
 * 
 * Props:
 * - src: (string) URLs ảnh chính
 * - fallback: (string, optional) URL ảnh fallback (mặc định: MedCare logo)
 * - alt: (string) Text thay thế
 * - className: (string, optional) CSS class
 * - style: (object, optional) Inline styles
 * - width: (string/number, optional) Chiều rộng
 * - height: (string/number, optional) Chiều cao
 */
export const ImageWithFallback = ({ 
    src, 
    alt = 'Image',
    fallback = 'https://via.placeholder.com/400x300?text=MedCare',
    className = '',
    style = {},
    width,
    height,
    onError,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleError = (e) => {
        console.warn(`⚠️ Image failed to load: ${src}`);
        setHasError(true);
        setImgSrc(fallback);
        if (onError) onError(e);
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    const imgStyle = {
        ...style,
        width: width || 'auto',
        height: height || 'auto',
        objectFit: 'cover'
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        borderRadius: 'inherit'
                    }}
                >
                    <div style={{
                        color: '#999',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        <i className="fas fa-image" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}></i>
                        Đang tải...
                    </div>
                </div>
            )}
            <img
                src={imgSrc}
                alt={alt}
                onError={handleError}
                onLoad={handleLoad}
                style={imgStyle}
                className={className}
                {...props}
            />
            {hasError && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        zIndex: 2
                    }}
                    title="Failed to load image"
                >
                    <i className="fas fa-exclamation-triangle"></i>
                </div>
            )}
        </div>
    );
};

export default ImageWithFallback;
