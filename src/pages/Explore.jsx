import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import destinations from '../data/destinations.json';
import FilterSidebar from '../components/filters/FilterSidebar';
import DestinationGrid from '../components/destinations/DestinationGrid';
import MapView from '../components/map/MapView';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useTripStore } from '../store/tripStore';

export function Explore() {
  const navigate = useNavigate();
  const filters = useTripStore((state) => state.filters);
  const favoriteDestinations = useTripStore((state) => state.favoriteDestinations);
  const updateFilters = useTripStore((state) => state.updateFilters);
  const toggleFavorite = useTripStore((state) => state.toggleFavorite);
  const setDestination = useTripStore((state) => state.setDestination);
  const selectedDestination = useTripStore((state) => state.selectedDestination);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const currentVibe = filters.vibe?.toLowerCase() || 'all';
      const matchVibe = currentVibe === 'all' || dest.vibe.toLowerCase() === currentVibe;
      const matchBudget = dest.budgetPerDay <= filters.budgetRange[1];
      const matchQuery = dest.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      return matchVibe && matchBudget && matchQuery;
    });
  }, [filters]);

  const sortedDestinations = useMemo(() => {
    const items = [...filteredDestinations];

    switch (filters.sortBy) {
      case 'budget-low':
        return items.sort((a, b) => a.budgetPerDay - b.budgetPerDay);
      case 'budget-high':
        return items.sort((a, b) => b.budgetPerDay - a.budgetPerDay);
      case 'name':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'recommended':
      default:
        return items.sort((a, b) => {
          const aScore = favoriteDestinations.includes(a.id) ? 10 : 0 + (a.vibe.toLowerCase() === (filters.vibe || 'all').toLowerCase() ? 5 : 0);
          const bScore = favoriteDestinations.includes(b.id) ? 10 : 0 + (b.vibe.toLowerCase() === (filters.vibe || 'all').toLowerCase() ? 5 : 0);
          return bScore - aScore;
        });
    }
  }, [filteredDestinations, favoriteDestinations, filters.sortBy, filters.vibe]);

  const recommendedDestinations = useMemo(() => {
    const base = sortedDestinations.length ? sortedDestinations : destinations;
    const savedVibe =
      favoriteDestinations.length > 0
        ? destinations.find((dest) => dest.id === favoriteDestinations[0])?.vibe || 'Adventure'
        : filters.vibe !== 'all'
          ? filters.vibe
          : 'Adventure';

    return base
      .filter((dest) => dest.vibe.toLowerCase() === savedVibe.toLowerCase())
      .slice(0, 3);
  }, [favoriteDestinations, filters.vibe, sortedDestinations]);

  const mapMarkers = useMemo(() => {
    return sortedDestinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      coordinates: dest.coordinates,
      icon: dest.vibe === 'nature' ? '🌿' : 
            dest.vibe === 'city' ? '🏙️' : 
            dest.vibe === 'adventure' ? '⛰️' : 
            dest.vibe === 'beach' ? '🏖️' : '🏛️',
    }));
  }, [sortedDestinations]);

  const handleSelect = (dest) => {
    setDestination(dest);
    navigate('/planner');
  };

  const handleSortChange = (event) => {
    updateFilters({ sortBy: event.target.value });
  };

  const sortCycle = ['recommended', 'budget-low', 'budget-high', 'name'];

  const handleSortButtonClick = () => {
    const currentIndex = sortCycle.indexOf(filters.sortBy || 'recommended');
    const nextIndex = (currentIndex + 1) % sortCycle.length;
    updateFilters({ sortBy: sortCycle[nextIndex] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
      <p className="text-gray-600 mb-8">Find your perfect weekend escape</p>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Recommended for you</p>
          <p className="text-xs text-gray-500">{favoriteDestinations.length ? 'Based on saved places' : 'Popular weekend picks'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSortButtonClick}
            aria-label="Sort destinations"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Sort destinations
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <span className="sr-only">Sort destinations</span>
            <select
              value={filters.sortBy || 'recommended'}
              onChange={handleSortChange}
              aria-label="Sort destinations"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="recommended">Recommended</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      {recommendedDestinations.length > 0 && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {recommendedDestinations.map((destination) => (
            <div key={destination.id} className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recommended</p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{destination.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{destination.vibe} · {destination.budgetPerDay ? `₹${destination.budgetPerDay.toLocaleString()}/day` : 'Budget friendly'}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => handleSelect(destination)}>
                Explore now
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <FilterSidebar filters={filters} onFilterChange={updateFilters} />
        </aside>

        <main className="flex-1 min-w-0">
          <DestinationGrid
            destinations={sortedDestinations}
            onSelect={handleSelect}
            onToggleFavorite={toggleFavorite}
            onViewDetails={setSelectedDetails}
            favoriteDestinations={favoriteDestinations}
            selectedId={selectedDestination?.id}
          />
        </main>

        <aside className="hidden lg:block lg:w-80 shrink-0">
          <div className="sticky top-24 h-[calc(100vh-8rem)] rounded-xl overflow-hidden border border-gray-200">
            <MapView
              markers={mapMarkers}
              center={selectedDestination?.coordinates || [20.5937, 78.9629]}
            />
          </div>
        </aside>
      </div>

      <Modal isOpen={Boolean(selectedDetails)} onClose={() => setSelectedDetails(null)} title={selectedDetails?.name || 'Destination details'}>
        {selectedDetails && (
          <div className="space-y-4">
            <img src={selectedDetails.image} alt={selectedDetails.name} className="h-48 w-full rounded-xl object-cover" />
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">{selectedDetails.vibe}</span>
              <span className="text-sm font-medium text-gray-700">₹{selectedDetails.budgetPerDay.toLocaleString()}/day</span>
            </div>
            <p className="text-sm text-gray-600">{selectedDetails.description}</p>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Highlights</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {selectedDetails.activities.slice(0, 4).map((activity) => (
                  <li key={activity.id} className="flex items-start gap-2">
                    <span aria-hidden="true">{activity.icon || '✨'}</span>
                    <span>{activity.name} · {activity.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full" onClick={() => handleSelect(selectedDetails)}>
              Plan this trip
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Explore;
