import { useEffect, useState } from "react";
import visaLogo from "../../../../assets/images/cards/visa.svg";
import mastercardLogo from "../../../../assets/images/cards/mastercard.svg";

interface CardNumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

type CardBrand = "visa" | "mastercard" | "unknown";

export default function CardNumberInput({
  value,
  onChange,
}: CardNumberInputProps) {

  const [brand, setBrand] = useState<CardBrand>("unknown");

  useEffect(() => {

    const digits = value.replace(/\s/g, "");

    if (digits.startsWith("4")) {

      setBrand("visa");

    } else if (
      digits.startsWith("5") ||
      /^2[2-7]/.test(digits)
    ) {

      setBrand("mastercard");

    } else {

      setBrand("unknown");

    }

  }, [value]);

  const handleChange = (input: string) => {

    const numbers = input.replace(/\D/g, "").slice(0, 16);

    const formatted = numbers.replace(/(.{4})/g, "$1 ").trim();

    onChange(formatted);

  };

  return (

    <div>

      <label className="block text-sm font-medium text-gray-600 mb-2">

        Número de tarjeta

      </label>

      <div
        className="
          flex
          items-center
          bg-gray-100
          rounded-2xl
          px-4
          py-4
          border
          border-transparent
          focus-within:border-[var(--primary)]
          transition-all
        "
      >

        <input
          type="text"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="
            flex-1
            bg-transparent
            outline-none
            text-lg
            font-medium
            tracking-wide
          "
        />

        <div className="w-14 flex justify-end">

            {brand === "visa" && (

                <img
                    src={visaLogo}
                    alt="Visa"
                    className="h-7 object-contain"
                />

            )}

            {brand === "mastercard" && (

                <img
                    src={mastercardLogo}
                    alt="Mastercard"
                    className="h-7 object-contain"
                />

            )}

        </div>

      </div>

      <p className="text-xs text-gray-400 mt-2">

        Ingresa los 16 dígitos de tu tarjeta.

      </p>

    </div>

  );

}