import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BudgetBar } from '../components/budget/BudgetBar';
import DefaultBudgetBar from '../components/budget/BudgetBar';
import { BudgetSummary, CATEGORY_CONFIG } from '../components/budget/BudgetSummary';
import DefaultBudgetSummary from '../components/budget/BudgetSummary';
import useTripStore from '../store/tripStore';

describe('BudgetBar component', () => {
  it('exports both named and default', () => {
    expect(BudgetBar).toBeDefined();
    expect(DefaultBudgetBar).toBeDefined();
    expect(BudgetBar).toBe(DefaultBudgetBar);
  });

  it('renders label and formatted currency amount', () => {
    render(
      <BudgetBar
        label="Accommodation"
        amount={2500}
        maxAmount={5000}
        color="bg-blue-500"
      />
    );

    expect(screen.getByText('Accommodation')).toBeInTheDocument();
    expect(screen.getByText(/2,500/)).toBeInTheDocument();
  });

  it('sets proper accessibility attributes on progressbar', () => {
    render(
      <BudgetBar
        label="Activities"
        amount={1200}
        maxAmount={2400}
        color="bg-orange-500"
      />
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Activities budget' });
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-label', 'Activities budget');
    expect(progressbar).toHaveAttribute('aria-valuenow', '1200');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '2400');
  });

  it('calculates width percentage correctly based on amount and maxAmount', () => {
    const { container } = render(
      <BudgetBar
        label="Food & Dining"
        amount={1500}
        maxAmount={3000}
        color="bg-green-500"
      />
    );

    const bar = container.querySelector('.bg-green-500');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle({ width: '50%' });
  });

  it('caps width percentage at 100% when amount exceeds maxAmount', () => {
    const { container } = render(
      <BudgetBar
        label="Transport"
        amount={4000}
        maxAmount={2000}
        color="bg-purple-500"
      />
    );

    const bar = container.querySelector('.bg-purple-500');
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveStyle({ width: '100%' });
  });

  it('handles 0 amount and 0 maxAmount gracefully', () => {
    const { container } = render(
      <BudgetBar
        label="Zero Test"
        amount={0}
        maxAmount={0}
        color="bg-primary"
      />
    );

    expect(screen.getByText('Zero Test')).toBeInTheDocument();
    expect(screen.getByText('₹0')).toBeInTheDocument();
    const bar = container.querySelector('.bg-primary');
    expect(bar).toHaveStyle({ width: '0%' });
  });
});

describe('BudgetSummary component', () => {
  beforeEach(() => {
    useTripStore.setState({
      selectedDestination: null,
      itinerary: { friday: [], saturday: [], sunday: [] },
      budget: {
        Accommodation: 0,
        Activities: 0,
        'Food & Dining': 0,
        Transport: 0,
        total: 0,
      },
    });
  });

  it('exports both named and default', () => {
    expect(BudgetSummary).toBeDefined();
    expect(DefaultBudgetSummary).toBeDefined();
    expect(BudgetSummary).toBe(DefaultBudgetSummary);
  });

  it('renders heading, live region attributes, and helper text when total is 0', () => {
    const { container } = render(<BudgetSummary />);

    expect(screen.getByText(/Budget Summary/i)).toBeInTheDocument();
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');

    expect(screen.getByText('Add activities to see budget breakdown')).toBeInTheDocument();
    expect(screen.getByText('Total Estimated')).toBeInTheDocument();
    expect(screen.getAllByText('₹0').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 4 configured categories with their icons and colors', () => {
    render(<BudgetSummary />);

    CATEGORY_CONFIG.forEach((cat) => {
      expect(screen.getByText(cat.icon)).toBeInTheDocument();
      expect(screen.getByText(cat.name)).toBeInTheDocument();
    });
  });

  it('displays updated budget totals and hides helper text when activities are present', () => {
    useTripStore.setState({
      budget: {
        Accommodation: 3000,
        Activities: 1500,
        'Food & Dining': 800,
        Transport: 500,
        total: 5800,
      },
    });

    render(<BudgetSummary />);

    expect(screen.queryByText('Add activities to see budget breakdown')).not.toBeInTheDocument();
    expect(screen.getByText('₹5,800')).toBeInTheDocument();
    expect(screen.getByText('₹3,000')).toBeInTheDocument();
    expect(screen.getByText('₹1,500')).toBeInTheDocument();
    expect(screen.getByText('₹800')).toBeInTheDocument();
    expect(screen.getByText('₹500')).toBeInTheDocument();
  });

  it('scales bars according to maxAmount from categories', () => {
    useTripStore.setState({
      budget: {
        Accommodation: 4000,
        Activities: 2000,
        'Food & Dining': 1000,
        Transport: 0,
        total: 7000,
      },
    });

    const { container } = render(<BudgetSummary />);

    // Accommodation is 4000 (max), so 4000/4000 = 100%
    const accommodationBar = container.querySelector('.bg-blue-500');
    expect(accommodationBar).toHaveStyle({ width: '100%' });

    // Activities is 2000, so 2000/4000 = 50%
    const activitiesBar = container.querySelector('.bg-orange-500');
    expect(activitiesBar).toHaveStyle({ width: '50%' });

    // Food & Dining is 1000, so 1000/4000 = 25%
    const foodBar = container.querySelector('.bg-green-500');
    expect(foodBar).toHaveStyle({ width: '25%' });

    // Transport is 0, so 0%
    const transportBar = container.querySelector('.bg-purple-500');
    expect(transportBar).toHaveStyle({ width: '0%' });
  });
});
