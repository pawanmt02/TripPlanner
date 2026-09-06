import React, { memo } from 'react';
import { formatCurrency } from '../../utils/budgetCalculator';

/**
 * BudgetBar Component
 * Visual progress bar for an individual budget category.
 *
 * @param {Object} props
 * @param {string} props.label - Category name/label
 * @param {number} [props.amount=0] - Current spent/allocated amount
 * @param {number} [props.maxAmount=1] - Maximum amount across categories for proportional scaling
 * @param {string} [props.color='bg-primary'] - Tailwind background color class for the bar
 */
export const BudgetBar = memo(function BudgetBar({
  label = '',
  amount = 0,
  maxAmount = 1,
  color = 'bg-primary',
}) {
  const safeMax = maxAmount > 0 ? maxAmount : 1;
  const percentage = Math.min(Math.max((amount / safeMax) * 100, 0), 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-label={`${label} budget`}
        aria-valuenow={amount}
        aria-valuemin={0}
        aria-valuemax={maxAmount}
      >
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

BudgetBar.displayName = 'BudgetBar';

export default BudgetBar;
