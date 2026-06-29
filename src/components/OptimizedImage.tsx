import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

const resolveImagePath = (path: string): string => {
  if (path.startsWith('/')) {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${path}`;
  }
  return path;
};

export function OptimizedImage({ 
  src, 
  alt, 
  sizes = '100vw',
  className,
  loading = 'lazy'
}: OptimizedImageProps) {
  const resolvedSrc = resolveImagePath(src);
  const resolvedPlaceholder = resolveImagePath('/content/images/placeholder.jpg');
  
  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [hasError, setHasError] = useState(false);
  
  const getWebpSrc = (originalSrc: string): string => {
    if (originalSrc.endsWith('.webp')) return originalSrc;
    return originalSrc.replace(/\.(jpe?g|png)$/i, '.webp');
  };

  const handleError = () => {
    if (imgSrc === resolvedPlaceholder) return;
    setImgSrc(resolvedPlaceholder);
    setHasError(true);
  };
  
  return (
    <picture>
      {!hasError && <source srcSet={getWebpSrc(resolvedSrc)} type="image/webp" />}
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
