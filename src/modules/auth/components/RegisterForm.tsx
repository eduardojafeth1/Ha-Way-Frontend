import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  placeholder: string;
  show: boolean;
  onToggle: () => void;
}

function PasswordInput({ placeholder, show, onToggle }: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Nombre</label>
        <input
          type="text"
          placeholder="Ej. Juan"
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Correo</label>
        <input
          type="email"
          placeholder="example@correo.com"
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Teléfono</label>
        <input
          type="tel"
          placeholder="+504 1234 567"
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Contraseña</label>
        <PasswordInput
          placeholder="Crear contraseña"
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <PasswordInput
          placeholder="Confirmar contraseña"
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
        />
      </div>

      <button
        type="button"
        className="mt-2 w-full bg-[var(--primary)] text-white font-semibold py-4 rounded-xl text-base hover:opacity-90 active:scale-95 transition-all"
      >
        Registrarse
      </button>

    </div>
  );
}
