import React, { useState, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import useTripStore from '../../store/tripStore';
import DayColumn from './DayColumn';
import TimeSlot from './TimeSlot';

export const ItineraryBuilder = () => {
  const { itinerary, removeActivity, reorderActivities, moveActivityBetweenDays } = useTripStore();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    if (id === 'friday' || id === 'saturday' || id === 'sunday') {
      return id;
    }
    
    if (itinerary.friday?.find((a) => a.id === id)) return 'friday';
    if (itinerary.saturday?.find((a) => a.id === id)) return 'saturday';
    if (itinerary.sunday?.find((a) => a.id === id)) return 'sunday';
    
    return null;
  };

  const onDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    const overItems = itinerary[overContainer];
    
    let overIndex = 0;
    if (overId === overContainer) {
      overIndex = overItems.length + 1;
    } else {
      overIndex = overItems.findIndex((a) => a.id === overId);
      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      overIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    }

    moveActivityBetweenDays(activeContainer, overContainer, activeId, overIndex);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = itinerary[activeContainer].findIndex((a) => a.id === activeId);
      const overIndex = itinerary[overContainer].findIndex((a) => a.id === overId);

      if (activeIndex !== overIndex) {
        reorderActivities(activeContainer, activeIndex, overIndex);
      }
    }

    setActiveId(null);
  };

  const onDragCancel = () => {
    setActiveId(null);
  };

  const allActivities = useMemo(() => {
    return [
      ...(itinerary.friday || []),
      ...(itinerary.saturday || []),
      ...(itinerary.sunday || [])
    ];
  }, [itinerary]);
  
  const activeActivity = useMemo(() => {
    return activeId ? allActivities.find((a) => a.id === activeId) : null;
  }, [activeId, allActivities]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DayColumn
          day="friday"
          label="Friday"
          activities={itinerary.friday || []}
          onRemove={(id) => removeActivity('friday', id)}
        />
        <DayColumn
          day="saturday"
          label="Saturday"
          activities={itinerary.saturday || []}
          onRemove={(id) => removeActivity('saturday', id)}
        />
        <DayColumn
          day="sunday"
          label="Sunday"
          activities={itinerary.sunday || []}
          onRemove={(id) => removeActivity('sunday', id)}
        />
      </div>
      
      <DragOverlay>
        {activeActivity ? (
          <div className="opacity-80 scale-105 shadow-xl">
            <TimeSlot activity={activeActivity} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ItineraryBuilder;
