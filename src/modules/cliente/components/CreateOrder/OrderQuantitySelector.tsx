import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

interface OrderQuantitySelectorProps {
  available: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function OrderQuantitySelector({
  available,
  onQuantityChange,
}: OrderQuantitySelectorProps) {
  // Cantidad válida
  const [quantity, setQuantity] = useState(20);

  // Texto del input
  const [inputValue, setInputValue] = useState("20");

  // Error
  const [error, setError] = useState("");

  useEffect(() => {
    validate(inputValue);
  }, []);

  const validate = (value: string) => {
    if (value === "") {
      setError("Ingrese la cantidad de barriles.");
      return;
    }

    const number = Number(value);

    if (isNaN(number)) {
      setError("Ingrese una cantidad válida.");
      return;
    }

    if (number <= 0) {
      setError("La cantidad debe ser mayor que cero.");
      return;
    }

    if (number > available) {
      setError(`Solo hay ${available} barriles disponibles.`);
      return;
    }

    setError("");

    setQuantity(number);

    onQuantityChange?.(number);
  };

  const increase = () => {
    if (quantity >= available) return;

    const value = quantity + 1;

    setQuantity(value);
    setInputValue(value.toString());
    setError("");

    onQuantityChange?.(value);
  };

  const decrease = () => {
    if (quantity <= 1) return;

    const value = quantity - 1;

    setQuantity(value);
    setInputValue(value.toString());
    setError("");

    onQuantityChange?.(value);
  };

  const selectQuickValue = (value: number) => {
    setQuantity(value);
    setInputValue(value.toString());
    setError("");

    onQuantityChange?.(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6">

      <div className="border rounded-2xl border-gray-200 h-16 flex items-center justify-between px-6">

        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className={`text-xl transition
            ${
              quantity <= 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-[var(--primary)]"
            }`}
        >
          <FaMinus />
        </button>

        <input
          type="number"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;

            setInputValue(value);

            validate(value);
          }}
          className="
            w-28
            bg-transparent
            outline-none
            text-center
            text-4xl
            font-semibold
            text-gray-800
          "
        />

        <button
          onClick={increase}
          disabled={quantity >= available}
          className={`text-xl transition
            ${
              quantity >= available
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-[var(--primary)]"
            }`}
        >
          <FaPlus />
        </button>

      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">
          {error}
        </p>
      )}

      <p className="mt-4 text-gray-500">
        Disponible:
        <span className="font-semibold">
          {" "}
          {available} Barriles
        </span>
      </p>

      <div className="flex gap-4 mt-6">

        {[20, 30, 50].map((item) => (

          <button
            key={item}
            onClick={() => selectQuickValue(item)}
            className={`
                flex-1
                py-3
                rounded-xl
                border
                font-semibold
                transition-all
                ${
                  quantity === item && error === ""
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white border-gray-300 text-gray-700 hover:border-[var(--primary)]"
                }
            `}
          >
            {item}
          </button>

        ))}

      </div>

      {/*
      ===========================================
      BACKEND

      available llegará desde la API.

      const available =
      await providerService.getAvailableBarrels();

      ===========================================
      */}

    </div>
  );
}