import { useState } from "react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CVVInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CVVInput({
  value,
  onChange,
}: CVVInputProps) {

  const [showCVV, setShowCVV] = useState(false);

  const handleChange = (input: string) => {

    const numbers = input
      .replace(/\D/g, "")
      .slice(0, 4);

    onChange(numbers);

  };

  return (

    <div>

      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">

        CVV

        <HiOutlineQuestionMarkCircle
          className="text-gray-400"
          title="Código de seguridad de tu tarjeta."
        />

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
          type={showCVV ? "text" : "password"}
          inputMode="numeric"
          placeholder="123"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="
            flex-1
            bg-transparent
            outline-none
            text-lg
            font-medium
          "
        />

        <button
          type="button"
          onClick={() => setShowCVV(!showCVV)}
          className="text-gray-500 hover:text-gray-700 transition"
        >

          {showCVV
            ? <FaEyeSlash size={18} />
            : <FaEye size={18} />
          }

        </button>

      </div>

      <p className="text-xs text-gray-400 mt-2">

        Código de seguridad de 3 o 4 dígitos.

      </p>

    </div>

  );

}