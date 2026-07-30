import { HiOutlineClock } from "react-icons/hi2";
import { useMemo } from "react";

interface EstimatedTimeCardProps {

  // Tiempo total estimado cuando el proveedor aceptó el pedido
  totalMinutes: number;

  // Tiempo restante actualizado por el backend
  remainingMinutes: number;

  // El pedido ya fue entregado
  isDelivered: boolean;

}

export default function EstimatedTimeCard({

  totalMinutes,
  remainingMinutes,
  isDelivered,

}: EstimatedTimeCardProps) {

  const progress = useMemo(() => {

    if (isDelivered) return 100;

    if (totalMinutes <= 0) return 0;

    const percentage =
      ((totalMinutes - remainingMinutes) / totalMinutes) * 100;

    return Math.min(100, Math.max(0, percentage));

  }, [
    totalMinutes,
    remainingMinutes,
    isDelivered,
  ]);

  const message = useMemo(() => {

    if (isDelivered) {

      return "Pedido entregado";

    }

    if (remainingMinutes <= 0) {

      return "Proveedor en destino";

    }

    if (remainingMinutes === 1) {

      return "1 minuto";

    }

    return `${remainingMinutes} minutos`;

  }, [
    remainingMinutes,
    isDelivered,
  ]);

  return (

    <section>

      <div className="flex items-center gap-2 mb-3">

        <HiOutlineClock
          className="text-[var(--primary)]"
          size={18}
        />

        <h2 className="text-xl font-bold">

          Tiempo estimado de entrega

        </h2>

      </div>

      <div
        className="
          bg-[var(--primary)]
          rounded-2xl
          px-5
          py-4
          shadow-lg
        "
      >

        <p className="text-white text-2xl font-bold mb-4">

          {message}

        </p>

        <div
          className="
            w-full
            h-3
            rounded-full
            bg-white/25
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              bg-white
              rounded-full
              transition-all
              duration-700
            "
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

    </section>

  );

}