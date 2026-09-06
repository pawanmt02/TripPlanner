import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  Button,
  Input,
  SearchBar,
  SkeletonCard,
  Badge,
  Modal,
} from '../components/ui';

describe('Button component', () => {
  it('renders children correctly and defaults to primary variant and md size', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('bg-primary');
    expect(button.className).toContain('px-4 py-2');
  });

  it('renders different variants and sizes', () => {
    const { rerender } = render(
      <Button variant="secondary" size="sm">Secondary</Button>
    );
    let button = screen.getByRole('button', { name: /secondary/i });
    expect(button.className).toContain('border-primary');
    expect(button.className).toContain('px-3 py-1.5 text-sm');

    rerender(<Button variant="danger" size="lg">Danger</Button>);
    button = screen.getByRole('button', { name: /danger/i });
    expect(button.className).toContain('bg-danger');
    expect(button.className).toContain('px-6 py-3 text-lg');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button', { name: /ghost/i });
    expect(button.className).toContain('text-gray-600');
  });

  it('handles icon-only button with ariaLabel', () => {
    const icon = <svg data-testid="test-icon" />;
    render(<Button icon={icon} ariaLabel="Filter items" />);
    const button = screen.getByRole('button', { name: /filter items/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('handles click events and disabled state', () => {
    const handleClick = vi.fn();
    const { rerender } = render(<Button onClick={handleClick}>Action</Button>);
    fireEvent.click(screen.getByRole('button', { name: /action/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<Button onClick={handleClick} disabled>Action</Button>);
    const disabledBtn = screen.getByRole('button', { name: /action/i });
    expect(disabledBtn).toBeDisabled();
    expect(disabledBtn.className).toContain('disabled:opacity-50');
  });
});

describe('Input component', () => {
  it('renders input with label and links htmlFor to id', () => {
    render(<Input label="Trip Name" id="trip-name" value="" onChange={() => {}} placeholder="Enter trip name" />);
    const label = screen.getByText('Trip Name');
    const input = screen.getByPlaceholderText('Enter trip name');

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'trip-name');
    expect(input).toHaveAttribute('id', 'trip-name');
  });

  it('shows required indicator and renders error message with role alert', () => {
    render(
      <Input
        label="Email"
        id="user-email"
        required
        error="Invalid email address"
        value=""
        onChange={() => {}}
      />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toHaveTextContent('Invalid email address');
    expect(errorMsg.className).toContain('text-danger');

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'user-email-error');
  });
});

describe('SearchBar component', () => {
  it('renders search input with role search and proper attributes', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Search destinations..." />);
    const searchRegion = screen.getByRole('search', { name: /search destinations/i });
    expect(searchRegion).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Search destinations...');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('shows clear button when value is non-empty and calls onClear', () => {
    const handleClear = vi.fn();
    const { rerender } = render(
      <SearchBar value="" onChange={() => {}} onClear={handleClear} />
    );
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();

    rerender(<SearchBar value="Paris" onChange={() => {}} onClear={handleClear} />);
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });
});

describe('SkeletonCard component', () => {
  it('renders skeleton card with role presentation and aria-hidden true', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.querySelector('[role="presentation"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-hidden', 'true');

    const skeletonDivs = container.querySelectorAll('.skeleton');
    expect(skeletonDivs.length).toBe(3); // image aspect-video + 2 bars
  });
});

describe('Badge component', () => {
  it('renders with default variant styling', () => {
    render(<Badge>Default Tag</Badge>);
    const badge = screen.getByText('Default Tag');
    expect(badge.className).toContain('bg-gray-100 text-gray-800');
    expect(badge.className).toContain('rounded-full text-xs font-medium');
  });

  it('renders specific category variant colors', () => {
    const variants = [
      { variant: 'nature', expected: 'bg-green-100 text-green-800' },
      { variant: 'city', expected: 'bg-blue-100 text-blue-800' },
      { variant: 'adventure', expected: 'bg-orange-100 text-orange-800' },
      { variant: 'beach', expected: 'bg-cyan-100 text-cyan-800' },
      { variant: 'heritage', expected: 'bg-amber-100 text-amber-800' },
    ];

    variants.forEach(({ variant, expected }) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      const badge = screen.getByText(variant);
      expect(badge.className).toContain(expected);
      unmount();
    });
  });
});

describe('Modal component', () => {
  it('returns null when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog, backdrop, title, and handles close button click', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Trip Details">
        <p>Modal Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(screen.getByText('Trip Details')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('adds overflow-hidden to body and removes it on unmount or close', () => {
    const { unmount, rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);

    rerender(
      <Modal isOpen={false} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);

    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        <p>Content</p>
      </Modal>
    );
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
    unmount();
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('closes on Escape key press', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
