import React, { useEffect, memo, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
 * Creates a Leaflet DivIcon for emoji or custom HTML markers.
 * @param {string} emoji
 * @param {string} [label]
 * @returns {L.DivIcon|undefined}
 */
export function createEmojiIcon(emoji, label = '') {
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
 * MapController sub-component that flies to new center coordinates when changed.
 */
export function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 12, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

/**
 * Main interactive MapView component for the ESCAPE trip planner.
 * Renders destination / activity markers, handles center flying, and supports child overlays.
 */
export const MapView = memo(
  forwardRef(function MapView(
    {
      center = [20.5937, 78.9629],
      zoom = 5,
      markers = [],
      onMarkerClick,
      className = '',
      children,
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`h-full min-h-[300px] rounded-xl overflow-hidden ${className}`.trim()}
        aria-label="Interactive map showing destinations"
        role="region"
        {...rest}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapController center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker, index) => {
            const position = marker.coordinates || marker.position;
            if (!position) return null;

            const markerKey = marker.id || `${position[0]}-${position[1]}-${index}`;
            const markerIconInstance = marker.icon
              ? createEmojiIcon(marker.icon, marker.name)
              : undefined;

            return (
              <Marker
                key={markerKey}
                position={position}
                icon={markerIconInstance}
                eventHandlers={{
                  click: () => onMarkerClick?.(marker),
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[120px] text-slate-800">
                    <strong className="block text-sm font-semibold text-slate-900 leading-tight">
                      {marker.name}
                    </strong>
                    {marker.cost !== undefined && marker.cost !== null && (
                      <p className="mt-1 text-xs text-slate-600 font-medium">
                        Cost:{' '}
                        <span className="text-teal-700 font-semibold">
                          {typeof marker.cost === 'number'
                            ? formatCurrency(marker.cost)
                            : marker.cost}
                        </span>
                      </p>
                    )}
                    {marker.category && (
                      <span className="mt-1 inline-block px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                        {marker.category}
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          {children}
        </MapContainer>
      </div>
    );
  })
);

MapView.displayName = 'MapView';

export default MapView;
