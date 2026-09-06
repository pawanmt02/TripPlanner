import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '../../utils/budgetCalculator';

export const TimeSlot = memo(({ activity, onRemove, onNotesChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: activity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100 group"
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-12a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </button>
      <span className="text-xl w-8 text-center" aria-hidden="true">
        {activity.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{activity.name}</p>
        <p className="text-xs text-gray-500">
          {activity.duration} • {activity.category}
        </p>
      </div>
      <span className="text-sm font-semibold text-primary whitespace-nowrap">
        {formatCurrency(activity.cost)}
      </span>
      {onRemove && (
        <button
          onClick={() => onRemove(activity.id)}
          aria-label={`Remove ${activity.name} from itinerary`}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500/50"
        >
          ✕
        </button>
      )}
    </div>
  );
});

export default TimeSlot;
