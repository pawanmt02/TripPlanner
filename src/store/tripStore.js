import { create } from 'zustand';
import { calculateCategoryBreakdown } from '../utils/budgetCalculator';

const useTripStore = create((set) => ({
  // --- Destination State ---
  selectedDestination: null,
  filters: {
    vibe: 'all',
    budgetRange: [0, 6000],
    searchQuery: '',
    sortBy: 'recommended',
  },

  favoriteDestinations: [],

  // --- Itinerary State ---
  itinerary: {
    friday: [],
    saturday: [],
    sunday: [],
  },

  // --- Budget State (computed) ---
  budget: {
    Accommodation: 0,
    Activities: 0,
    'Food & Dining': 0,
    Transport: 0,
    total: 0,
  },

  // --- Actions: Destination ---
  setDestination: (destination) =>
    set({
      selectedDestination: destination,
      itinerary: { friday: [], saturday: [], sunday: [] },
      budget: { Accommodation: 0, Activities: 0, 'Food & Dining': 0, Transport: 0, total: 0 },
    }),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  toggleFavorite: (destinationId) =>
    set((state) => ({
      favoriteDestinations: state.favoriteDestinations.includes(destinationId)
        ? state.favoriteDestinations.filter((id) => id !== destinationId)
        : [...state.favoriteDestinations, destinationId],
    })),

  // --- Actions: Itinerary ---
  addActivity: (day, activity) =>
    set((state) => {
      // Prevent duplicates within the same day
      const dayActivities = state.itinerary[day];
      if (dayActivities.some((a) => a.id === activity.id)) return state;

      const newItinerary = {
        ...state.itinerary,
        [day]: [...dayActivities, { ...activity, daySlot: day }],
      };
      return {
        itinerary: newItinerary,
        budget: calculateCategoryBreakdown(newItinerary),
      };
    }),

  removeActivity: (day, activityId) =>
    set((state) => {
      const newItinerary = {
        ...state.itinerary,
        [day]: state.itinerary[day].filter((a) => a.id !== activityId),
      };
      return {
        itinerary: newItinerary,
        budget: calculateCategoryBreakdown(newItinerary),
      };
    }),

  reorderActivities: (day, oldIndex, newIndex) =>
    set((state) => {
      const items = [...state.itinerary[day]];
      const [movedItem] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, movedItem);
      return {
        itinerary: { ...state.itinerary, [day]: items },
      };
    }),

  moveActivityBetweenDays: (fromDay, toDay, activityId, toIndex) =>
    set((state) => {
      const fromItems = state.itinerary[fromDay].filter((a) => a.id !== activityId);
      const movedActivity = state.itinerary[fromDay].find((a) => a.id === activityId);
      if (!movedActivity) return state;

      const toItems = [...state.itinerary[toDay]];
      const insertAt = toIndex !== undefined ? toIndex : toItems.length;
      toItems.splice(insertAt, 0, { ...movedActivity, daySlot: toDay });

      const newItinerary = {
        ...state.itinerary,
        [fromDay]: fromItems,
        [toDay]: toItems,
      };
      return {
        itinerary: newItinerary,
        budget: calculateCategoryBreakdown(newItinerary),
      };
    }),

  updateNotes: (day, activityId, notes) =>
    set((state) => {
      const newItinerary = {
        ...state.itinerary,
        [day]: state.itinerary[day].map((a) =>
          a.id === activityId ? { ...a, notes } : a
        ),
      };
      return { itinerary: newItinerary };
    }),

  // --- Actions: Reset ---
  resetTrip: () =>
    set({
      selectedDestination: null,
      itinerary: { friday: [], saturday: [], sunday: [] },
      budget: { Accommodation: 0, Activities: 0, 'Food & Dining': 0, Transport: 0, total: 0 },
    }),
}));

export { useTripStore };
export default useTripStore;
