import React, { memo } from 'react';

export const SkeletonCard = memo(function SkeletonCard({ className = '' } = {}) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm space-y-3 ${className}`.trim()}
    >
      <div className="skeleton rounded-xl aspect-video w-full" />
      <div className="space-y-2 pt-1">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export default SkeletonCard;
