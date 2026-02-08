'use client';

import { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface MapEmbedProps {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  className?: string;
  height?: string;
}

export function MapEmbed({
  address,
  city,
  state = 'TX',
  zipCode,
  latitude,
  longitude,
  name,
  className = '',
  height = '300px'
}: MapEmbedProps) {
  const [showMap, setShowMap] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  // Build full address string
  const fullAddress = [address, city, state, zipCode].filter(Boolean).join(', ');

  // Initialize Leaflet icon on client side
  useEffect(() => {
    setMounted(true);

    // Dynamically import Leaflet and set up custom icon
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setMarkerIcon(icon);
    });
  }, []);

  if (!fullAddress && !latitude) {
    return null;
  }

  // Default to Corsicana, TX if no coordinates provided
  const lat = latitude || 32.0954;
  const lon = longitude || -96.4689;

  // OpenStreetMap-based directions URL (opens in Google Maps for now, as it's most reliable)
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  // OpenStreetMap URL for "Open in Maps"
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Address header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {name && <p className="font-medium text-gray-900">{name}</p>}
            <p className="text-sm text-gray-600">{fullAddress}</p>
          </div>
        </div>
      </div>

      {/* Map or placeholder */}
      <div style={{ height }} className="relative bg-gray-100">
        {showMap && mounted ? (
          <MapContainer
            center={[lat, lon]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markerIcon && (
              <Marker position={[lat, lon]} icon={markerIcon}>
                <Popup>
                  <div className="text-sm">
                    {name && <p className="font-semibold">{name}</p>}
                    <p>{fullAddress}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to load map</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex divide-x divide-gray-100">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
        <a
          href={openStreetMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Maps
        </a>
      </div>
    </div>
  );
}

// Simple directions link for inline use
export function DirectionsLink({
  address,
  city,
  state = 'TX',
  latitude,
  longitude,
  className = ''
}: Omit<MapEmbedProps, 'name' | 'height'>) {
  const fullAddress = [address, city, state].filter(Boolean).join(', ');

  if (!fullAddress && !latitude) return null;

  const lat = latitude || 32.0954;
  const lon = longitude || -96.4689;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-medium ${className}`}
    >
      <Navigation className="w-4 h-4" />
      Get Directions
    </a>
  );
}
