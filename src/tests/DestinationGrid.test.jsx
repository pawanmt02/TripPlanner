import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DestinationGrid from '../components/destinations/DestinationGrid';

const mockDestinations = [
  {
    id: 'dest-1',
    name: 'Manali',
    description: 'A breathtaking hill station nestled in the Himalayas.',
    vibe: 'Adventure',
    image: 'https://example.com/manali.webp',
    budgetPerDay: 3500,
  },
  {
    id: 'dest-2',
    name: 'Goa',
    description: 'Sun-kissed beaches and vibrant nightlife.',
    vibe: 'Beach',
    image: 'https://example.com/goa.webp',
    budgetPerDay: 4000,
  },
];

describe('DestinationGrid', () => {
  it('renders a grid of destination cards', () => {
    render(
      <BrowserRouter>
        <DestinationGrid destinations={mockDestinations} onSelect={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText('Manali')).toBeInTheDocument();
    expect(screen.getByText('Goa')).toBeInTheDocument();
  });

  it('calls onSelect with destination when a card is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <BrowserRouter>
        <DestinationGrid
          destinations={mockDestinations}
          onSelect={handleSelect}
        />
      </BrowserRouter>
    );

    const cards = screen.getAllByRole('button');
    await user.click(cards[0]);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockDestinations[0]);
  });

  it('marks selected destination card with isSelected', () => {
    render(
      <BrowserRouter>
        <DestinationGrid
          destinations={mockDestinations}
          onSelect={vi.fn()}
          selectedId="dest-2"
        />
      </BrowserRouter>
    );

    const cards = screen.getAllByRole('button');
    expect(cards[0].className).not.toContain('ring-2 ring-primary');
    expect(cards[1].className).toContain('ring-2 ring-primary');
  });

  it('shows empty state message and reset suggestion when destinations array is empty', () => {
    render(
      <BrowserRouter>
        <DestinationGrid destinations={[]} onSelect={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText(/no destinations match your filters/i)).toBeInTheDocument();
  });

  it('handles onReset callback in empty state when provided', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();

    render(
      <BrowserRouter>
        <DestinationGrid destinations={[]} onReset={handleReset} />
      </BrowserRouter>
    );

    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    await user.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
