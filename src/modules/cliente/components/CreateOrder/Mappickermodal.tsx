import { useState } from "react";
import { HiOutlineXMark, HiOutlineViewfinderCircle } from "react-icons/hi2";
import type { LocationData } from "./location.types";
import LeafletMap from "./LeafletMap";

interface MapPickerModalProps {
  isOpen: boolean;
  initialAddress: string | null;
  onConfirm: (location: LocationData) => void;
  onClose: () => void;
}

export default function MapPickerModal({
  isOpen,
  initialAddress,
  onConfirm,
  onClose,
}: MapPickerModalProps) {

  const [addressText, setAddressText] = useState(initialAddress ?? "");
  const [coords, setCoords] = useState({
    lat: 14.0723,
    lng: -87.1921,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  /*
  ===========================================================
  INTEGRACIÓN FUTURA

  Este modal simula la selección de ubicación mientras no
  se integre un mapa real. Cuando se agregue la librería
  de mapas (ej. @react-google-maps/api o @vis.gl/react-google-maps),
  aquí se reemplazaría el recuadro gris por el mapa interactivo,
  con un pin central que el usuario arrastra, y el reverse
  geocoding se haría con la Geocoding API de Google en vez de
  Nominatim (que se usa abajo solo como fallback gratuito).
  ===========================================================
  */

  const handleUseCurrentLocation = () => {

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {

          // Reverse geocoding gratuito (OpenStreetMap Nominatim).
          // No requiere API key, pero tiene límite de uso;
          // para producción conviene migrar a Google Geocoding API.

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setAddressText(data.display_name ?? "Ubicación actual");

        } catch {

          setAddressText("Ubicación actual (sin dirección legible)");

        } finally {

          setIsLocating(false);

        }

      },

      () => {

        setError("No se pudo obtener tu ubicación. Actívala en los permisos del navegador.");
        setIsLocating(false);

      }

    );

  };

  const handleConfirm = () => {

    if (!addressText.trim()) {
      setError("Escribe o selecciona una dirección.");
      return;
    }

    onConfirm({
      address: addressText.trim(),
      lat: coords.lat,
      lng: coords.lng,
    });

  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        className="
          relative
          w-full
          max-w-md
          bg-white
          rounded-t-3xl
          p-6
          max-h-[85vh]
          overflow-y-auto
        "
      >

        <div className="flex items-center justify-between mb-6">

          <h2 className="font-bold text-xl text-gray-900">
            Ubicación de entrega
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            <HiOutlineXMark />
          </button>

        </div>

        {/* Placeholder del mapa (sin librería de mapas todavía) */}

        <div className="mb-4">

          <LeafletMap
            center={[coords.lat, coords.lng]}
            onLocationChange={(lat, lng, address) => {

              setCoords({ lat, lng });

              setAddressText(address);

            }}
          />

        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            border
            border-[var(--primary)]
            text-[var(--primary)]
            rounded-2xl
            py-3
            font-semibold
            mb-4
            hover:bg-gray-50
            transition-all
            disabled:opacity-60
          "
        >
          <HiOutlineViewfinderCircle className="text-xl" />
          {isLocating ? "Buscando tu ubicación..." : "Usar mi ubicación actual"}
        </button>

        <label className="text-sm text-gray-600 mb-1 block">
          Dirección
        </label>

        <input
          type="text"
          value={addressText}
          onChange={(e) => setAddressText(e.target.value)}
          placeholder="Escribe o ajusta la dirección"
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
            mb-2
          "
        />

        {error && (
          <p className="text-sm text-red-500 font-medium mb-2">
            {error}
          </p>
        )}

        <button
          onClick={handleConfirm}
          className="
            w-full
            bg-[var(--primary)]
            text-white
            py-4
            rounded-2xl
            font-bold
            text-lg
            hover:opacity-90
            transition
            mt-2
          "
        >
          Confirmar ubicación
        </button>

      </div>

    </div>
  );
}