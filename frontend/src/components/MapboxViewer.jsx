import React, { useMemo } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Map as MapIcon } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * A reusable Mapbox viewer that handles missing tokens and missing coordinates gracefully.
 *
 * @param {Array<number>} coordinates [longitude, latitude]
 * @param {string} title Marker tooltip/label
 * @param {number} zoom Default zoom level
 * @param {string} height CSS height for the map container
 */
const MapboxViewer = ({
  coordinates,
  title = 'Location',
  zoom = 5,
  height = '400px',
}) => {
  // Check if token is present and looks relatively valid
  const hasValidToken =
    MAPBOX_TOKEN &&
    MAPBOX_TOKEN.trim() !== '' &&
    MAPBOX_TOKEN !== 'your_mapbox_public_token_here';

  // Check if coordinates exist and are a 2-element array of numbers
  const hasValidCoords =
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number';

  // Fallback UI if dependencies aren't met
  if (!hasValidToken || !hasValidCoords) {
    return (
      <div 
        className="w-full rounded-2xl glass flex flex-col items-center justify-center p-8 text-center"
        style={{ height }}
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <MapIcon size={28} className="text-gray-500" />
        </div>
        {!hasValidCoords ? (
          <>
            <h3 className="text-xl font-bold text-white mb-2">Location Data Unavailable</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              We don&apos;t have precise coordinates for {title} yet. Explore the details above instead!
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Map</h3>
            <p className="text-gray-400 text-sm max-w-sm mb-4">
              Mapbox token is missing. Please add a valid <code>VITE_MAPBOX_TOKEN</code> to your <code>.env</code> file.
            </p>
            <div className="bg-white/5 px-4 py-2 rounded-lg inline-block text-xs text-gray-400">
              <MapPin size={12} className="inline mr-1 text-india-orange" />
              Recorded Coords: {coordinates[1].toFixed(2)}°N, {coordinates[0].toFixed(2)}°E
            </div>
          </>
        )}
      </div>
    );
  }

  // Configuration for initial view state
  const initialViewState = useMemo(
    () => ({
      longitude: coordinates[0],
      latitude: coordinates[1],
      zoom: zoom,
      pitch: 45,
    }),
    [coordinates, zoom]
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
      style={{ height }}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" />
        <Marker
          longitude={coordinates[0]}
          latitude={coordinates[1]}
          anchor="bottom"
          pitchAlignment="map"
        >
          <div className="relative group cursor-pointer">
            <MapPin size={32} className="text-india-orange drop-shadow-lg scale-110" weight="fill" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 
                            bg-navy text-white text-xs font-bold rounded-lg opacity-0 
                            group-hover:opacity-100 transition-opacity shadow-xl border border-white/10 pointer-events-none">
              {title}
            </div>
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MapboxViewer;
