import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTripStore } from '../store/tripStore';
import ItineraryBuilder from '../components/itinerary/ItineraryBuilder';
import BudgetSummary from '../components/budget/BudgetSummary';
import MapView from '../components/map/MapView';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatCurrency } from '../utils/budgetCalculator';

export function Planner() {
  const navigate = useNavigate();
  const selectedDestination = useTripStore((state) => state.selectedDestination);
  const itinerary = useTripStore((state) => state.itinerary);
  const addActivity = useTripStore((state) => state.addActivity);
  const budget = useTripStore((state) => state.budget);
  const resetTrip = useTripStore((state) => state.resetTrip);

  const itineraryRef = useRef(null);

  if (!selectedDestination) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Destination Selected</h2>
        <p className="text-gray-600 mb-8">Please select a destination first to start planning your trip.</p>
        <Link to="/explore">
          <Button>Explore Destinations</Button>
        </Link>
      </div>
    );
  }

  const handleNewTrip = () => {
    resetTrip();
    navigate('/explore');
  };

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      let y = 60;

      pdf.setFontSize(20);
      pdf.text(`${selectedDestination.name} Trip Plan`, margin, y);
      y += 28;

      pdf.setFontSize(11);
      pdf.text(`Vibe: ${selectedDestination.vibe}`, margin, y);
      y += 18;
      pdf.text(`Estimated budget: ${formatCurrency(budget.total || 0)}`, margin, y);
      y += 18;
      pdf.text(`Activities planned: ${Object.values(itinerary).reduce((total, items) => total + items.length, 0)}`, margin, y);
      y += 26;

      const dayOrder = ['friday', 'saturday', 'sunday'];
      dayOrder.forEach((day) => {
        const dayItems = itinerary[day];
        if (!dayItems.length) {
          if (y > pageHeight - 80) {
            pdf.addPage();
            y = 60;
          }
          pdf.setFontSize(12);
          pdf.text(`${day.charAt(0).toUpperCase() + day.slice(1)}: No activities planned`, margin, y);
          y += 20;
          return;
        }

        if (y > pageHeight - 100) {
          pdf.addPage();
          y = 60;
        }

        pdf.setFontSize(12);
        pdf.text(`${day.charAt(0).toUpperCase() + day.slice(1)}`, margin, y);
        y += 18;

        dayItems.forEach((item) => {
          if (y > pageHeight - 80) {
            pdf.addPage();
            y = 60;
          }

          const line = `• ${item.name} — ${item.duration || 'Flexible'} — ${formatCurrency(item.cost || 0)}`;
          const wrappedLines = pdf.splitTextToSize(line, pageWidth - (margin * 2));
          pdf.text(wrappedLines, margin, y);
          y += wrappedLines.length * 16;
        });

        y += 12;
      });

      pdf.save(`escape-${selectedDestination.name.toLowerCase().replace(/\s+/g, '-')}-itinerary.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export itinerary to PDF. Please try again.');
    }
  };

  const isActivityAdded = (activityId) => {
    return ['friday', 'saturday', 'sunday'].some((day) => 
      itinerary[day].some((item) => item.id === activityId)
    );
  };

  const mapMarkers = selectedDestination.activities.map((act) => ({
    id: act.id,
    name: act.name,
    coordinates: selectedDestination.coordinates, // Using destination coordinates as simplified fallback
    icon: act.icon || '📍',
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Plan: {selectedDestination.name}</h1>
          <Badge variant="primary" className="capitalize">{selectedDestination.vibe}</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportPDF}>Export PDF</Button>
          <Button variant="primary" onClick={handleNewTrip}>New Trip</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="font-semibold text-gray-900 mb-4">Available Activities</h2>
            <div className="space-y-3">
              {selectedDestination.activities.map((activity) => (
                <div key={activity.id} className="border border-gray-200 p-3 rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm flex items-center gap-1">
                        <span aria-hidden="true">{activity.icon || '🎯'}</span> {activity.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{activity.duration} • {formatCurrency(activity.cost)}</p>
                    </div>
                    {isActivityAdded(activity.id) ? (
                      <Badge variant="success" className="text-[10px]">Added</Badge>
                    ) : (
                      <button
                        onClick={() => addActivity('friday', activity)}
                        className="text-primary hover:bg-primary-50 p-1 rounded transition-colors cursor-pointer"
                        aria-label={`Add ${activity.name}`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6" ref={itineraryRef}>
          <ItineraryBuilder />
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-6 sticky top-24">
            <BudgetSummary />
            <div className="h-64 rounded-xl overflow-hidden border border-gray-200">
              <MapView center={selectedDestination.coordinates} zoom={12} markers={mapMarkers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
