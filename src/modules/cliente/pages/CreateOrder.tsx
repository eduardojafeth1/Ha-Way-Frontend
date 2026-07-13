import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { PREPARATION_TIME, OPENING_HOUR, CLOSING_HOUR } from "../../../constants/schedule";

import OrderQuantitySelector from "../components/CreateOrder/OrderQuantitySelector";
import DeliveryLocationCard from "../components/CreateOrder/DeliveryLocationCard";
import DeliverySchedule from "../components/CreateOrder/DeliverySchedule";
import TimeSelector from "../components/CreateOrder/TimeSelector";
import SavedAddressesModal from "../components/CreateOrder/Savedaddressesmodal";
import MapPickerModal from "../components/CreateOrder/Mappickermodal";
import PageHeader from "../components/PageHeader";
import type { LocationData, SavedAddress } from "../components/CreateOrder/location.types";

type DeliveryOption = "now" | "today" | "tomorrow";

// Forma final del pedido que se mandará al backend

interface OrderPayload {
  quantity: number;
  location: LocationData | null;
  schedule: DeliveryOption;
  time: string | null; // null si schedule === "now"
}

export default function CreateOrder() {

  const navigate = useNavigate();

  /*
  ===========================================================
  BACKEND

  Aquí obtendremos:

  - Direcciones guardadas del usuario
  - Cantidad disponible
  - Ubicación actual / dirección por defecto

  const user = await userService.getProfile();

  const availableBarrels =
      await providerService.getAvailableBarrels();

  const savedAddresses: SavedAddress[] =
      await userService.getSavedAddresses();

  const defaultAddress =
      savedAddresses.find((a) => a.id === user.defaultAddressId) ?? null;

  ===========================================================
  */

  // Direcciones guardadas (mock mientras no hay backend)

  const [savedAddresses] = useState<SavedAddress[]>([
    {
      id: 1,
      label: "Casa",
      address: "Colonia Palmira, Tegucigalpa",
      lat: null,
      lng: null,
    },
    {
      id: 2,
      label: "Oficina",
      address: "Boulevard Morazán, Tegucigalpa",
      lat: null,
      lng: null,
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);

  const [location, setLocation] = useState<LocationData | null>(
    savedAddresses[0] ?? null
  );

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [quantity, setQuantity] = useState(20);

  const [schedule, setSchedule] = useState<DeliveryOption>("today");

  const [time, setTime] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWithinWorkingHoursNow = useMemo(() => {

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const opening = OPENING_HOUR * 60;
    const closing = CLOSING_HOUR * 60;

    // Debe quedar tiempo suficiente antes del cierre para preparar el pedido

    return (
      nowMinutes >= opening &&
      nowMinutes + PREPARATION_TIME <= closing
    );

  }, []);

  // El pedido es válido si:
  // - hay una ubicación seleccionada
  // - si el schedule requiere hora (today/tomorrow), esa hora debe existir
  // - si el schedule es "now", debe estar dentro de horario laboral

  const isValid = useMemo(() => {

    if (!location) return false;

    if (schedule === "now") {
      return isWithinWorkingHoursNow;
    }

    if (!time) return false;

    return true;

  }, [location, schedule, time, isWithinWorkingHoursNow]);

  // Selección de una dirección guardada

  const handleSelectSavedAddress = (item: SavedAddress) => {

    setSelectedAddressId(item.id);

    setLocation({
      address: item.address,
      lat: item.lat,
      lng: item.lng,
    });

    setIsAddressModalOpen(false);

  };

  // Confirmación de ubicación desde el mapa

  const handleConfirmMapLocation = (newLocation: LocationData) => {

    setSelectedAddressId(null); // ya no corresponde a una dirección guardada
    setLocation(newLocation);
    setIsMapModalOpen(false);
    setIsAddressModalOpen(false);

  };

  const handleSubmit = async () => {

    if (!isValid || isSubmitting) return;

    const payload: OrderPayload = {
      quantity,
      location,
      schedule,
      time: schedule === "now" ? null : time,
    };

    console.log("Payload a enviar:", payload);

    setIsSubmitting(true);

    /*
    =========================================

    BACKEND

    try {

      const result = await orderService.searchProviders(payload);

      navigate(PATHS.CLIENT.PROVIDERS, {
        state: { orderId: result.id },
      });

    } catch (error) {

      console.error(error);
      // mostrar toast/error al usuario

    } finally {

      setIsSubmitting(false);

    }

    =========================================
    */

    setTimeout(() => {

      setIsSubmitting(false);

      navigate(PATHS.CLIENT.WAITING);

    }, 1000);

  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <PageHeader
        title="Pedido"
        onClose={() => navigate(PATHS.CLIENT.HOME)}
      />

      <div className="px-5 py-6 space-y-8">

        {/* Cantidad */}

        <section>

          <h2 className="font-bold text-xl mb-4">
            Cantidad de barriles
          </h2>

          <OrderQuantitySelector
            available={50}
            onQuantityChange={setQuantity}
          />

        </section>

        {/* Dirección */}

        <section>

          <h2 className="font-bold text-xl mb-4">
            Lugar de entrega
          </h2>

          <DeliveryLocationCard
            address={location?.address ?? null}
            onAddressClick={() => setIsAddressModalOpen(true)}
            onMapClick={() => setIsMapModalOpen(true)}
          />

        </section>

        {/* Programación */}

        <section>

          <h2 className="font-bold text-xl mb-4">
            Programar entrega
          </h2>

          <DeliverySchedule
            onScheduleChange={(value) => {
              setSchedule(value);
            }}
          />

        </section>

        {/* Hora */}

        <section>

          <h2 className="font-bold text-xl mb-4">
            Hora de entrega
          </h2>

          <TimeSelector
            schedule={schedule}
            onTimeChange={(value) => {
              setTime(value);
            }}
          />

        </section>

        {schedule === "now" && !isWithinWorkingHoursNow && (
          <p className="text-sm text-red-500 font-medium -mt-4">
            Ya no es posible enviar tu pedido de inmediato, estamos fuera de horario.
            Selecciona "Hoy" o "Mañana" para elegir una hora.
          </p>
        )}

        {/* Botón */}

        <button
          disabled={!isValid || isSubmitting}
          className={`
            w-full
            py-4
            rounded-2xl
            font-bold
            text-lg
            transition
            ${
              !isValid || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--primary)] text-white hover:opacity-90"
            }
          `}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Buscando..." : "Buscar proveedores"}
        </button>

      </div>

      {/* Modales */}

      <SavedAddressesModal
        isOpen={isAddressModalOpen}
        addresses={savedAddresses}
        selectedId={selectedAddressId}
        onSelect={handleSelectSavedAddress}
        onAddNew={() => {
          setIsAddressModalOpen(false);
          setIsMapModalOpen(true);
        }}
        onClose={() => setIsAddressModalOpen(false)}
      />

      <MapPickerModal
        isOpen={isMapModalOpen}
        initialAddress={location?.address ?? null}
        onConfirm={handleConfirmMapLocation}
        onClose={() => setIsMapModalOpen(false)}
      />

    </div>
  );
}