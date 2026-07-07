import gota from "../../../assets/icons/gota_pedidoactual.svg";


interface CurrentOrder {
  id: number;
  supplierName: string;
  barrels: number;
  date: string;
  status: string;
  estimatedTime: string;
  total: number;
  image: string;
}

interface CurrentOrderCardProps {
  order: CurrentOrder | null;
  onViewDetail: (orderId: number) => void;
}

export default function CurrentOrderCard({
  order,
  onViewDetail,
}: CurrentOrderCardProps) {
  if (!order) {
    return (

      <div className="bg-white rounded-xl shadow-md p-1">
        <div className="flex items-center gap-0.5 mb-1">
          <img
            src={gota}
            alt=""
            className="w-15 h-15"
          />
        
          <h2 className="text-xl font-semibold">
            Pedido actual
          </h2>  
          
        </div>

        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-gray-400 text-lg font-semibold">
            No tienes pedidos aún
          </p>

          <p className="text-gray-400">
            ¡Haz tu primer pedido!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">

      {/* Título */}
      <div className="flex items-center gap-2 mb-4">

        <div className="w-3 h-3 bg-blue-500 rounded-full" />

        <h2 className="text-xl font-bold">
          Pedido actual
        </h2>

      </div>

      {/* Contenido */}
      <div className="flex gap-4">

        {/* Imagen */}
        <img
          src={order.image}
          alt={order.supplierName}
          className="w-20 h-20 rounded-lg object-cover"
        />

        {/* Información */}
        <div className="flex-1">

          <div className="flex justify-between items-start">

            <div>
              <h3 className="text-lg font-semibold text-cyan-500">
                {order.supplierName}
              </h3>

              <p className="text-gray-700">
                {order.barrels} barriles
              </p>

              <p className="text-gray-500 text-sm">
                {order.date}
              </p>
            </div>

            <div className="text-right">

              <span className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm">
                {order.status}
              </span>

              <p className="text-gray-400 text-sm mt-1">
                {order.estimatedTime}
              </p>

            </div>

          </div>

          <div className="mt-3 text-right">

            <span className="text-gray-700">
              Total a pagar:
            </span>

            <span className="font-bold text-2xl ml-2">
              L. {order.total.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

      {/* Botón */}
      <div className="flex justify-center mt-5">

        <button
          onClick={() => onViewDetail(order.id)}
          className="
            bg-[var(--primary)]
            text-white
            px-8
            py-2
            rounded-lg
            font-medium
            hover:opacity-90
            transition
          "
        >
          Ver detalle
        </button>

      </div>

    </div>
  );
}