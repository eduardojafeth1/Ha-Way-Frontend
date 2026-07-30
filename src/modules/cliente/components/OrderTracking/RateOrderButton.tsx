import { Star } from "lucide-react";

interface RateOrderButtonProps {
  isDelivered: boolean;
  onRate: () => void;
}

export default function RateOrderButton({
  isDelivered,
  onRate,
}: RateOrderButtonProps) {
  if (!isDelivered) {
    return null;
  }

  return (
    <section
      className="
        rounded-3xl
        border
        border-blue-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-[var(--primary)]
            "
          >
            <Star
              size={24}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              ¿Cómo fue tu experiencia?
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Tu opinión nos ayuda a mejorar el servicio y reconocer al
              proveedor.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRate}
          className="
            flex
            min-h-12
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[var(--primary)]
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:opacity-90
            active:scale-[0.98]
            focus:outline-none
            focus:ring-4
            focus:ring-blue-100
          "
        >
          <Star
            size={20}
            fill="currentColor"
          />

          Calificar pedido
        </button>
      </div>

      {/*
      ==========================================================
      BACKEND

      Este botón solo debe mostrarse cuando el backend indique:

      order.status === "delivered"

      También se debe validar si el pedido ya fue calificado:

      order.hasRating === false

      Después de guardar la calificación, el backend deberá marcar:

      hasRating: true

      ==========================================================
      */}
    </section>
  );
}