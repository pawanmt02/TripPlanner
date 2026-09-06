import React, { memo } from 'react';
import SearchBar from '../ui/SearchBar';
import formatCurrency from '../../utils/budgetCalculator';

const VIBE_OPTIONS = ['All', 'Nature', 'City', 'Adventure', 'Beach', 'Heritage'];

export const FilterSidebar = memo(function FilterSidebar({
  filters = {
    vibe: 'All',
    budgetRange: [0, 6000],
    searchQuery: '',
  },
  onFilterChange,
  className = '',
}) {
  const currentVibe = filters?.vibe || 'All';
  const minBudget = filters?.budgetRange?.[0] ?? 0;
  const maxBudget = filters?.budgetRange?.[1] ?? 6000;
  const searchQuery = filters?.searchQuery || '';

  const handleVibeClick = (vibe) => {
    onFilterChange?.({ vibe });
  };

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    onFilterChange?.({
      budgetRange: [minBudget, value],
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange?.({
      searchQuery: e.target.value,
    });
  };

  const handleSearchClear = () => {
    onFilterChange?.({
      searchQuery: '',
    });
  };

  return (
    <aside
      aria-label="Filter destinations"
      className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-6 ${className}`.trim()}
    >
      {/* Section 1: Vibe Filter */}
      <section aria-labelledby="vibe-heading">
        <h3 id="vibe-heading" className="font-semibold text-gray-900 mb-3">
          Vibe
        </h3>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((v) => {
            const isActive =
              currentVibe.toLowerCase() === v.toLowerCase() ||
              (v === 'All' && currentVibe === 'all');

            return (
              <button
                key={v}
                type="button"
                onClick={() => handleVibeClick(v)}
                aria-pressed={isActive}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Budget Range Filter */}
      <section aria-labelledby="budget-heading">
        <h3 id="budget-heading" className="font-semibold text-gray-900 mb-3">
          Budget Range
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={6000}
            step={500}
            value={maxBudget}
            onChange={handleBudgetChange}
            aria-label="Maximum budget per day"
            aria-valuemin={0}
            aria-valuemax={6000}
            aria-valuenow={maxBudget}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Up to {formatCurrency(maxBudget)}/day</span>
            <span className="text-xs text-gray-400">₹6,000 max</span>
          </div>
        </div>
      </section>

      {/* Section 3: Search Filter */}
      <section aria-labelledby="search-heading">
        <h3 id="search-heading" className="font-semibold text-gray-900 mb-3">
          Search
        </h3>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search destinations..."
        />
      </section>
    </aside>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
