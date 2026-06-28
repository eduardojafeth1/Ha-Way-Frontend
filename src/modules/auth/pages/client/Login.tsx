import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-10 pb-6">

      <img
        src={logo}
        alt="Ha'Way logo"
        className="w-52 mb-6"
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Iniciar sesión
      </h1>

      <div className="w-full flex flex-col gap-4">

        <input
          type="email"
          placeholder="Correo"
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        <button
          type="button"
          className="mt-2 w-full bg-[var(--primary)] text-white font-semibold py-4 rounded-xl text-base hover:opacity-90 active:scale-95 transition-all"
        >
          Iniciar sesión
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿Aún no eres miembro?{" "}
          <button
            type="button"
            onClick={() => navigate("/cliente/register")}
            className="text-[var(--primary)] font-medium"
          >
            Regístrate ahora
          </button>
        </p>

      </div>

      <button
        className="mt-auto text-sm text-gray-500 self-start"
        onClick={() => navigate("/")}
      >
        &lt; Volver
      </button>

    </div>
  );
}