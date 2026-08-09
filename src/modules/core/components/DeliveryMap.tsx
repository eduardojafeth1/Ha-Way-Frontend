import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";

interface DeliveryMapProps {
  latitude: number;
  longitude: number;
  address: string;
  referencia?: string | null;
}

const DEFAULT_ZOOM = 16;

// Pin personalizado (mismo color/estilo que el resto de la app) para
// evitar el problema típico de los íconos rotos de Leaflet con bundlers.
const pinIcon = L.divIcon({
  className: "",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="#0260eb">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
    </svg>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34],
});

/**
 * Mapa de solo lectura que muestra la dirección de entrega del pedido.
 * A diferencia del selector de ubicación (LeafletMap), este mapa no se
 * arrastra: solo muestra un pin fijo en la dirección guardada del pedido.
 */
export default function DeliveryMap({ latitude, longitude, address, referencia }: DeliveryMapProps) {
  const hasValidCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

  if (!hasValidCoords) {
    // Si por alguna razón la dirección no tiene coordenadas guardadas,
    // igual mostramos la dirección en texto en vez de un mapa vacío/roto.
    return (
      <div className="w-full rounded-xl bg-gray-100 p-4 flex items-start gap-3">
        <FaMapMarkerAlt className="text-[var(--primary)] mt-1 shrink-0" />
        <div>
          <p className="font-semibold text-gray-800">{address}</p>
          {referencia && <p className="text-sm text-gray-500">{referencia}</p>}
        </div>
      </div>
    );
  }

  const position: [number, number] = [latitude, longitude];

  return (
    <div className="w-full">
      <div className="w-full h-44 rounded-xl overflow-hidden relative z-0">
        <MapContainer
          center={position}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={pinIcon}>
            <Popup>
              <strong>{address}</strong>
              {referencia && <div>{referencia}</div>}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Dirección en texto, siempre visible debajo del mapa */}
      <div className="flex items-start gap-3 mt-3 bg-white rounded-xl p-3 border border-gray-100">
        <FaMapMarkerAlt className="text-[var(--primary)] mt-1 shrink-0" />
        <div>
          <p className="font-semibold text-gray-800">{address}</p>
          {referencia && <p className="text-sm text-gray-500">{referencia}</p>}
        </div>
      </div>
    </div>
  );
}
