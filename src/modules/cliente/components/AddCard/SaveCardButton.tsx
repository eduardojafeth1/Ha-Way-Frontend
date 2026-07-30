interface SaveCardButtonProps {
  disabled: boolean;
  loading?: boolean;
  onClick: () => void;
}

export default function SaveCardButton({
  disabled,
  loading = false,
  onClick,
}: SaveCardButtonProps) {

  return (

    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        w-full
        py-4
        rounded-2xl
        font-bold
        text-lg
        transition-all
        ${
          disabled || loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]"
        }
      `}
    >

      {loading
        ? "Guardando..."
        : "Guardar tarjeta"}

    </button>

  );

}