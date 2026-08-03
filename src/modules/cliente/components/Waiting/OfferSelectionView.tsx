import { useState } from "react";
import { FaStar, FaRegClock, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import waterImage from "../../../../assets/images/logo.png"; // Fallback image

export interface Offer {
  id_oferta: number;
  precio: number;
  tiempo_estimado: number;
  distancia: number | null;
  conductor_nombre: string;
  conductor_apellido: string;
  calificacion: number | null;
  camion_foto: string | null;
  conductor_foto: string | null;
}

interface OfferSelectionViewProps {
  offers: Offer[];
  onConfirm: (offerId: number) => void;
  isConfirming: boolean;
}

export default function OfferSelectionView({ offers, onConfirm, isConfirming }: OfferSelectionViewProps) {
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  // Determinar badges (Mejor precio, Más cerca)
  const sortedByPrice = [...offers].sort((a, b) => Number(a.precio) - Number(b.precio));
  const sortedByTime = [...offers].sort((a, b) => a.tiempo_estimado - b.tiempo_estimado);
  
  const bestPriceId = sortedByPrice.length > 0 ? sortedByPrice[0].id_oferta : null;
  const closestId = sortedByTime.length > 0 ? sortedByTime[0].id_oferta : null;

  const handleConfirm = () => {
    if (selectedOfferId !== null && !isConfirming) {
      onConfirm(selectedOfferId);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-28">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h3 className="text-gray-800 font-semibold text-lg">Cercanos a ti</h3>
        <span className="bg-blue-100 text-[var(--primary)] text-sm font-semibold px-3 py-1 rounded-full">
          {offers.length} {offers.length === 1 ? 'cisterna' : 'cisternas'}
        </span>
      </div>

      {/* Lista de Ofertas */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {offers.map((offer) => {
          const isSelected = selectedOfferId === offer.id_oferta;
          const isBestPrice = offer.id_oferta === bestPriceId && offers.length > 1;
          const isClosest = offer.id_oferta === closestId && offers.length > 1;

          return (
            <div
              key={offer.id_oferta}
              onClick={() => setSelectedOfferId(offer.id_oferta)}
              className={`
                bg-white rounded-xl p-4 border-2 transition-all cursor-pointer shadow-sm
                ${isSelected ? "border-[var(--primary)]" : "border-gray-100 hover:border-gray-200"}
              `}
            >
              <div className="flex gap-4">
                {/* Imagen del camión */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={offer.camion_foto || offer.conductor_foto || waterImage}
                    alt={offer.conductor_nombre}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800 text-base">
                      {offer.conductor_nombre} {offer.conductor_apellido}
                    </h4>
                    
                    <div className="flex items-center text-sm font-medium text-[var(--primary)]">
                      <FaStar className="mr-1 mb-0.5" />
                      {Number(offer.calificacion || 5).toFixed(1)}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-1 flex items-center h-5">
                    {isBestPrice && !isClosest && (
                      <span className="bg-teal-400 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Mejor Precio
                      </span>
                    )}
                    {isClosest && (
                      <span className="bg-[var(--primary)] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Más Cerca
                      </span>
                    )}
                  </div>

                  {/* Tiempos y Precio */}
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-gray-500 text-xs space-y-1">
                      <div className="flex items-center">
                        <FaRegClock className="mr-1.5 text-gray-400" />
                        {offer.tiempo_estimado} min
                      </div>
                      <div className="flex items-center text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md inline-flex">
                        <FaMapMarkerAlt className="mr-1" />
                        {Number(offer.distancia || 0).toFixed(1)} Km
                      </div>
                    </div>

                    <div className="text-xl font-bold text-gray-900">
                      L {Number(offer.precio).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón de Confirmar (Fijo abajo o al final del flex) */}
      <div className="mt-6">
        <button
          onClick={handleConfirm}
          disabled={selectedOfferId === null || isConfirming}
          className={`
            w-full py-4 rounded-full font-semibold text-lg flex justify-center items-center gap-2 transition-all shadow-md
            ${
              selectedOfferId === null
                ? "bg-white border-2 border-gray-200 text-gray-400"
                : "bg-[var(--primary)] text-white hover:bg-blue-600"
            }
          `}
        >
          {isConfirming ? "Confirmando..." : "Confirmar Proveedor"}
          {!isConfirming && <FaCheckCircle className={selectedOfferId === null ? "text-gray-300" : "text-white"} />}
        </button>
        <p className="text-center text-[11px] text-gray-400 mt-3 px-4 leading-tight">
          Al confirmar, el proveedor recibirá tu ubicación exacta para iniciar la entrega.
        </p>
      </div>
    </div>
  );
}
