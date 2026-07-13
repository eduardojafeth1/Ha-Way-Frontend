import { useState } from "react";
import {
  HiOutlineMapPin,
  HiOutlineMap,
} from "react-icons/hi2";

interface DeliveryLocationCardProps {
  address: string | null;
  onAddressClick: () => void;
  onMapClick: () => void;
}

export default function DeliveryLocationCard({
  address,
  onAddressClick,
  onMapClick,
}: DeliveryLocationCardProps) {

  /*
  ===========================================================
  BACKEND

  Aquí eventualmente se traerían las direcciones guardadas
  del usuario para saber si tiene o no una dirección default:

  const savedAddress =
      await userService.getDefaultAddress();

  Si savedAddress existe, se pasaría como prop `address`
  desde el componente padre (CreateOrder). Si no existe,
  se pasaría como null, y este componente automáticamente
  solo mostrará la opción de "Ver en mapa".
  ===========================================================
  */

  const hasAddress = !!address;

  const [selected, setSelected] = useState<"address" | "map" | null>(
    hasAddress ? "address" : "map"
  );

  return (
    <div className="space-y-4">

      {/* Mi dirección — solo se muestra si existe */}

      {hasAddress && (
        <button
          onClick={() => {
            setSelected("address");
            onAddressClick();
          }}
          className={`
            w-full
            border
            rounded-2xl
            p-5
            flex
            items-center
            gap-4
            transition-all
            ${
              selected === "address"
                ? "bg-[var(--primary)] border-[var(--primary)]"
                : "bg-white border-gray-200 hover:border-[var(--primary)]"
            }
          `}
        >
          <div className={`text-2xl ${selected === "address" ? "text-white" : "text-gray-600"}`}>
            <HiOutlineMapPin />
          </div>

          <div className="text-left">
            <h3 className={`font-semibold ${selected === "address" ? "text-white" : "text-gray-800"}`}>
              Mi dirección
            </h3>

            <p className={`text-sm ${selected === "address" ? "text-white/80" : "text-gray-500"}`}>
              {address}
            </p>
          </div>

        </button>
      )}

      {/* Ver mapa */}

      <button
        onClick={() => {
          setSelected("map");
          onMapClick();
        }}
        className={`
          w-full
          border
          rounded-2xl
          p-5
          flex
          items-center
          gap-4
          transition-all
          ${
            selected === "map"
              ? "bg-[var(--primary)] border-[var(--primary)]"
              : "bg-white border-gray-200 hover:border-[var(--primary)]"
          }
        `}
      >
        <div className={`text-2xl ${selected === "map" ? "text-white" : "text-gray-600"}`}>
          <HiOutlineMap />
        </div>

        <div className="text-left">

          <h3 className={`font-semibold ${selected === "map" ? "text-white" : "text-gray-800"}`}>
            Ver en mapa
          </h3>

          <p className={`text-sm ${selected === "map" ? "text-white/80" : "text-gray-500"}`}>
            {hasAddress
              ? "Ajusta tu ubicación exacta"
              : "Selecciona tu ubicación en el mapa"}
          </p>

        </div>

      </button>

    </div>
  );
}