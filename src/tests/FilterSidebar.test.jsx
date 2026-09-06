import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSidebar from '../components/destinations/FilterSidebar';

describe('FilterSidebar', () => {
  const defaultFilters = {
    vibe: 'All',
    budgetRange: [0, 5000],
    searchQuery: '',
  };

  it('renders vibe heading and vibe buttons with active state', () => {
    render(<FilterSidebar filters={defaultFilters} onFilterChange={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Vibe' })).toBeInTheDocument();
    
    const allBtn = screen.getByRole('button', { name: 'All' });
    expect(allBtn).toBeInTheDocument();
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(allBtn.className).toContain('bg-primary text-white');

    const natureBtn = screen.getByRole('button', { name: 'Nature' });
    expect(natureBtn).toBeInTheDocument();
    expect(natureBtn).toHaveAttribute('aria-pressed', 'false');
    expect(natureBtn.className).toContain('bg-gray-100');
  });

  it('calls onFilterChange when vibe button is clicked', async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();

    render(<FilterSidebar filters={defaultFilters} onFilterChange={handleFilterChange} />);

    const beachBtn = screen.getByRole('button', { name: 'Beach' });
    await user.click(beachBtn);

    expect(handleFilterChange).toHaveBeenCalledTimes(1);
    expect(handleFilterChange).toHaveBeenCalledWith({ vibe: 'Beach' });
  });

  it('renders budget range slider and updates on change', () => {
    const handleFilterChange = vi.fn();
    render(<FilterSidebar filters={defaultFilters} onFilterChange={handleFilterChange} />);

    expect(screen.getByRole('heading', { name: 'Budget Range' })).toBeInTheDocument();

    const slider = screen.getByRole('slider', { name: 'Maximum budget per day' });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '6000');
    expect(slider).toHaveAttribute('aria-valuenow', '5000');
    expect(screen.getByText(/up to ₹5,000\/day/i)).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '4000' } });
    expect(handleFilterChange).toHaveBeenCalledWith({
      budgetRange: [0, 4000],
    });
  });

  it('renders search input and triggers search update and clear', async () => {
    const user = userEvent.setup();
    const handleFilterChange = vi.fn();

    const { rerender } = render(
      <FilterSidebar
        filters={{ ...defaultFilters, searchQuery: '' }}
        onFilterChange={handleFilterChange}
      />
    );

    expect(screen.getByRole('heading', { name: 'Search' })).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('Search destinations...');
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Goa');
    expect(handleFilterChange).toHaveBeenCalled();

    rerender(
      <FilterSidebar
        filters={{ ...defaultFilters, searchQuery: 'Goa' }}
        onFilterChange={handleFilterChange}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);

    expect(handleFilterChange).toHaveBeenCalledWith({ searchQuery: '' });
  });
});
