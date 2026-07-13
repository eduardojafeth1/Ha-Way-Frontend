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
  orders: PreviousOrder[];
  onViewDetail: (orderId: number) => void;
}

export default function PreviousOrdersCard({
  orders,
  onViewDetail,
}: PreviousOrdersCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-1">

      {/* Título */}
      <div className="flex items-center gap-0.5 mb-1">

        <img
          src={relojIcon}
          alt=""
          className="w-13 h-15"
        />

        <h2 className="text-xl font-semibold">
          Pedidos anteriores
        </h2>

      </div>

      {/* Sin pedidos */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">

          <p className="text-gray-400 text-lg font-semibold">
            No tienes pedidos aún
          </p>

          <p className="text-gray-400">
            ¡Haz tu primer pedido!
          </p>

        </div>
      ) : (

        /* Lista de pedidos */

        <div className="space-y-4">

          {orders.map((order) => (

            <div
              key={order.id}
              className="flex items-center gap-4 border-b pb-4 last:border-none"
            >

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

          ))}

        </div>

      )}

    </div>
  );
}