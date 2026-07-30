import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";

import DeliveryMap from "../components/OrderTracking/DeliveryMap";
import EstimatedTimeCard from "../components/OrderTracking/EstimatedTimeCard";
import OrderDetailsCard from "../components/OrderTracking/OrderDetailsCard";
import OrderTimeline, {
  type OrderStatus,
} from "../components/OrderTracking/OrderTimeline";
import RateOrderButton from "../components/OrderTracking/RateOrderButton";

import type { Coordinates } from "../../../services/routeService";

export default function OrderTracking() {
  const navigate = useNavigate();

  /*
  ==========================================================
  DATOS TEMPORALES

  Estos valores se utilizan únicamente para construir
  y probar la interfaz mientras no exista conexión
  con el backend.
  ==========================================================
  */

  const [orderStatus] = useState<OrderStatus>("on_the_way");

  const [providerLocation] = useState<Coordinates>({
    lat: 14.0825,
    lng: -87.2068,
  });

  const customerLocation: Coordinates = {
    lat: 14.0723,
    lng: -87.1921,
  };

  const totalMinutes = 20;
  const remainingMinutes = 0;

  const isDelivered = orderStatus === "delivered";

  function handleRateOrder() {
    /*
    ==========================================================
    NAVEGACIÓN FUTURA

    Cuando exista la página de calificación:

    navigate(PATHS.CLIENT.RATE_ORDER);

    También se puede enviar el identificador del pedido:

    navigate(PATHS.CLIENT.RATE_ORDER, {
      state: {
        orderId: order.id,
      },
    });
    ==========================================================
    */

    console.log("Abrir página de calificación");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <PageHeader
        title="Seguimiento del pedido"
        
      />

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        <div className="space-y-5">
          <EstimatedTimeCard
            totalMinutes={totalMinutes}
            remainingMinutes={remainingMinutes}
            isDelivered={isDelivered}
          />

          <DeliveryMap
            customerLocation={customerLocation}
            providerLocation={providerLocation}
          />

          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <OrderTimeline currentStatus={orderStatus} />

            <OrderDetailsCard
              quantity={3}
              unitPrice={35}
              deliveryFee={20}
              address="Colonia Kennedy, bloque 8, casa 124, Tegucigalpa"
              paymentMethod="card"
              cardLastFourDigits="4582"
            />
          </div>

          <RateOrderButton
            isDelivered={isDelivered}
            onRate={handleRateOrder}
          />
        </div>
      </div>

      {/*
      ==========================================================
      BACKEND

      Al cargar esta página se deberá obtener la información
      completa del pedido mediante su identificador.

      Ejemplo:

      const { orderId } = useParams();

      useEffect(() => {
        async function loadOrder() {
          const orderData = await getOrderById(orderId);

          setOrderStatus(orderData.status);

          setProviderLocation({
            lat: orderData.provider.latitude,
            lng: orderData.provider.longitude,
          });

          setCustomerLocation({
            lat: orderData.delivery.latitude,
            lng: orderData.delivery.longitude,
          });

          setRemainingMinutes(orderData.remainingMinutes);
        }

        loadOrder();
      }, [orderId]);

      ACTUALIZACIÓN EN TIEMPO REAL

      El estado y la posición del proveedor deberán actualizarse
      mediante WebSockets.

      socket.on("order-status-updated", (status) => {
        setOrderStatus(status);
      });

      socket.on("provider-location-updated", (location) => {
        setProviderLocation({
          lat: location.latitude,
          lng: location.longitude,
        });
      });

      socket.on("estimated-time-updated", (time) => {
        setRemainingMinutes(time.remainingMinutes);
      });

      ==========================================================
      */}
    </main>
  );
}