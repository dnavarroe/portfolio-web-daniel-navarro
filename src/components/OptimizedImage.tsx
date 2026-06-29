import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({ 
  src, 
  alt, 
  sizes = '100vw',
  className,
  loading = 'lazy'
}: OptimizedImageProps) {
  const placeholderSrc = '/content/images/placeholder.jpg';
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  const getWebpSrc = (originalSrc: string): string => {
    if (originalSrc.endsWith('.webp')) return originalSrc;
    return originalSrc.replace(/\.(jpe?g|png)$/i, '.webp');
  };

  const handleError = () => {
    if (imgSrc === placeholderSrc) return;
    setImgSrc(placeholderSrc);
    setHasError(true);
  };
  
  return (
    <picture>
      {!hasError && <source srcSet={getWebpSrc(src)} type="image/webp" />}
      <img 
        src={imgSrc}
        alt={alt}
        sizes={sizes}
        className={className}
        loading={loading}
        onError={handleError}
      />
    </picture>
  );
}
