import {
  HiCheckCircle,
  HiOutlineArchiveBox,
  HiOutlineTruck,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { HiCheck } from "react-icons/hi";
import { FaCheck, FaTint, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

export interface TrackingStep {
  key: string;
  label: string;
}

const ICONS: Record<string, React.ReactNode> = {
  PENDIENTE: <FaCheck className="w-5 h-5" />,
  PREPARANDO: <FaTint className="w-5 h-5" />,
  EN_CAMINO: <FaTruck className="w-5 h-5" />,
  LLEGO: <FaMapMarkerAlt className="w-5 h-5" />,
  ENTREGADO: <FaCheck className="w-5 h-5" />
};

interface OrderStatusTimelineProps {
  steps: TrackingStep[];
  currentStepIndex: number;
  isConductor?: boolean;
  onUpdateState?: (stateKey: string) => void;
  updating?: boolean;
}

export default function OrderStatusTimeline({
  steps,
  currentStepIndex,
  isConductor = false,
  onUpdateState,
  updating = false
}: OrderStatusTimelineProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Estado del Pedido
      </h2>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex && step.key !== "ENTREGADO";
          const isNext = index === currentStepIndex + 1;

          const circleColor = isCompleted
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-400";

          const labelColor = isCompleted
            ? "text-green-600"
            : isNext
            ? "text-[var(--primary)]"
            : "text-gray-400";

          const stateText = isCompleted ? "Completado" : isActive ? "Actual" : isNext ? "Siguiente paso" : "En espera";

          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${circleColor}`}>
                  {ICONS[step.key] || <HiCheckCircle className="w-5 h-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${index < currentStepIndex ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>

              <div className="pb-6 flex-1 flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${labelColor}`}>{step.label}</p>
                  <p className="text-xs text-gray-400">{stateText}</p>
                </div>
                {isConductor && isNext && onUpdateState && (
                  <button
                    onClick={() => onUpdateState(step.key)}
                    disabled={updating}
                    className="ml-2 bg-[var(--primary)] text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                  >
                    Actualizar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}