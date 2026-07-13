import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { PREPARATION_TIME, HOURS, OPENING_HOUR, CLOSING_HOUR } from "../../../constants/schedule";

import OrderQuantitySelector from "../components/CreateOrder/OrderQuantitySelector";
import DeliveryLocationCard from "../components/CreateOrder/DeliveryLocationCard";
import DeliverySchedule from "../components/CreateOrder/DeliverySchedule";
import TimeSelector from "../components/CreateOrder/TimeSelector";
import PageHeader from "../components/PageHeader";

type DeliveryOption = "now" | "today" | "tomorrow";

// Forma final del pedido que se mandará al backend

interface OrderPayload {
  quantity: number;
  address: string | null;
  schedule: DeliveryOption;
  time: string | null; // null si schedule === "now"
}

export default function CreateOrder() {

  const navigate = useNavigate();

  /*
  ===========================================================
  BACKEND

  Aquí obtendremos:

  - Dirección del usuario
  - Cantidad disponible
  - Ubicación actual

  const user = await userService.getProfile();

  const availableBarrels =
      await providerService.getAvailableBarrels();

  const defaultAddress =
      await userService.getDefaultAddress(); // string | null

  ===========================================================
  */

  const [savedAddress] = useState<string | null>(
    "Colonia Palmira, Tegucigalpa"
  );

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
  // - hay dirección
  // - si el schedule requiere hora (today/tomorrow), esa hora debe existir

  const isValid = useMemo(() => {

    if (!savedAddress) return false;

    if (schedule === "now") {
      return isWithinWorkingHoursNow;
    }

    // today / tomorrow requieren hora seleccionada

    if (!time) return false;

    return true;

  }, [savedAddress, schedule, time, isWithinWorkingHoursNow]);

  const handleSubmit = async () => {

    if (!isValid || isSubmitting) return;

    const payload: OrderPayload = {
      quantity,
      address: savedAddress,
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

    setIsSubmitting(false);

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
            address={savedAddress}

            onAddressClick={() => {

              /*
              BACKEND

              Mostrar direcciones guardadas
              */

            }}

            onMapClick={() => {

              /*
              BACKEND

              Abrir Google Maps

              Cuando el usuario confirme una ubicación en el mapa,
              aquí se debería actualizar la dirección/coordenadas,
              por ejemplo:

              setSavedAddress(nuevaDireccion);

              */

            }}
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

    </div>
  );
}