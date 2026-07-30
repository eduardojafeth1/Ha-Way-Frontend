interface PaymentSummaryProps {
  total: number;
  paymentMethod: "card" | "cash";
  selectedCardId: number | null;
  loading?: boolean;
  onConfirm: () => void;
}

export default function PaymentSummary({
  total,
  paymentMethod,
  selectedCardId,
  loading = false,
  onConfirm,
}: PaymentSummaryProps) {

  const disabled =
    loading ||
    (paymentMethod === "card" && selectedCardId === null);

  return (

    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        border-t
        border-gray-200
        px-5
        py-5
        shadow-[0_-4px_12px_rgba(0,0,0,0.05)]
      "
    >

      <div className="flex items-center justify-between mb-5">

        <div>

          <p className="text-sm text-gray-500">
            Total a pagar
          </p>

          <h2 className="text-3xl font-bold text-gray-900">

            L{" "}
            {total.toLocaleString("es-HN", {
              minimumFractionDigits: 2,
            })}

          </h2>

        </div>

      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onConfirm}
        className={`
          w-full
          py-4
          rounded-2xl
          font-bold
          text-lg
          transition-all
          ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[var(--primary)] text-white hover:opacity-90"
          }
        `}
      >

        {loading
          ? "Procesando..."
          : "Confirmar pedido"}

      </button>

      {paymentMethod === "card" && selectedCardId === null && (

        <p className="text-center text-red-500 text-sm mt-3">

          Debes seleccionar una tarjeta.

        </p>

      )}

    </div>

  );

}