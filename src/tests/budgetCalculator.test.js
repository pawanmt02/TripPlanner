import { describe, it, expect } from 'vitest';
import {
  calculateTotalBudget,
  calculateCategoryBreakdown,
  calculateDayBudget,
  formatCurrency,
  getBudgetLevel,
} from '../utils/budgetCalculator';

describe('calculateTotalBudget', () => {
  it('returns 0 for empty itinerary', () => {
    const itinerary = { friday: [], saturday: [], sunday: [] };
    expect(calculateTotalBudget(itinerary)).toBe(0);
  });

  it('calculates total across all days', () => {
    const itinerary = {
      friday: [{ cost: 1000 }, { cost: 500 }],
      saturday: [{ cost: 2000 }],
      sunday: [{ cost: 300 }],
    };
    expect(calculateTotalBudget(itinerary)).toBe(3800);
  });

  it('handles activities with zero cost', () => {
    const itinerary = {
      friday: [{ cost: 0 }, { cost: 1000 }],
      saturday: [],
      sunday: [{ cost: 0 }],
    };
    expect(calculateTotalBudget(itinerary)).toBe(1000);
  });

  it('handles missing cost property gracefully', () => {
    const itinerary = {
      friday: [{ name: 'No cost field' }, { cost: 500 }],
      saturday: [],
      sunday: [],
    };
    expect(calculateTotalBudget(itinerary)).toBe(500);
  });
});

describe('calculateCategoryBreakdown', () => {
  it('returns zero breakdown for empty itinerary', () => {
    const itinerary = { friday: [], saturday: [], sunday: [] };
    const result = calculateCategoryBreakdown(itinerary);
    expect(result.Accommodation).toBe(0);
    expect(result.Activities).toBe(0);
    expect(result['Food & Dining']).toBe(0);
    expect(result.Transport).toBe(0);
    expect(result.total).toBe(0);
  });

  it('correctly groups costs by category', () => {
    const itinerary = {
      friday: [
        { cost: 2500, category: 'Accommodation' },
        { cost: 1200, category: 'Activities' },
      ],
      saturday: [
        { cost: 800, category: 'Food & Dining' },
        { cost: 500, category: 'Transport' },
      ],
      sunday: [
        { cost: 1000, category: 'Activities' },
      ],
    };
    const result = calculateCategoryBreakdown(itinerary);
    expect(result.Accommodation).toBe(2500);
    expect(result.Activities).toBe(2200);
    expect(result['Food & Dining']).toBe(800);
    expect(result.Transport).toBe(500);
    expect(result.total).toBe(6000);
  });

  it('ignores unknown categories', () => {
    const itinerary = {
      friday: [{ cost: 999, category: 'UnknownCategory' }],
      saturday: [],
      sunday: [],
    };
    const result = calculateCategoryBreakdown(itinerary);
    expect(result.total).toBe(0);
  });

  it('handles single day with multiple activities', () => {
    const itinerary = {
      friday: [
        { cost: 100, category: 'Transport' },
        { cost: 200, category: 'Transport' },
        { cost: 300, category: 'Transport' },
      ],
      saturday: [],
      sunday: [],
    };
    const result = calculateCategoryBreakdown(itinerary);
    expect(result.Transport).toBe(600);
    expect(result.total).toBe(600);
  });
});

describe('calculateDayBudget', () => {
  it('returns 0 for empty array', () => {
    expect(calculateDayBudget([])).toBe(0);
  });

  it('returns 0 for null/undefined', () => {
    expect(calculateDayBudget(null)).toBe(0);
    expect(calculateDayBudget(undefined)).toBe(0);
  });

  it('sums activity costs', () => {
    const activities = [{ cost: 500 }, { cost: 300 }, { cost: 200 }];
    expect(calculateDayBudget(activities)).toBe(1000);
  });
});

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats positive amounts in INR', () => {
    const result = formatCurrency(1500);
    expect(result).toContain('1,500');
    expect(result).toContain('₹');
  });

  it('formats large amounts with proper grouping', () => {
    const result = formatCurrency(150000);
    expect(result).toContain('1,50,000');
  });

  it('handles non-number input', () => {
    expect(formatCurrency('abc')).toBe('₹0');
    expect(formatCurrency(NaN)).toBe('₹0');
  });
});

describe('getBudgetLevel', () => {
  it('returns Budget for low cost', () => {
    expect(getBudgetLevel(2000)).toBe('Budget');
    expect(getBudgetLevel(2500)).toBe('Budget');
  });

  it('returns Mid-Range for moderate cost', () => {
    expect(getBudgetLevel(3000)).toBe('Mid-Range');
    expect(getBudgetLevel(4000)).toBe('Mid-Range');
  });

  it('returns Premium for high cost', () => {
    expect(getBudgetLevel(5000)).toBe('Premium');
    expect(getBudgetLevel(10000)).toBe('Premium');
  });
});
