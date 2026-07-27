import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import { postFormData } from "../../../services/api";
import { PATHS } from "../../../routes/path";

interface PasswordInputProps {
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  value: string;
  onChange: (val: string) => void;
}

function PasswordInput({ placeholder, show, onToggle, value, onChange }: PasswordInputProps) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setError("");

    // Validar campos obligatorios
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.telefono || !formData.password) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    // Validar coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("apellido", formData.apellido);
      data.append("correo", formData.correo);
      data.append("telefono", formData.telefono);
      data.append("password", formData.password);
      if (fotoPerfil) {
        data.append("foto_perfil", fotoPerfil);
      }

      await postFormData("/auth/register", data);
      
      setSuccess(true);
      setTimeout(() => {
        navigate(PATHS.CLIENT.LOGIN);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 text-sm font-medium p-3 rounded-lg border border-green-200">
          ¡Registro exitoso! Redirigiendo a inicio de sesión...
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Nombre</label>
        <input
          type="text"
          placeholder="Ej. Juan"
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Apellido</label>
        <input
          type="text"
          placeholder="Ej. Pérez"
          value={formData.apellido}
          onChange={(e) => handleChange("apellido", e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Correo</label>
        <input
          type="email"
          placeholder="example@correo.com"
          value={formData.correo}
          onChange={(e) => handleChange("correo", e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Teléfono</label>
        <input
          type="tel"
          placeholder="+504 1234 567"
          value={formData.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Foto de perfil (Opcional)</label>
        <FileUpload
          label=""
          file={fotoPerfil}
          accept="image/*"
          onFileChange={(file) => setFotoPerfil(file)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">Contraseña</label>
        <PasswordInput
          placeholder="Crear contraseña"
          show={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          value={formData.password}
          onChange={(val) => handleChange("password", val)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <PasswordInput
          placeholder="Confirmar contraseña"
          show={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          value={formData.confirmPassword}
          onChange={(val) => handleChange("confirmPassword", val)}
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleRegister}
        className={`mt-2 w-full bg-[var(--primary)] text-white font-semibold py-4 rounded-xl text-base hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Registrando...
          </>
        ) : (
          "Registrarse"
        )}
      </button>

    </div>
  );
}
