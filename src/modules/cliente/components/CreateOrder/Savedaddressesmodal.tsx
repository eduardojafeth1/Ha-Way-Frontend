import { HiOutlineXMark, HiOutlineMapPin, HiOutlinePlus } from "react-icons/hi2";
import type { SavedAddress } from "./location.types";

interface SavedAddressesModalProps {
  isOpen: boolean;
  addresses: SavedAddress[];
  selectedId: number | null;
  onSelect: (address: SavedAddress) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export default function SavedAddressesModal({
  isOpen,
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: SavedAddressesModalProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">

      {/* Fondo oscuro */}

      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}

      <div
        className="
          relative
          w-full
          max-w-md
          bg-white
          rounded-t-3xl
          p-6
          max-h-[80vh]
          overflow-y-auto
          animate-[slideUp_0.2s_ease-out]
        "
      >

        <div className="flex items-center justify-between mb-6">

          <h2 className="font-bold text-xl text-gray-900">
            Direcciones guardadas
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            <HiOutlineXMark />
          </button>

        </div>

        {/*
        ===========================================================
        BACKEND

        Aquí eventualmente se traerían las direcciones reales
        del usuario:

        const addresses = await userService.getSavedAddresses();

        Por ahora se reciben como prop `addresses` desde CreateOrder,
        donde están mockeadas.
        ===========================================================
        */}

        {addresses.length === 0 ? (

          <p className="text-gray-500 text-center py-6">
            Aún no tienes direcciones guardadas.
          </p>

        ) : (

          <div className="space-y-3">

            {addresses.map((item) => (

              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={`
                  w-full
                  border
                  rounded-2xl
                  p-4
                  flex
                  items-center
                  gap-4
                  text-left
                  transition-all
                  ${
                    selectedId === item.id
                      ? "bg-[var(--primary)] border-[var(--primary)]"
                      : "bg-white border-gray-200 hover:border-[var(--primary)]"
                  }
                `}
              >
                <div className={`text-2xl ${selectedId === item.id ? "text-white" : "text-gray-600"}`}>
                  <HiOutlineMapPin />
                </div>

                <div>
                  <h3 className={`font-semibold ${selectedId === item.id ? "text-white" : "text-gray-800"}`}>
                    {item.label}
                  </h3>

                  <p className={`text-sm ${selectedId === item.id ? "text-white/80" : "text-gray-500"}`}>
                    {item.address}
                  </p>
                </div>

              </button>

            ))}

          </div>

        )}

        {/* Agregar nueva dirección -> abre el selector de mapa */}

        <button
          onClick={onAddNew}
          className="
            w-full
            mt-4
            border
            border-dashed
            border-gray-300
            rounded-2xl
            p-4
            flex
            items-center
            justify-center
            gap-2
            text-[var(--primary)]
            font-semibold
            hover:bg-gray-50
            transition-all
          "
        >
          <HiOutlinePlus className="text-xl" />
          Agregar nueva dirección
        </button>

      </div>

    </div>
  );
}