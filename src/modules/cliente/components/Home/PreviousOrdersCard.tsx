import relojIcon from "../../../../assets/icons/reloj_pedidosanteriores.svg";

interface PreviousOrder {
  id: number;
  supplierName: string;
  barrels: number;
  date: string;
  total: number;
  image: string;
}

interface PreviousOrdersCardProps {
  order: PreviousOrder | null;
  hasMore?: boolean;
  onViewAll?: () => void;
  onViewDetail: (orderId: number) => void;
}

export default function PreviousOrdersCard({
  order,
  hasMore,
  onViewAll,
  onViewDetail,
}: PreviousOrdersCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">

      {/* Título */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <img
            src={relojIcon}
            alt=""
            className="w-8 h-8"
          />
          <h2 className="text-xl font-bold">
            Pedidos anteriores
          </h2>
        </div>
        {hasMore && onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm font-medium text-blue-500 hover:text-blue-700"
          >
            Ver todo
          </button>
        )}
      </div>

      {/* Sin pedidos */}
      {!order ? (
        <div className="flex flex-col items-center justify-center py-12">

          <p className="text-gray-400 text-lg font-semibold">
            No tienes pedidos aún
          </p>

          <p className="text-gray-400">
            ¡Haz tu primer pedido!
          </p>

        </div>
      ) : (

        /* Único pedido */

        <div className="flex items-center gap-4">

          <img
            src={order.image}
            alt={order.supplierName}
            className="w-16 h-16 rounded-lg object-cover"
          />

          <div className="flex-1">

            <h3 className="font-semibold text-cyan-600">
              {order.supplierName}
            </h3>

            <p className="text-gray-700 text-sm">
              {order.barrels} barriles
            </p>

            <p className="text-gray-500 text-sm">
              {order.date}
            </p>

          </div>

          <div className="flex flex-col items-end">

            <span className="font-bold text-lg">
              L. {order.total.toFixed(2)}
            </span>

            <button
              onClick={() => onViewDetail(order.id)}
              className="
                mt-2
                text-sm
                text-[var(--primary)]
                font-semibold
                hover:underline
              "
            >
              Ver detalle
            </button>

          </div>

        </div>

      )}

    </div>
  );
}