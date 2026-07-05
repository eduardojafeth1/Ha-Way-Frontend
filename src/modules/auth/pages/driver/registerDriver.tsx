import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";

import StepProvider from "../../DriverRegister/StepOneRegDriver";
import StepDocuments from "../../DriverRegister/StepTwoRegDriver";
import StepTruck from "../../DriverRegister/StepThreeRegDriver";

import { PATHS } from "../../../../routes/path";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Proveedor
    companyName: "",
    rtn: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Documentos
    reason: "",
    cv: null as File | null,
    license: null as File | null,
    profilePhoto: null as File | null,

    // Camión
    plate: "",
    model: "",
    capacity: "",
    color: "",
    inspectionPhoto: null as File | null,
    truckPhoto: null as File | null,
  });

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(PATHS.DRIVER.LOGIN);
    }
  };

  const handleRegister = () => {
    console.log(formData);

    // Aquí luego llamaremos al backend
    // await registerDriver(formData);

    alert("Registro completado");
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
      <div className="flex items-center gap-3 mb-8">

        <div
          className={`w-4 h-4 rounded-full ${
            step >= 1
              ? "bg-[var(--secondary)]"
              : "bg-gray-300"
          }`}
        />

        <div
          className={`w-12 h-1 ${
            step >= 2
              ? "bg-[var(--secondary)]"
              : "bg-gray-300"
          }`}
        />

        <div
          className={`w-4 h-4 rounded-full ${
            step >= 2
              ? "bg-[var(--secondary)]"
              : "bg-gray-300"
          }`}
        />

        <div
          className={`w-12 h-1 ${
            step >= 3
              ? "bg-[var(--secondary)]"
              : "bg-gray-300"
          }`}
        />

        <div
          className={`w-4 h-4 rounded-full ${
            step === 3
              ? "bg-[var(--secondary)]"
              : "bg-gray-300"
          }`}
        />

      </div>

      {/* Título */}

      <h1 className="text-2xl font-bold mb-8 font-[var(--font-principal)]">

        {step === 1 && "Proveedor"}

        {step === 2 && "Archivos"}

        {step === 3 && "Camión"}

      </h1>

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
          className="mt-auto text-sm text-gray-500 self-start"
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
            className="px-8 py-3 rounded-xl bg-[var(--secondary)] text-white font-semibold hover:opacity-90"
          >
            Registrarme
          </button>
        )}

      </div>

    </div>
  );
}