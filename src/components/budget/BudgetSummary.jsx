import React, { memo } from 'react';
import useTripStore from '../../store/tripStore';
import BudgetBar from './BudgetBar';
import { formatCurrency } from '../../utils/budgetCalculator';

export const CATEGORY_CONFIG = [
  { name: 'Accommodation', color: 'bg-blue-500', icon: '🏨' },
  { name: 'Activities', color: 'bg-orange-500', icon: '🎯' },
  { name: 'Food & Dining', color: 'bg-green-500', icon: '🍽️' },
  { name: 'Transport', color: 'bg-purple-500', icon: '🚗' },
];

/**
 * BudgetSummary Component
 * Comprehensive budget overview widget displaying category breakdown bars and estimated total.
 */
export const BudgetSummary = memo(function BudgetSummary() {
  const budget = useTripStore((state) => state.budget) || {};

  const categoryAmounts = CATEGORY_CONFIG.map((cat) => budget[cat.name] || 0);
  const maxAmount = Math.max(...categoryAmounts, 1);
  const total = budget.total || 0;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
    >
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        💰 Budget Summary
      </h3>

      <div>
        {CATEGORY_CONFIG.map((cat) => (
          <div key={cat.name} className="flex items-start gap-2">
            <span className="text-base select-none mt-0.5" aria-hidden="true">
              {cat.icon}
            </span>
            <div className="flex-1 min-w-0">
              <BudgetBar
                label={cat.name}
                amount={budget[cat.name] || 0}
                maxAmount={maxAmount}
                color={cat.color}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4 border-gray-200" />

      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-900">Total Estimated</span>
        <span className="text-xl font-bold text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      {total === 0 && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Add activities to see budget breakdown
        </p>
      )}
    </div>
  );
});

BudgetSummary.displayName = 'BudgetSummary';

export default BudgetSummary;
