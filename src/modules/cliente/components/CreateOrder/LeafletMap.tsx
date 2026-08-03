import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import type { LatLngExpression } from "leaflet";

interface LeafletMapProps {
  center: LatLngExpression;
  onLocationChange: (
    lat: number,
    lng: number,
    address: string
  ) => void;
}

const DEFAULT_ZOOM = 17;

/*
=====================================================

Este componente contiene únicamente la lógica del mapa.

- Muestra OpenStreetMap.
- Permite mover el mapa.
- Cada vez que el usuario deja de mover el mapa,
  obtiene la dirección mediante Nominatim.

=====================================================
*/

function ChangeCenter({
  center,
}: {
  center: LatLngExpression;
}) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const [newLat, newLng] = center as [number, number];
    
    // Solo actualiza el centro si la diferencia es significativa.
    // Esto evita un bucle infinito ("jumping") cuando el usuario
    // arrastra el mapa y el estado actualiza el prop `center`.
    if (
      Math.abs(currentCenter.lat - newLat) > 0.0001 ||
      Math.abs(currentCenter.lng - newLng) > 0.0001
    ) {
      map.setView(center);
    }
  }, [center, map]);

  return null;
}

function MapLifecycle() {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate size after a short delay to allow for modal animations/layout
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timeout);
  }, [map]);

  return null;
}

function LocationEvents({
  onLocationChange,
}: {
  onLocationChange: (
    lat: number,
    lng: number,
    address: string
  ) => void;
}) {
  const map = useMapEvents({
    async moveend() {
      const center = map.getCenter();

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${center.lat}&lon=${center.lng}`
        );

        const data = await response.json();
        
        let newAddress = "Ubicación seleccionada";
        if (data.address) {
          const { road, suburb, neighbourhood, city, town, village } = data.address;
          const parts = [road, suburb || neighbourhood, city || town || village].filter(Boolean);
          if (parts.length > 0) {
            newAddress = parts.join(", ");
          } else if (data.display_name) {
            newAddress = data.display_name.split(",").slice(0, 3).join(", ");
          }
        }

        onLocationChange(
          center.lat,
          center.lng,
          newAddress
        );
      } catch {
        onLocationChange(
          center.lat,
          center.lng,
          ""
        );
      }
    },
  });

  return null;
}

export default function LeafletMap({
  center,
  onLocationChange,
}: LeafletMapProps) {
  return (
  <div className="relative w-full h-60">

        <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full rounded-2xl z-0"
        scrollWheelZoom
        >
        <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeCenter center={center} />
        <MapLifecycle />
        <LocationEvents
            onLocationChange={onLocationChange}
        />
        </MapContainer>

        {/* Pin fijo */}

        <div
        className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-full
            z-[1000]
        "
        >

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="var(--primary)"
        >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
        </svg>

        </div>

    </div>
    );
}