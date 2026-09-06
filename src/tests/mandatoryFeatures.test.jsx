import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import Explore from '../pages/Explore';
import { useTripStore } from '../store/tripStore';

describe('Mandatory destination features', () => {
  beforeEach(() => {
    useTripStore.setState({
      filters: { vibe: 'all', budgetRange: [0, 6000], searchQuery: '', sortBy: 'recommended' },
      favoriteDestinations: [],
      selectedDestination: null,
    });
  });

  it('shows destination sorting and favorite controls', () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /sort destinations/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save manali/i })).toBeInTheDocument();
  });
});
