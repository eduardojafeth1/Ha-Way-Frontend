import {
  Check,
  ChefHat,
  CircleCheck,
  PackageCheck,
  Truck,
} from "lucide-react";

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "on_the_way"
  | "delivered";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

interface TimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  icon: typeof Check;
}

const timelineSteps: TimelineStep[] = [
  {
    status: "confirmed",
    title: "Pedido confirmado",
    description: "El proveedor aceptó tu pedido.",
    icon: CircleCheck,
  },
  {
    status: "preparing",
    title: "Preparando envío",
    description: "El proveedor está preparando tu pedido.",
    icon: ChefHat,
  },
  {
    status: "on_the_way",
    title: "En camino",
    description: "El proveedor se dirige hacia tu ubicación.",
    icon: Truck,
  },
  {
    status: "delivered",
    title: "Entregado",
    description: "Tu pedido fue entregado correctamente.",
    icon: PackageCheck,
  },
];

const statusOrder: Record<OrderStatus, number> = {
  confirmed: 0,
  preparing: 1,
  on_the_way: 2,
  delivered: 3,
};

export default function OrderTimeline({
  currentStatus,
}: OrderTimelineProps) {
  const currentStepIndex = statusOrder[currentStatus];

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Estado del pedido
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Consulta el progreso de tu entrega.
        </p>
      </div>

      <div>
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;

          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;
          const isLastStep = index === timelineSteps.length - 1;

          return (
            <div
              key={step.status}
              className="relative flex gap-4"
            >
              {!isLastStep && (
                <div
                  className={`
                    absolute
                    left-[21px]
                    top-11
                    h-[calc(100%-20px)]
                    w-0.5
                    ${
                      isCompleted
                        ? "bg-[var(--secondary)]"
                        : "bg-slate-200"
                    }
                  `}
                />
              )}

              <div
                className={`
                  relative
                  z-10
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  transition-all
                  ${
                    isCompleted
                      ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                      : ""
                  }
                  ${
                    isCurrent
                      ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                      : ""
                  }
                  ${
                    isPending
                      ? "border-slate-200 bg-white text-slate-400"
                      : ""
                  }
                `}
              >
                {isCompleted ? (
                  <Check
                    size={21}
                    strokeWidth={3}
                  />
                ) : (
                  <Icon
                    size={21}
                    strokeWidth={2.3}
                  />
                )}

                {isCurrent && currentStatus !== "delivered" && (
                  <span
                    className="
                      absolute
                      -inset-1.5
                      -z-10
                      animate-ping
                      rounded-full
                      bg-[var(--primary)]
                      opacity-20
                    "
                  />
                )}
              </div>

              <div
                className={`
                  min-w-0
                  flex-1
                  ${isLastStep ? "pb-0" : "pb-8"}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className={`
                        font-semibold
                        ${
                          isPending
                            ? "text-slate-400"
                            : "text-slate-900"
                        }
                      `}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`
                        mt-1 text-sm
                        ${
                          isPending
                            ? "text-slate-400"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {isPending
                        ? "En espera"
                        : step.description}
                    </p>
                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      ${
                        isCompleted
                          ? "bg-cyan-50 text-[var(--secondary)]"
                          : ""
                      }
                      ${
                        isCurrent
                          ? "bg-blue-50 text-[var(--primary)]"
                          : ""
                      }
                      ${
                        isPending
                          ? "bg-slate-100 text-slate-400"
                          : ""
                      }
                    `}
                  >
                    {isCompleted && "Completado"}
                    {isCurrent && "En proceso"}
                    {isPending && "En espera"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*
      ==========================================================
      BACKEND

      El estado debe recibirse desde el backend.

      Ejemplo con WebSocket:

      socket.on("order-status-updated", (newStatus) => {
        setCurrentStatus(newStatus);
      });

      Estados esperados:

      confirmed
      preparing
      on_the_way
      delivered

      ==========================================================
      */}
    </section>
  );
}