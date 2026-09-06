import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Header, { Header as HeaderNamed } from '../components/layout/Header';
import Footer, { Footer as FooterNamed } from '../components/layout/Footer';
import PageLayout, { PageLayout as PageLayoutNamed } from '../components/layout/PageLayout';

describe('Layout Components', () => {
  describe('Header Component', () => {
    it('exports both default and named export', () => {
      expect(Header).toBeDefined();
      expect(HeaderNamed).toBeDefined();
      expect(Header).toBe(HeaderNamed);
    });

    it('renders with required container classes and height h-16', () => {
      const { container } = render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('fixed', 'top-0', 'z-40', 'w-full', 'h-16', 'bg-white/80', 'backdrop-blur-md', 'border-b', 'border-gray-200');
    });

    it('renders skip to content link', () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
      const skipLink = screen.getByRole('link', { name: /skip to content/i });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
      expect(skipLink).toHaveClass('skip-link');
    });

    it('renders ESCAPE logo with compass icon and text linking to home', () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
      const logoLink = screen.getByRole('link', { name: /ESCAPE/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');

      const logoText = screen.getByText('ESCAPE');
      expect(logoText).toHaveClass('font-bold', 'text-xl', 'text-primary');

      const compassIcon = logoLink.querySelector('svg');
      expect(compassIcon).toBeInTheDocument();
    });

    it('renders desktop navigation with active and inactive link classes', () => {
      render(
        <MemoryRouter initialEntries={['/explore']}>
          <Header />
        </MemoryRouter>
      );

      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();

      const dashboardLinks = screen.getAllByRole('link', { name: 'Dashboard' });
      const exploreLinks = screen.getAllByRole('link', { name: 'Explore' });
      const plannerLinks = screen.getAllByRole('link', { name: 'Planner' });

      expect(dashboardLinks.length).toBeGreaterThan(0);
      expect(exploreLinks.length).toBeGreaterThan(0);
      expect(plannerLinks.length).toBeGreaterThan(0);

      // Explore link should be active
      expect(exploreLinks[0]).toHaveClass('text-primary', 'font-semibold', 'border-b-2', 'border-primary');

      // Dashboard & Planner links should be inactive
      expect(dashboardLinks[0]).toHaveClass('text-gray-600', 'hover:text-primary');
      expect(plannerLinks[0]).toHaveClass('text-gray-600', 'hover:text-primary');
    });

    it('renders mobile menu button with aria attributes and toggles menu', () => {
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );

      const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-label', 'Open navigation menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveClass('md:hidden');

      // Initially mobile menu is closed
      expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();

      // Open mobile menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mobileNav).toBeInTheDocument();

      // Clicking a mobile nav item closes the menu
      const mobileExploreLink = mobileNav.querySelector('a[href="/explore"]');
      expect(mobileExploreLink).toBeInTheDocument();
      fireEvent.click(mobileExploreLink);

      expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Footer Component', () => {
    it('exports both default and named export', () => {
      expect(Footer).toBeDefined();
      expect(FooterNamed).toBeDefined();
    });

    it('renders footer element with required classes and content', () => {
      const { container } = render(<Footer />);
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('bg-gray-50', 'border-t', 'border-gray-200', 'py-8');

      const innerDiv = footer.querySelector('.max-w-7xl');
      expect(innerDiv).toBeInTheDocument();
      expect(innerDiv).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');

      const adventureText = screen.getByText(/Built with ❤️ for weekend adventures/i);
      expect(adventureText).toBeInTheDocument();
      expect(adventureText).toHaveClass('text-gray-500', 'text-sm', 'text-center');

      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });
  });

  describe('PageLayout Component', () => {
    it('exports both default and named export', () => {
      expect(PageLayout).toBeDefined();
      expect(PageLayoutNamed).toBeDefined();
    });

    it('renders Header, main element with correct id and classes, and Footer', () => {
      const { container } = render(
        <MemoryRouter>
          <PageLayout className="custom-test-class">
            <p>Child Content</p>
          </PageLayout>
        </MemoryRouter>
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('min-h-screen', 'flex', 'flex-col', 'bg-surface');

      expect(container.querySelector('header')).toBeInTheDocument();

      const main = container.querySelector('#main-content');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('role', 'main');
      expect(main).toHaveClass('flex-1', 'pt-16', 'custom-test-class');
      expect(main).toHaveTextContent('Child Content');

      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });
});
