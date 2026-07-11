interface OrderDetailsCardProps {
  proveedor: string;
  cantidad: string;
  total: number;
  pago: string;
}

export default function OrderDetailsCard({
  proveedor,
  cantidad,
  total,
  pago,
}: OrderDetailsCardProps) {
  const rows = [
    { label: "Proveedor", value: proveedor },
    { label: "Cantidad", value: cantidad },
    { label: "Total", value: `L. ${total.toFixed(2)}` },
    { label: "Pago", value: pago },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-base font-semibold text-gray-800 mb-3">Detalles del Pedido</h2>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{row.label}</span>
            <span className="text-gray-800 font-medium">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}