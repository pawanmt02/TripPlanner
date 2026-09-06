import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import useTripStore from '../store/tripStore';

// Reset store before each test
beforeEach(() => {
  useTripStore.setState({
    selectedDestination: null,
    itinerary: { friday: [], saturday: [], sunday: [] },
    budget: { Accommodation: 0, Activities: 0, 'Food & Dining': 0, Transport: 0, total: 0 },
    filters: { vibe: 'all', budgetRange: [0, 6000], searchQuery: '' },
  });
});

const mockDestination = {
  id: 'dest-1',
  name: 'Manali',
  description: 'A hill station',
  vibe: 'Adventure',
  image: 'https://example.com/manali.webp',
  coordinates: [32.2396, 77.1887],
  budgetPerDay: 3500,
  activities: [
    { id: 'act-1', name: 'River Rafting', cost: 1200, duration: '3 hours', category: 'Activities', icon: '🏄' },
    { id: 'act-2', name: 'Mountain Lodge', cost: 2500, duration: 'Per Night', category: 'Accommodation', icon: '🏨' },
    { id: 'act-3', name: 'Cafe Hopping', cost: 800, duration: '2 hours', category: 'Food & Dining', icon: '☕' },
  ],
};

describe('Trip Store Integration', () => {
  it('sets a destination and clears previous itinerary', () => {
    const store = useTripStore.getState();
    store.setDestination(mockDestination);

    const state = useTripStore.getState();
    expect(state.selectedDestination).toEqual(mockDestination);
    expect(state.itinerary.friday).toHaveLength(0);
    expect(state.itinerary.saturday).toHaveLength(0);
    expect(state.itinerary.sunday).toHaveLength(0);
  });

  it('adds an activity to a day and updates budget', () => {
    const store = useTripStore.getState();
    store.setDestination(mockDestination);
    store.addActivity('friday', mockDestination.activities[0]); // River Rafting, 1200

    const state = useTripStore.getState();
    expect(state.itinerary.friday).toHaveLength(1);
    expect(state.itinerary.friday[0].name).toBe('River Rafting');
    expect(state.budget.Activities).toBe(1200);
    expect(state.budget.total).toBe(1200);
  });

  it('prevents duplicate activities in the same day', () => {
    const store = useTripStore.getState();
    store.addActivity('friday', mockDestination.activities[0]);
    store.addActivity('friday', mockDestination.activities[0]); // duplicate

    const state = useTripStore.getState();
    expect(state.itinerary.friday).toHaveLength(1);
  });

  it('removes an activity and recalculates budget', () => {
    const store = useTripStore.getState();
    store.addActivity('friday', mockDestination.activities[0]); // 1200
    store.addActivity('friday', mockDestination.activities[1]); // 2500

    let state = useTripStore.getState();
    expect(state.budget.total).toBe(3700);

    store.removeActivity('friday', 'act-1');
    state = useTripStore.getState();
    expect(state.itinerary.friday).toHaveLength(1);
    expect(state.budget.total).toBe(2500);
  });

  it('budget recalculates correctly with activities across multiple days', () => {
    const store = useTripStore.getState();
    store.addActivity('friday', mockDestination.activities[0]);   // Activities: 1200
    store.addActivity('saturday', mockDestination.activities[1]); // Accommodation: 2500
    store.addActivity('sunday', mockDestination.activities[2]);   // Food: 800

    const state = useTripStore.getState();
    expect(state.budget.Activities).toBe(1200);
    expect(state.budget.Accommodation).toBe(2500);
    expect(state.budget['Food & Dining']).toBe(800);
    expect(state.budget.total).toBe(4500);
  });

  it('resets trip clears everything', () => {
    const store = useTripStore.getState();
    store.setDestination(mockDestination);
    store.addActivity('friday', mockDestination.activities[0]);
    store.resetTrip();

    const state = useTripStore.getState();
    expect(state.selectedDestination).toBeNull();
    expect(state.itinerary.friday).toHaveLength(0);
    expect(state.budget.total).toBe(0);
  });

  it('updates filters correctly', () => {
    const store = useTripStore.getState();
    store.updateFilters({ vibe: 'Nature', searchQuery: 'mun' });

    const state = useTripStore.getState();
    expect(state.filters.vibe).toBe('Nature');
    expect(state.filters.searchQuery).toBe('mun');
    expect(state.filters.budgetRange).toEqual([0, 6000]); // unchanged
  });

  it('updates activity notes', () => {
    const store = useTripStore.getState();
    store.addActivity('friday', mockDestination.activities[0]);
    store.updateNotes('friday', 'act-1', 'Remember to bring towel');

    const state = useTripStore.getState();
    expect(state.itinerary.friday[0].notes).toBe('Remember to bring towel');
  });
});
