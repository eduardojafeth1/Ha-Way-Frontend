import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import EstimatedTimeBar from "../components/tracking/EstimatedTimeBar";
import OrderStatusTimeline from "../components/tracking/OrderStatusTimeline";
import type { TrackingStep } from "../components/tracking/OrderStatusTimeline";
import OrderDetailsCard from "../components/tracking/OrderDetailsCard";
import DeliveryConfirmation from "../components/tracking/DeliveryConfirmation";

type OrderStatus = "confirmado" | "preparando" | "en_camino" | "entregado";

const STEPS: TrackingStep[] = [
  { key: "confirmado", label: "Pedido confirmado" },
  { key: "preparando", label: "Preparando envío" },
  { key: "en_camino", label: "En camino" },
  { key: "entregado", label: "Entregado" },
];

const TOTAL_MINUTES_MOCK = 20;

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [status] = useState<OrderStatus>("confirmado");
  const currentStepIndex = STEPS.findIndex((s) => s.key === status);

  const [secondsLeft, setSecondsLeft] = useState(TOTAL_MINUTES_MOCK * 60);

  useEffect(() => {
    if (status === "entregado") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const minutesLeft = Math.ceil(secondsLeft / 60);
  const progressPercent = Math.min(
    100,
    ((TOTAL_MINUTES_MOCK * 60 - secondsLeft) / (TOTAL_MINUTES_MOCK * 60)) * 100
  );

  const orderDetails = {
    proveedor: "AguaPura Express",
    cantidad: "20 barriles",
    total: 400.0,
    pago: "Efectivo",
  };

  const handleConfirmDelivery = (rating: number, comment: string) => {
    console.log("Entrega confirmada", { id, rating, comment });
    navigate(PATHS.DRIVER.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="flex items-center px-5 pt-10 pb-4 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full border-2 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] hover:scale-110 transition-transform"
          aria-label="Volver"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold tracking-widest text-gray-900 uppercase">
          Seguimiento
        </h1>
        <div className="w-9" />
      </div>

      <main className="px-5 space-y-4 mt-2">
        <EstimatedTimeBar
          minutesLeft={minutesLeft}
          progressPercent={progressPercent}
          delivered={status === "entregado"}
        />

        <div className="w-full h-40 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          Mapa (pendiente de integración)
        </div>

        <OrderStatusTimeline steps={STEPS} currentStepIndex={currentStepIndex} />

        <OrderDetailsCard {...orderDetails} />

        {status === "entregado" && (
          <DeliveryConfirmation onConfirm={handleConfirmDelivery} />
        )}
      </main>
    </div>
  );
}