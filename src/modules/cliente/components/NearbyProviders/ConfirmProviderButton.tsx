import { HiCheckCircle } from "react-icons/hi2";

interface ConfirmProviderButtonProps {
  disabled: boolean;
  loading?: boolean;
  onClick: () => void;
}

export default function ConfirmProviderButton({
  disabled,
  loading = false,
  onClick,
}: ConfirmProviderButtonProps) {
  return (
    <div className="sticky bottom-0 bg-white pt-4 pb-6">

      <button
        type="button"
        disabled={disabled || loading}
        onClick={onClick}
        className={`
          w-full
          py-4
          rounded-full
          font-bold
          text-lg
          transition-all
          duration-200
          flex
          items-center
          justify-center
          gap-3
          ${
            disabled || loading
              ? "bg-white border-2 border-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-(--primary) text-white hover:opacity-90"
          }
        `}
      >

        {loading ? (
          "Confirmando..."
        ) : (
          <>
            Confirmar proveedor
            <HiCheckCircle size={24} />
          </>
        )}

      </button>

      <p className="mt-4 text-center text-sm text-gray-500 px-6">
        Al confirmar, el proveedor recibirá tu ubicación exacta para iniciar la entrega.
      </p>

    </div>
  );
}