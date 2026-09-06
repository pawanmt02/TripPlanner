import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import destinations from '../data/destinations.json';
import DestinationCard from '../components/destinations/DestinationCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useTripStore } from '../store/tripStore';

export function Dashboard() {
  const navigate = useNavigate();
  const setDestination = useTripStore((state) => state.setDestination);
  const updateFilters = useTripStore((state) => state.updateFilters);

  const featuredDestinations = destinations.slice(0, 4);

  const vibes = [
    { label: 'Nature', emoji: '🌿', value: 'nature' },
    { label: 'City', emoji: '🏙️', value: 'city' },
    { label: 'Adventure', emoji: '⛰️', value: 'adventure' },
    { label: 'Beach', emoji: '🏖️', value: 'beach' },
    { label: 'Heritage', emoji: '🏛️', value: 'heritage' },
  ];

  const handleVibeClick = (vibe) => {
    updateFilters({ vibe });
    navigate('/explore');
  };

  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    navigate('/planner');
  };

  return (
    <main>
      <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">ESCAPE</h1>
          <p className="text-xl md:text-2xl text-white/80 mb-2">Plan Your Perfect Weekend Getaway</p>
          <p className="text-white/60 mb-8 max-w-2xl mx-auto">Discover handpicked destinations, build your itinerary with drag & drop, and track your budget — all in one place.</p>
          <Link to="/explore">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 border-0">Start Exploring →</Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Vibe</h2>
        <div className="flex flex-wrap gap-4">
          {vibes.map((vibe) => (
            <button
              key={vibe.value}
              onClick={() => handleVibeClick(vibe.value)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full hover:border-primary hover:shadow-sm transition-all text-gray-800 font-medium cursor-pointer"
            >
              <span className="text-xl" aria-hidden="true">{vibe.emoji}</span>
              {vibe.label}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onClick={() => handleDestinationSelect(dest)}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/50 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-8 text-gray-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🗺️</span> 12+ Destinations
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🎯</span> 70+ Activities
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">✨</span> 100% Free
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
