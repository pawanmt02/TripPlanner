import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DestinationCard from '../components/destinations/DestinationCard';

const mockDestination = {
  id: 'dest-1',
  name: 'Manali',
  description: 'A breathtaking hill station nestled in the Himalayas.',
  vibe: 'Adventure',
  image: 'https://example.com/manali.webp',
  budgetPerDay: 3500,
};

function renderCard(props = {}) {
  const defaultProps = {
    destination: mockDestination,
    onClick: vi.fn(),
    isSelected: false,
    ...props,
  };
  return {
    ...render(
      <BrowserRouter>
        <DestinationCard {...defaultProps} />
      </BrowserRouter>
    ),
    onClick: defaultProps.onClick,
  };
}

describe('DestinationCard', () => {
  it('renders destination name', () => {
    renderCard();
    expect(screen.getByText('Manali')).toBeInTheDocument();
  });

  it('renders destination description', () => {
    renderCard();
    expect(screen.getByText(/breathtaking hill station/i)).toBeInTheDocument();
  });

  it('renders vibe badge', () => {
    renderCard();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('renders destination image with alt text', () => {
    renderCard();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt');
    expect(img.alt).toContain('Manali');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const { onClick } = renderCard();
    const card = screen.getByRole('button');
    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on Enter keypress', async () => {
    const user = userEvent.setup();
    const { onClick } = renderCard();
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when isSelected is true', () => {
    renderCard({ isSelected: true });
    const card = screen.getByRole('button');
    expect(card.className).toContain('ring');
  });

  it('shows budget per day', () => {
    renderCard();
    expect(screen.getByText(/3,500/)).toBeInTheDocument();
  });
});
