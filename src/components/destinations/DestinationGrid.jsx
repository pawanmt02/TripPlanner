import React, { memo } from 'react';
import DestinationCard from './DestinationCard';

export const DestinationGrid = memo(function DestinationGrid({
  destinations = [],
  onSelect,
  selectedId,
  onReset,
  className = '',
}) {
  if (!destinations || destinations.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-gray-200"
      >
        <div
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl text-gray-500"
          aria-hidden="true"
        >
          🔍
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No destinations match your filters
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          Try adjusting your vibe selection, increasing your daily budget, or resetting filters to find destinations.
        </p>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`.trim()}
    >
      {destinations.map((dest) => (
        <DestinationCard
          key={dest.id}
          destination={dest}
          onClick={() => onSelect?.(dest)}
          isSelected={dest.id === selectedId}
        />
      ))}
    </div>
  );
});

DestinationGrid.displayName = 'DestinationGrid';

export default DestinationGrid;
