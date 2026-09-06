import React, { memo, forwardRef, useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { formatCurrency } from '../../utils/budgetCalculator';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * Creates a Leaflet DivIcon for emoji markers.
 * @param {string} emoji
 * @param {string} [label]
 * @returns {L.DivIcon|undefined}
 */
function createEmojiIcon(emoji, label = '') {
  if (!emoji) return undefined;
  if (typeof emoji !== 'string') return emoji;
  return L.divIcon({
    className: 'custom-emoji-marker !bg-transparent !border-none',
    html: `<div class="flex items-center justify-center w-8 h-8 bg-white/95 rounded-full shadow-md border-2 border-teal-700 text-base leading-none select-none" role="img" aria-label="${label || emoji}">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

/**
 * Custom MapMarker component for rendering activities or locations on the map.
 * Displays a popup with name, cost, and an 'Add to plan' action button.
 */
export const MapMarker = memo(
  forwardRef(function MapMarker(
    { position, name, cost, icon, onClick, ...rest },
    ref
  ) {
    const markerPosition = position || rest.coordinates;

    const markerIcon = useMemo(() => {
      return createEmojiIcon(icon, name);
    }, [icon, name]);

    if (!markerPosition) return null;

    return (
      <Marker
        ref={ref}
        position={markerPosition}
        icon={markerIcon}
        {...rest}
      >
        <Popup>
          <div className="p-1 min-w-[140px] text-slate-800">
            <strong className="block text-sm font-semibold text-slate-900 leading-tight">
              {name}
            </strong>
            {cost !== undefined && cost !== null && (
              <p className="mt-1 text-xs text-slate-600 font-medium">
                Cost:{' '}
                <span className="text-teal-700 font-semibold">
                  {typeof cost === 'number' ? formatCurrency(cost) : cost}
                </span>
              </p>
            )}
            {onClick && (
              <button
                type="button"
                onClick={onClick}
                aria-label={`Add ${name} to plan`}
                className="mt-2.5 w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                Add to plan
              </button>
            )}
          </div>
        </Popup>
      </Marker>
    );
  })
);

MapMarker.displayName = 'MapMarker';

export default MapMarker;
