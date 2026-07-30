import {
  Banknote,
  CreditCard,
  Droplets,
  MapPin,
  ReceiptText,
} from "lucide-react";

export type TrackingPaymentMethod = "cash" | "card";

interface OrderDetailsCardProps {
  quantity: number;
  unitPrice: number;
  deliveryFee?: number;
  address: string;
  paymentMethod: TrackingPaymentMethod;
  cardLastFourDigits?: string;
}

export default function OrderDetailsCard({
  quantity,
  unitPrice,
  deliveryFee = 0,
  address,
  paymentMethod,
  cardLastFourDigits,
}: OrderDetailsCardProps) {
  const subtotal = quantity * unitPrice;
  const total = subtotal + deliveryFee;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-[var(--primary)]
            "
          >
            <ReceiptText size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Detalles de la compra
            </h2>

            <p className="text-sm text-slate-500">
              Resumen de tu pedido
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-cyan-50
                text-[var(--secondary)]
              "
            >
              <Droplets size={22} />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-slate-900">
                Botellones de agua
              </p>

              <p className="text-sm text-slate-500">
                {quantity} {quantity === 1 ? "unidad" : "unidades"} ×{" "}
                {formatCurrency(unitPrice)}
              </p>
            </div>
          </div>

          <span className="shrink-0 font-bold text-slate-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-[var(--primary)]
            "
          >
            <MapPin size={22} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              Dirección de entrega
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {address}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-slate-600
            "
          >
            {paymentMethod === "cash" ? (
              <Banknote size={22} />
            ) : (
              <CreditCard size={22} />
            )}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Método de pago
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {paymentMethod === "cash"
                ? "Pago en efectivo"
                : cardLastFourDigits
                  ? `Tarjeta terminada en ${cardLastFourDigits}`
                  : "Pago con tarjeta"}
            </p>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-100
            bg-slate-50
            p-4
          "
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-700">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Costo de envío
              </span>

              <span className="font-medium text-slate-700">
                {deliveryFee === 0
                  ? "Gratis"
                  : formatCurrency(deliveryFee)}
              </span>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Total
              </span>

              <span className="text-xl font-extrabold text-[var(--primary)]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/*
      ==========================================================
      BACKEND

      Los datos del pedido deberán obtenerse desde el backend.

      Ejemplo:

      const order = await getOrderById(orderId);

      <OrderDetailsCard
        quantity={order.quantity}
        unitPrice={order.unitPrice}
        deliveryFee={order.deliveryFee}
        address={order.deliveryAddress}
        paymentMethod={order.paymentMethod}
        cardLastFourDigits={order.cardLastFourDigits}
      />

      No se debe calcular nuevamente el total en el frontend
      cuando el backend ya entregue el total definitivo.

      ==========================================================
      */}
    </section>
  );
}
