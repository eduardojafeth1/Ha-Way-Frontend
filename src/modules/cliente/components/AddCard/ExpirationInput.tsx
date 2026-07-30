import { useMemo } from "react";

interface ExpirationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExpirationInput({
  value,
  onChange,
}: ExpirationInputProps) {

  const handleChange = (input: string) => {

    let numbers = input.replace(/\D/g, "");

    if (numbers.length > 4) {
      numbers = numbers.slice(0, 4);
    }

    if (numbers.length >= 2) {

      let month = parseInt(numbers.slice(0, 2));

      if (!isNaN(month)) {

        if (month < 1) month = 1;
        if (month > 12) month = 12;

        numbers =
          month.toString().padStart(2, "0") +
          numbers.slice(2);

      }

    }

    let formatted = numbers;

    if (numbers.length > 2) {

      formatted =
        numbers.slice(0, 2) +
        "/" +
        numbers.slice(2);

    }

    onChange(formatted);

  };

  const error = useMemo(() => {

    if (value.length < 5) return "";

    const [monthText, yearText] = value.split("/");

    const month = Number(monthText);
    const year = Number(yearText);

    if (month < 1 || month > 12) {

      return "Mes inválido.";

    }

    const now = new Date();

    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {

      return "La tarjeta está vencida.";

    }

    return "";

  }, [value]);

  return (

    <div>

      <label className="block text-sm font-medium text-gray-600 mb-2">

        Fecha de expiración

      </label>

      <input
        type="text"
        inputMode="numeric"
        placeholder="MM/AA"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
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

      {error && (

        <p className="text-red-500 text-sm mt-2">

          {error}

        </p>

      )}

    </div>

  );

}