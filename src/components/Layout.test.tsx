import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import Layout from './Layout';

const renderLayout = (children: React.ReactNode) => {
  const mockOnLanguageChange = vi.fn();
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Layout currentLanguage="es" onLanguageChange={mockOnLanguageChange}>
          {children}
        </Layout>
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Layout', () => {
  it('should render Header component', () => {
    renderLayout(<div>Test Content</div>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    renderLayout(<div>Test Content</div>);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderLayout(<div data-testid="test-content">Test Content</div>);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    renderLayout(<div>Test Content</div>);
    
    // Should have header, main, and footer
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('should apply proper layout classes', () => {
    const { container } = renderLayout(<div>Test Content</div>);
    const layoutDiv = container.firstChild as HTMLElement;
    
    expect(layoutDiv).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-gray-50');
  });
});
