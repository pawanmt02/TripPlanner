/**
 * Budget Calculator Utility Functions
 * Pure functions for computing trip budget breakdowns.
 */

/**
 * Calculate the total budget from all itinerary activities.
 * @param {Object} itinerary - { friday: Activity[], saturday: Activity[], sunday: Activity[] }
 * @returns {number} Total cost across all days
 */
export function calculateTotalBudget(itinerary) {
  const days = Object.values(itinerary);
  return days.reduce((total, dayActivities) => {
    return total + dayActivities.reduce((dayTotal, activity) => {
      return dayTotal + (activity.cost || 0);
    }, 0);
  }, 0);
}

/**
 * Calculate budget breakdown by category.
 * @param {Object} itinerary - { friday: Activity[], saturday: Activity[], sunday: Activity[] }
 * @returns {Object} { Accommodation, Activities, 'Food & Dining', Transport, total }
 */
export function calculateCategoryBreakdown(itinerary) {
  const breakdown = {
    Accommodation: 0,
    Activities: 0,
    'Food & Dining': 0,
    Transport: 0,
  };

  const days = Object.values(itinerary);
  days.forEach((dayActivities) => {
    dayActivities.forEach((activity) => {
      const category = activity.category;
      if (category in breakdown) {
        breakdown[category] += activity.cost || 0;
      }
    });
  });

  breakdown.total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  return breakdown;
}

/**
 * Calculate budget for a single day.
 * @param {Array} activities - Array of activity objects
 * @returns {number} Total cost for the day
 */
export function calculateDayBudget(activities) {
  if (!activities || !Array.isArray(activities)) return 0;
  return activities.reduce((total, activity) => total + (activity.cost || 0), 0);
}

/**
 * Format a number as Indian Rupee currency string.
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get budget level label based on per-day cost.
 * @param {number} budgetPerDay - Daily budget amount
 * @returns {string} Budget level: 'Budget', 'Mid-Range', or 'Premium'
 */
export function getBudgetLevel(budgetPerDay) {
  if (budgetPerDay <= 2500) return 'Budget';
  if (budgetPerDay <= 4000) return 'Mid-Range';
  return 'Premium';
}

export default formatCurrency;
