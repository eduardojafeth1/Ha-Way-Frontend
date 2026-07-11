import { HiOutlineClock } from "react-icons/hi2";

interface EstimatedTimeBarProps {
  minutesLeft: number;
  progressPercent: number;
  delivered: boolean;
}

export default function EstimatedTimeBar({
  minutesLeft,
  progressPercent,
  delivered,
}: EstimatedTimeBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center gap-2 mb-2 text-gray-700">
        <HiOutlineClock className="w-5 h-5" />
        <span className="text-sm font-medium">Tiempo estimado de entrega</span>
      </div>

      <div className="bg-[var(--primary)] rounded-lg px-4 py-3">
        <p className="text-white font-semibold mb-2">
          {delivered ? "Pedido entregado" : `${minutesLeft} minutos`}
        </p>

        {!delivered && (
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}