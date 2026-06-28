import logo from "../../../../assets/images/logo.png";

import InfoCard from "../../components/InfoCard";
import RoleButton from "../../components/RoleButton";

import {
  FaTruck,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">

      <img
        src={logo}
        alt="Ha'Way"
        className="w-52 mb-10"
      />

      <div className="space-y-4">

        <InfoCard
          title="Entrega rápida"
          description="Recibe agua en minutos con tracking en tiempo real."
          icon={<FaTruck />}
          iconColor="bg-[var(--primary)]"
        />

        <InfoCard
          title="Selecciona tu ubicación"
          description="Elige exactamente dónde quieres tu entrega."
          icon={<FaMapMarkerAlt />}
          iconColor="bg-[var(--secondary)]"
        />

        <InfoCard
          title="Servicio confiable"
          description="Proveedores verificados y agua de calidad garantizada."
          icon={<FaCheckCircle />}
          iconColor="bg-[var(--primary)]"
        />

      </div>

      <h2 className="mt-14 mb-6 text-2xl font-bold text-gray-900">
        Soy un:
      </h2>

      <div className="w-full flex justify-center gap-4">

        <RoleButton
          text="Cliente"
          icon={<FaUser />}
          color="bg-[var(--primary)]"
          onClick={() => navigate("/cliente/login")}
        />

        <RoleButton
          text="Conductor"
          icon={<FaTruck />}
          color="bg-[var(--secondary)]"
          onClick={() => navigate("/conductor/login")}
        />

      </div>

    </div>
  );
}