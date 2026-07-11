import {
  HiCheckCircle,
  HiOutlineArchiveBox,
  HiOutlineTruck,
  HiOutlineMapPin,
} from "react-icons/hi2";

export interface TrackingStep {
  key: string;
  label: string;
}

const ICONS: Record<string, React.ReactNode> = {
  confirmado: <HiCheckCircle className="w-5 h-5" />,
  preparando: <HiOutlineArchiveBox className="w-5 h-5" />,
  en_camino: <HiOutlineTruck className="w-5 h-5" />,
  entregado: <HiOutlineMapPin className="w-5 h-5" />,
};

interface OrderStatusTimelineProps {
  steps: TrackingStep[];
  currentStepIndex: number;
}

export default function OrderStatusTimeline({
  steps,
  currentStepIndex,
}: OrderStatusTimelineProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Estado del Pedido
      </h2>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex || step.key === "entregado" && index === currentStepIndex;
          const isActive = index === currentStepIndex && step.key !== "entregado";

          const circleColor = isCompleted
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-[var(--primary)] text-white"
            : "bg-gray-200 text-gray-400";

          const labelColor = isCompleted
            ? "text-green-600"
            : isActive
            ? "text-[var(--primary)]"
            : "text-gray-400";

          const stateText = isCompleted ? "Completado" : isActive ? "Actual" : "En espera";

          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${circleColor}`}>
                  {ICONS[step.key]}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>

              <div className="pb-6">
                <p className={`text-sm font-semibold ${labelColor}`}>{step.label}</p>
                <p className="text-xs text-gray-400">{stateText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}