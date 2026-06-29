import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import fc from 'fast-check';
import { OptimizedImage } from './OptimizedImage';

describe('OptimizedImage - Unit Tests', () => {
  it('should render picture element with WebP source and JPEG fallback', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test image" />
    );
    
    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();
    
    const source = container.querySelector('source');
    expect(source).toBeInTheDocument();
    expect(source?.getAttribute('srcset')).toBe('/test.webp');
    expect(source?.getAttribute('type')).toBe('image/webp');
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toBe('/test.jpg');
  });
  
  it('should convert JPEG extension to WebP', () => {
    const { container } = render(
      <OptimizedImage src="/image.jpeg" alt="Test" />
    );
    
    const source = container.querySelector('source');
    expect(source?.getAttribute('srcset')).toBe('/image.webp');
  });
  
  it('should convert PNG extension to WebP', () => {
    const { container } = render(
      <OptimizedImage src="/image.png" alt="Test" />
    );
    
    const source = container.querySelector('source');
    expect(source?.getAttribute('srcset')).toBe('/image.webp');
  });
  
  it('should have lazy loading by default', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test" />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('lazy');
  });
  
  it('should support eager loading when specified', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test" loading="eager" />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('loading')).toBe('eager');
  });
  
  it('should require alt attribute', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Required alt text" />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Required alt text');
  });
  
  it('should apply custom className', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test" className="custom-class" />
    );
    
    const img = container.querySelector('img');
    expect(img?.className).toBe('custom-class');
  });
  
  it('should apply custom sizes attribute', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test" sizes="(max-width: 768px) 100vw, 50vw" />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('sizes')).toBe('(max-width: 768px) 100vw, 50vw');
  });
  
  it('should use default sizes of 100vw when not specified', () => {
    const { container } = render(
      <OptimizedImage src="/test.jpg" alt="Test" />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('sizes')).toBe('100vw');
  });
  
  it('should show placeholder image on error', () => {
    const { container } = render(
      <OptimizedImage src="/broken.jpg" alt="Test" />
    );
    
    const img = container.querySelector('img') as HTMLImageElement;
    
    // Simulate image load error
    fireEvent.error(img);
    
    expect(img.getAttribute('src')).toBe('/content/images/placeholder.jpg');
  });
  
  it('should remove WebP source on error', () => {
    const { container } = render(
      <OptimizedImage src="/broken.jpg" alt="Test" />
    );
    
    const img = container.querySelector('img') as HTMLImageElement;
    
    // Simulate image load error
    fireEvent.error(img);
    
    const source = container.querySelector('source');
    expect(source).not.toBeInTheDocument();
  });
});

describe('OptimizedImage - Property-Based Tests', () => {
  /**
   * **Validates: Requirements 12.2, 12.4, 13.1**
   * 
   * Property: For any valid image source, the component must render with:
   * - WebP source element with correct type
   * - Original format fallback
   * - Required alt attribute
   * - Lazy loading by default
   */
  it('Property: should render complete picture element for any image source', () => {
    fc.assert(
      fc.property(
        fc.record({
          filename: fc.string({ minLength: 1, maxLength: 50 }).filter(s => !s.includes('.')),
          extension: fc.constantFrom('jpg', 'jpeg', 'png'),
          path: fc.constantFrom('/', '/images/', '/content/images/'),
          alt: fc.string({ minLength: 1, maxLength: 200 })
        }),
        ({ filename, extension, path, alt }) => {
          const src = `${path}${filename}.${extension}`;
          const { container } = render(
            <OptimizedImage src={src} alt={alt} />
          );
          
          // Verify picture element exists
          const picture = container.querySelector('picture');
          expect(picture).toBeInTheDocument();
          
          // Verify WebP source
          const source = container.querySelector('source');
          expect(source).toBeInTheDocument();
          expect(source?.getAttribute('type')).toBe('image/webp');
          expect(source?.getAttribute('srcset')).toContain('.webp');
          
          // Verify fallback image
          const img = container.querySelector('img');
          expect(img).toBeInTheDocument();
          expect(img?.getAttribute('src')).toBe(src);
          
          // Verify alt attribute
          expect(img?.getAttribute('alt')).toBe(alt);
          
          // Verify lazy loading by default
          expect(img?.getAttribute('loading')).toBe('lazy');
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * **Validates: Requirements 12.2**
   * 
   * Property: For any image with jpg, jpeg, or png extension,
   * the WebP source must have the same path with .webp extension
   */
  it('Property: should correctly convert any image extension to WebP', () => {
    fc.assert(
      fc.property(
        fc.record({
          path: fc.string({ minLength: 1, maxLength: 100 }),
          extension: fc.constantFrom('jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG')
        }),
        ({ path, extension }) => {
          const src = `${path}.${extension}`;
          const { container } = render(
            <OptimizedImage src={src} alt="test" />
          );
          
          const source = container.querySelector('source');
          const expectedWebp = `${path}.webp`;
          
          expect(source?.getAttribute('srcset')).toBe(expectedWebp);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * **Validates: Requirements 12.4**
   * 
   * Property: For any loading prop value (lazy or eager),
   * the img element must have the correct loading attribute
   */
  it('Property: should apply correct loading attribute for any loading value', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.webUrl(),
          alt: fc.string({ minLength: 1 }),
          loading: fc.constantFrom('lazy' as const, 'eager' as const)
        }),
        ({ src, alt, loading }) => {
          const { container } = render(
            <OptimizedImage src={src} alt={alt} loading={loading} />
          );
          
          const img = container.querySelector('img');
          expect(img?.getAttribute('loading')).toBe(loading);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * **Validates: Requirements 13.1**
   * 
   * Property: For any alt text provided,
   * the img element must have that exact alt attribute
   */
  it('Property: should preserve any alt text exactly', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.webUrl(),
          alt: fc.string({ minLength: 0, maxLength: 500 })
        }),
        ({ src, alt }) => {
          const { container } = render(
            <OptimizedImage src={src} alt={alt} />
          );
          
          const img = container.querySelector('img');
          expect(img?.getAttribute('alt')).toBe(alt);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Property: For any className provided,
   * the img element must have that exact className
   */
  it('Property: should apply any className to img element', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.webUrl(),
          alt: fc.string({ minLength: 1 }),
          className: fc.string({ minLength: 1, maxLength: 100 })
        }),
        ({ src, alt, className }) => {
          const { container } = render(
            <OptimizedImage src={src} alt={alt} className={className} />
          );
          
          const img = container.querySelector('img');
          expect(img?.className).toBe(className);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Property: For any sizes attribute provided,
   * the img element must have that exact sizes attribute
   */
  it('Property: should apply any sizes attribute to img element', () => {
    fc.assert(
      fc.property(
        fc.record({
          src: fc.webUrl(),
          alt: fc.string({ minLength: 1 }),
          sizes: fc.string({ minLength: 1, maxLength: 200 })
        }),
        ({ src, alt, sizes }) => {
          const { container } = render(
            <OptimizedImage src={src} alt={alt} sizes={sizes} />
          );
          
          const img = container.querySelector('img');
          expect(img?.getAttribute('sizes')).toBe(sizes);
        }
      ),
      { numRuns: 100 }
    );
  });
});
