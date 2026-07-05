import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface ProviderData {
  companyName: string;
  rtn: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface StepProviderProps {
  formData: ProviderData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function StepProvider({
  formData,
  setFormData,
}: StepProviderProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof ProviderData, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full flex flex-col gap-5">

      {/* Nombre empresa */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre Empresa
        </label>

        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* RTN */}
      <div>
        <label className="block text-sm font-medium mb-2">
          RTN
        </label>

        <input
          type="text"
          value={formData.rtn}
          onChange={(e) => handleChange("rtn", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Nombre dueño */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre dueño
        </label>

        <input
          type="text"
          value={formData.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Teléfono
        </label>

        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Correo */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Correo
        </label>

        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Contraseña
        </label>

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Crear contraseña"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>

        </div>
      </div>

      {/* Confirmar contraseña */}
      <div>

        <div className="relative">

          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </button>

        </div>

      </div>

    </div>
  );
}