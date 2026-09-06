import React, { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TimeSlot from './TimeSlot';

export const DayColumn = memo(({ day, label, activities = [], onRemove, onNotesChange }) => {
  const { setNodeRef } = useDroppable({
    id: day,
  });

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl p-4 min-h-[200px]">
      <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
      <p className="text-xs text-gray-500 mb-3">{activities.length} activities planned</p>
      
      <div ref={setNodeRef} className="flex-1 flex flex-col gap-2 min-h-[100px]">
        <SortableContext
          items={activities.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {activities.map((activity) => (
            <TimeSlot
              key={activity.id}
              activity={activity}
              onRemove={onRemove}
              onNotesChange={onNotesChange}
            />
          ))}
        </SortableContext>
        
        {activities.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm h-full">
            Drag activities here to plan your {label}
          </div>
        )}
      </div>
    </div>
  );
});

export default DayColumn;
