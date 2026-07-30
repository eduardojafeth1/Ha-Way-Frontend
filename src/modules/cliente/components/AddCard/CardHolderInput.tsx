interface CardHolderInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CardHolderInput({
  value,
  onChange,
}: CardHolderInputProps) {

  const handleChange = (input: string) => {

    const formatted = input
      .replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "")
      .replace(/\s{2,}/g, " ");

    onChange(formatted.toUpperCase());

  };

  return (

    <div>

      <label className="block text-sm font-medium text-gray-600 mb-2">

        Nombre del titular

      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="NOMBRE APELLIDO"
        className="
          w-full
          bg-gray-100
          rounded-2xl
          px-4
          py-4
          outline-none
          border
          border-transparent
          focus:border-[var(--primary)]
          transition-all
          text-lg
          font-medium
        "
      />

      <p className="text-xs text-gray-400 mt-2">

        Debe coincidir con el nombre impreso en la tarjeta.

      </p>

    </div>

  );

}