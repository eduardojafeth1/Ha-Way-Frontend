import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/path";
import logo from "../../../../assets/images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postJson } from "../../../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!correo || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await postJson("/auth/login", { correo, password });
      
      // Guardar en localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("userRole", response.usuario.rol);
      
      // Redirigir según el rol
      if (response.usuario.rol === "CONDUCTOR") {
        navigate(PATHS.DRIVER.HOME);
      } else {
        setError("Acceso denegado. Rol incorrecto para esta vista.");
      }
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-10 pb-6">

      <img
        src={logo}
        alt="Ha'Way logo"
        className="w-52 mb-6"
      />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Iniciar sesión como conductor
      </h1>

      <div className="w-full flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
        />

        <div className="relative">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
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
          disabled={loading}
          onClick={handleLogin}
          className={`mt-2 w-full bg-[var(--secondary)] text-white font-semibold py-4 rounded-xl text-base hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          ¿Quieres unirte al equipo de proveedores de Ha'Way?{" "}
          <button
            type="button"
            onClick={() => navigate(PATHS.DRIVER.REGISTER)}
            className="text-[var(--secondary)] font-medium"
          >
            Regístrate ahora
          </button>
        </p>

      </div>

      <button
        className="mt-auto text-sm text-gray-500 self-start"
        onClick={() => navigate(PATHS.HOME)}
      >
        &lt; Volver
      </button>

    </div>
  );
}