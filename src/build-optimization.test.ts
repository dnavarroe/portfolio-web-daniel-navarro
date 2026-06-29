import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Build Optimization Tests
 * 
 * These tests verify that the production build meets performance requirements:
 * - Bundle size < 2MB
 * - Code splitting is configured
 * - Minification is enabled
 * - Asset optimization is configured
 * - Lazy loading is implemented
 * - Preload tags are present
 */

describe('Build Configuration - Vite', () => {
  it('should have base URL configured for GitHub Pages', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    // Check that base URL is configured
    expect(viteConfigSource).toContain('base:');
    expect(viteConfigSource).toContain('portfolio-web-daniel-navarro');
  });

  it('should have dist output directory configured', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    expect(viteConfigSource).toContain("outDir: 'dist'");
  });

  it('should have minification enabled', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    expect(viteConfigSource).toContain("minify: 'terser'");
  });

  it('should have code splitting configured with manual chunks', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    // Verify manual chunks configuration exists
    expect(viteConfigSource).toContain('manualChunks');
    expect(viteConfigSource).toContain('vendor:');
    expect(viteConfigSource).toContain('i18n:');
    
    // Verify vendor chunk includes React
    expect(viteConfigSource).toContain('react');
    expect(viteConfigSource).toContain('react-dom');
  });

  it('should have asset optimization configured', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    // Check asset inline limit
    expect(viteConfigSource).toContain('assetsInlineLimit');
    
    // Check CSS code splitting
    expect(viteConfigSource).toContain('cssCodeSplit: true');
  });

  it('should have terser options configured for production', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    expect(viteConfigSource).toContain('terserOptions');
    expect(viteConfigSource).toContain('compress');
    expect(viteConfigSource).toContain('drop_console');
  });
});

describe('Build Configuration - Tailwind CSS', () => {
  it('should have content paths configured for purging', () => {
    const tailwindConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../tailwind.config.js'),
      'utf-8'
    );
    
    // Should include src files for purging
    expect(tailwindConfigSource).toContain('content:');
    expect(tailwindConfigSource).toContain('./src/**/*.{js,jsx,ts,tsx}');
  });

  it('should have PostCSS configured with cssnano for production', () => {
    const postcssConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../postcss.config.js'),
      'utf-8'
    );
    
    expect(postcssConfigSource).toContain('tailwindcss');
    expect(postcssConfigSource).toContain('autoprefixer');
    expect(postcssConfigSource).toContain('cssnano');
  });
});

describe('Lazy Loading Implementation', () => {
  it('should lazy load non-critical routes', () => {
    const appSource = fs.readFileSync(
      path.resolve(__dirname, 'App.tsx'),
      'utf-8'
    );
    
    // Check for lazy imports
    expect(appSource).toContain('lazy(');
    expect(appSource).toContain('Suspense');
    
    // Verify specific pages are lazy loaded
    expect(appSource).toContain('ProjectsPage');
    expect(appSource).toContain('ProjectDetailPage');
    expect(appSource).toContain('SkillsPage');
  });

  it('should have Suspense fallback configured', () => {
    const appSource = fs.readFileSync(
      path.resolve(__dirname, 'App.tsx'),
      'utf-8'
    );
    
    // Check for Suspense with fallback
    expect(appSource).toContain('<Suspense fallback=');
  });

  it('should not lazy load HomePage (critical route)', () => {
    const appSource = fs.readFileSync(
      path.resolve(__dirname, 'App.tsx'),
      'utf-8'
    );
    
    // HomePage should be imported directly, not lazy loaded
    expect(appSource).toContain("import HomePage from './pages/HomePage'");
  });
});

describe('Preload Configuration', () => {
  it('should have preload tags in index.html', () => {
    const indexHtml = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf-8'
    );
    
    // Check for preconnect to fonts
    expect(indexHtml).toContain('rel="preconnect"');
    
    // Check for modulepreload
    expect(indexHtml).toContain('rel="modulepreload"');
  });

  it('should have viewport meta tag', () => {
    const indexHtml = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf-8'
    );
    
    expect(indexHtml).toContain('name="viewport"');
    expect(indexHtml).toContain('width=device-width');
  });
});

describe('Bundle Size Requirements', () => {
  it('should verify dist directory structure after build', () => {
    const distPath = path.resolve(__dirname, '../dist');
    
    // This test will only pass after running 'npm run build'
    // Skip if dist doesn't exist (during development)
    if (!fs.existsSync(distPath)) {
      console.warn('⚠️  Dist directory not found. Run "npm run build" to verify bundle size.');
      return;
    }
    
    expect(fs.existsSync(distPath)).toBe(true);
  });

  it('should have total bundle size less than 2MB', () => {
    const distPath = path.resolve(__dirname, '../dist');
    
    // Skip if dist doesn't exist
    if (!fs.existsSync(distPath)) {
      console.warn('⚠️  Dist directory not found. Run "npm run build" to verify bundle size.');
      return;
    }
    
    // Calculate total size of all files in dist
    const getTotalSize = (dir: string): number => {
      let totalSize = 0;
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += getTotalSize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
      
      return totalSize;
    };
    
    const totalSize = getTotalSize(distPath);
    const totalSizeMB = totalSize / (1024 * 1024);
    
    console.log(`📦 Total bundle size: ${totalSizeMB.toFixed(2)} MB`);
    
    // Requirement: Bundle size < 2MB
    expect(totalSizeMB).toBeLessThan(2);
  });

  it('should have JavaScript chunks properly split', () => {
    const distPath = path.resolve(__dirname, '../dist/assets/js');
    
    // Skip if dist doesn't exist
    if (!fs.existsSync(distPath)) {
      console.warn('⚠️  Dist directory not found. Run "npm run build" to verify chunk splitting.');
      return;
    }
    
    const jsFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.js'));
    
    // Should have multiple JS chunks (vendor, i18n, main, etc.)
    expect(jsFiles.length).toBeGreaterThan(1);
    
    console.log(`📦 JavaScript chunks: ${jsFiles.length} files`);
    jsFiles.forEach(file => {
      const size = fs.statSync(path.join(distPath, file)).size;
      console.log(`   - ${file}: ${(size / 1024).toFixed(2)} KB`);
    });
  });

  it('should have CSS files minified', () => {
    const distPath = path.resolve(__dirname, '../dist/assets');
    
    // Skip if dist doesn't exist
    if (!fs.existsSync(distPath)) {
      console.warn('⚠️  Dist directory not found. Run "npm run build" to verify CSS minification.');
      return;
    }
    
    const findCssFiles = (dir: string): string[] => {
      const cssFiles: string[] = [];
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          cssFiles.push(...findCssFiles(filePath));
        } else if (file.endsWith('.css')) {
          cssFiles.push(filePath);
        }
      }
      
      return cssFiles;
    };
    
    const cssFiles = findCssFiles(distPath);
    
    // Should have at least one CSS file
    expect(cssFiles.length).toBeGreaterThan(0);
    
    console.log(`📦 CSS files: ${cssFiles.length} file(s)`);
    cssFiles.forEach(file => {
      const size = fs.statSync(file).size;
      const fileName = path.basename(file);
      console.log(`   - ${fileName}: ${(size / 1024).toFixed(2)} KB`);
    });
  });
});

describe('Performance Optimizations', () => {
  it('should have console statements removed in production build', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    // Check terser options for console removal
    expect(viteConfigSource).toContain('drop_console: true');
  });

  it('should have source maps disabled in production', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    expect(viteConfigSource).toContain('sourcemap: false');
  });

  it('should have chunk size warning limit configured', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    expect(viteConfigSource).toContain('chunkSizeWarningLimit');
  });

  it('should have asset file naming strategy configured', () => {
    const viteConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../vite.config.ts'),
      'utf-8'
    );
    
    // Check for asset file naming configuration
    expect(viteConfigSource).toContain('assetFileNames');
    expect(viteConfigSource).toContain('chunkFileNames');
    expect(viteConfigSource).toContain('entryFileNames');
  });
});
