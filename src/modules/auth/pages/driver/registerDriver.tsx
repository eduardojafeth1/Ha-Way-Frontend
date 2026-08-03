import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";

import ProgressIndicator from "../../components/DriverRegister/ProgressIndicator";
import StepProvider from "../../components/DriverRegister/StepOneRegDriver";
import StepDocuments from "../../components/DriverRegister/StepTwoRegDriver";
import StepTruck from "../../components/DriverRegister/StepThreeRegDriver";

import { PATHS } from "../../../../routes/path";
import { postFormData } from "../../../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Proveedor (Paso 1)
    companyName: "",
    rtn: "",
    ownerName: "",
    identidad: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Documentos (Paso 2)
    reason: "",
    cv: null as File | null,
    license: null as File | null,
    licenseNumber: "",
    licenseExpiration: "",
    profilePhoto: null as File | null,

    // Camión (Paso 3)
    plate: "",
    brand: "",
    model: "",
    year: "",
    capacity: "",
    color: "",
    technicalRevisionDate: "",
    inspectionPhoto: null as File | null,
    truckPhoto: null as File | null,
  });

  const nextStep = () => {
    setError("");
    
    // Validaciones por paso
    if (step === 1) {
      if (!formData.ownerName || !formData.phone || !formData.email || !formData.password || !formData.identidad) {
        setError("Por favor completa todos los campos personales obligatorios (Nombre dueño, Identidad, Teléfono, Correo y Contraseña).");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
    } else if (step === 2) {
      if (!formData.licenseNumber || !formData.licenseExpiration || !formData.license || !formData.cv || !formData.profilePhoto) {
        setError("Por favor ingresa los datos de licencia y sube el CV, Foto de Licencia y Foto de Perfil.");
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(PATHS.DRIVER.LOGIN);
    }
  };

  const handleRegister = async () => {
    setError("");

    // Validar paso 3
    if (!formData.plate || !formData.brand || !formData.model || !formData.year || !formData.capacity || !formData.color || !formData.technicalRevisionDate || !formData.inspectionPhoto || !formData.truckPhoto) {
      setError("Por favor completa todos los campos del camión y sube las fotos requeridas.");
      return;
    }

    setLoading(true);

    try {
      // Dividir nombre del dueño en nombre y apellido
      const parts = formData.ownerName.trim().split(/\s+/);
      const nombre = parts[0] || "";
      const apellido = parts.slice(1).join(" ");

      const data = new FormData();
      // Datos de usuario
      data.append("nombre", nombre);
      data.append("apellido", apellido);
      data.append("correo", formData.email);
      data.append("password", formData.password);
      data.append("telefono", formData.phone);

      // Datos de conductor
      data.append("numero_licencia", formData.licenseNumber);
      data.append("fecha_vencimiento", formData.licenseExpiration);
      data.append("identidad", formData.identidad);
      if (formData.companyName) data.append("nombre_empresa", formData.companyName);
      if (formData.rtn) data.append("rtn", formData.rtn);
      if (formData.reason) data.append("motivo_solicitud", formData.reason);

      // Datos del camión
      data.append("placa", formData.plate);
      data.append("marca", formData.brand);
      data.append("modelo", formData.model);
      data.append("anio", formData.year);
      data.append("capacidad_galones", formData.capacity);
      data.append("color", formData.color);
      data.append("revision_tecnica", formData.technicalRevisionDate);

      // Archivos
      if (formData.cv) data.append("cv", formData.cv);
      if (formData.license) data.append("licencia", formData.license);
      if (formData.profilePhoto) data.append("foto_perfil", formData.profilePhoto);
      if (formData.inspectionPhoto) data.append("foto_revision", formData.inspectionPhoto);
      if (formData.truckPhoto) data.append("foto_camion", formData.truckPhoto);

      await postFormData("/conductor/registro", data);

      setSuccess(true);
      setTimeout(() => {
        navigate(PATHS.DRIVER.LOGIN);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al registrar al conductor. Por favor intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-8">

      {/* Logo */}
      <img
        src={logo}
        alt="Ha'Way"
        className="w-52 mb-6"
      />

      {/* Indicador de pasos */}
      <ProgressIndicator step={step} />

      {/* Título */}
      <h1 className="text-2xl font-bold mb-8 font-[var(--font-principal)]">
        {step === 1 && "Proveedor"}
        {step === 2 && "Archivos"}
        {step === 3 && "Camión"}
      </h1>

      {/* Alertas */}
      {error && (
        <div className="w-full mb-6 bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full mb-6 bg-green-50 text-green-600 text-sm font-medium p-3 rounded-lg border border-green-200">
          ¡Registro exitoso! Sus documentos están en revisión. Redirigiendo a inicio de sesión...
        </div>
      )}

      {/* Contenido */}
      <div className="w-full">
        {step === 1 && (
          <StepProvider
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {step === 2 && (
          <StepDocuments
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {step === 3 && (
          <StepTruck
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>

      {/* Botones */}
      <div className="w-full flex justify-between mt-10">
        <button
          onClick={previousStep}
          disabled={loading}
          className="mt-auto text-sm text-gray-500 self-start disabled:opacity-50"
        >
          &lt; Volver
        </button>

        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-8 py-3 rounded-xl border-2 border-[var(--secondary)] text-[var(--secondary)] font-semibold hover:bg-[var(--secondary)] hover:text-white transition-colors duration-200"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`px-8 py-3 rounded-xl bg-[var(--secondary)] text-white font-semibold hover:opacity-90 flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registrando...
              </>
            ) : (
              "Registrarme"
            )}
          </button>
        )}
      </div>

    </div>
  );
}