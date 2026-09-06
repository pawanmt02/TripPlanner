import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import destinations from '../data/destinations.json';
import FilterSidebar from '../components/filters/FilterSidebar';
import DestinationGrid from '../components/destinations/DestinationGrid';
import MapView from '../components/map/MapView';
import { useTripStore } from '../store/tripStore';

export function Explore() {
  const navigate = useNavigate();
  const filters = useTripStore((state) => state.filters);
  const updateFilters = useTripStore((state) => state.updateFilters);
  const setDestination = useTripStore((state) => state.setDestination);
  const selectedDestination = useTripStore((state) => state.selectedDestination);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const currentVibe = filters.vibe?.toLowerCase() || 'all';
      const matchVibe = currentVibe === 'all' || dest.vibe.toLowerCase() === currentVibe;
      const matchBudget = dest.budgetPerDay <= filters.budgetRange[1];
      const matchQuery = dest.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      return matchVibe && matchBudget && matchQuery;
    });
  }, [filters]);

  const mapMarkers = useMemo(() => {
    return filteredDestinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      coordinates: dest.coordinates,
      icon: dest.vibe === 'nature' ? '🌿' : 
            dest.vibe === 'city' ? '🏙️' : 
            dest.vibe === 'adventure' ? '⛰️' : 
            dest.vibe === 'beach' ? '🏖️' : '🏛️',
    }));
  }, [filteredDestinations]);

  const handleSelect = (dest) => {
    setDestination(dest);
    navigate('/planner');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
      <p className="text-gray-600 mb-8">Find your perfect weekend escape</p>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <FilterSidebar filters={filters} onFilterChange={updateFilters} />
        </aside>
        
        <main className="flex-1 min-w-0">
          <DestinationGrid 
            destinations={filteredDestinations} 
            onSelect={handleSelect} 
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
    </div>
  );
}

export default Explore;
