import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

interface OrderQuantitySelectorProps {
  available: number;
  /** Cantidad inicial a mostrar (debe coincidir con la unidad seleccionada). */
  initialValue: number;
  /** Nombre en plural de la unidad, ej. "barriles", "galones", "cisternas". */
  unitPluralLabel: string;
  /** Nombre en singular de la unidad, ej. "barril", "galón", "cisterna". */
  unitSingularLabel: string;
  /** Valores rápidos de selección, coherentes con la unidad (ej. [1,2,3] para cisternas). */
  quickValues: [number, number, number];
  onQuantityChange?: (quantity: number) => void;
}

export default function OrderQuantitySelector({
  available,
  initialValue,
  unitPluralLabel,
  unitSingularLabel,
  quickValues,
  onQuantityChange,
}: OrderQuantitySelectorProps) {
  // Cantidad válida
  const [quantity, setQuantity] = useState(initialValue);

  // Texto del input
  const [inputValue, setInputValue] = useState(initialValue.toString());

  // Error
  const [error, setError] = useState("");

  useEffect(() => {
    validate(inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (value: string) => {
    if (value === "") {
      setError(`Ingrese la cantidad de ${unitPluralLabel}.`);
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
      setError(`Solo hay ${available} ${unitPluralLabel} disponibles.`);
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
          {available} {available === 1 ? unitSingularLabel : unitPluralLabel}
        </span>
      </p>

      <div className="flex gap-4 mt-6">

        {quickValues.map((item) => (

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

    </div>
  );
}
