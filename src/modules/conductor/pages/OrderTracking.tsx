import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import EstimatedTimeBar from "../components/tracking/EstimatedTimeBar";
import OrderStatusTimeline from "../components/tracking/OrderStatusTimeline";
import type { TrackingStep } from "../components/tracking/OrderStatusTimeline";
import OrderDetailsCard from "../components/tracking/OrderDetailsCard";
import DeliveryConfirmation from "../components/tracking/DeliveryConfirmation";
import { getJson, putJson } from "../../../services/api";

const STEPS: TrackingStep[] = [
  { key: "PENDIENTE", label: "Pedido confirmado" },
  { key: "PREPARANDO", label: "Preparando envío" },
  { key: "EN_CAMINO", label: "En camino" },
  { key: "LLEGO", label: "Llegó" },
  { key: "ENTREGADO", label: "Entregado" },
];

export default function OrderTracking() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const data = await getJson(`/conductor/pedidos/${id}`);
        setPedido(data.pedido);
      } catch (err) {
        console.error("Error al cargar el pedido", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
        <p className="text-gray-500 font-semibold mb-4">No se pudo cargar el pedido</p>
        <button
          onClick={() => navigate(PATHS.DRIVER.HOME)}
          className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const currentStatus = pedido.estado;
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStatus);

  // Estimado (mock/placeholder por ahora)
  const TOTAL_MINUTES_MOCK = pedido.tiempo_estimado || 30;
  const minutesLeft = currentStatus === "ENTREGADO" ? 0 : TOTAL_MINUTES_MOCK;
  const progressPercent = currentStatus === "ENTREGADO" ? 100 : 30;

  const orderDetails = {
    proveedor: `${pedido.cliente_nombre} ${pedido.cliente_apellido}`,
    cantidad: `${pedido.cantidad} ${pedido.unidad_medida}`,
    total: Number(pedido.pago_total || 0),
    pago: pedido.pago_metodo || "Efectivo",
  };

  const handleUpdateState = async (nextState: string) => {
    setUpdating(true);
    try {
      await putJson(`/conductor/pedidos/${id}/estado`, { estado: nextState });
      setPedido((prev: any) => ({ ...prev, estado: nextState }));
    } catch (error) {
      console.error("Error actualizando el estado", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmDelivery = (rating: number, comment: string) => {
    // Si necesitas calificar, iría aquí, pero por ahora solo vamos al HOME
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
          Seguimiento N°{id}
        </h1>
        <div className="w-9" />
      </div>

      <main className="px-5 space-y-4 mt-2">
        <EstimatedTimeBar
          minutesLeft={minutesLeft}
          progressPercent={progressPercent}
          delivered={currentStatus === "ENTREGADO"}
        />

        <div className="w-full h-40 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          Mapa (pendiente de integración)
        </div>

        <OrderStatusTimeline 
          steps={STEPS} 
          currentStepIndex={currentStepIndex} 
          isConductor={true}
          onUpdateState={handleUpdateState}
          updating={updating}
        />

        <OrderDetailsCard {...orderDetails} />

        {currentStatus === "ENTREGADO" && (
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
             <h2 className="text-lg font-bold text-green-500 mb-2">¡Pedido Entregado!</h2>
             <button 
                onClick={() => navigate(PATHS.DRIVER.HOME)}
                className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-semibold"
             >
                Volver a Inicio
             </button>
          </div>
        )}
      </main>
    </div>
  );
}