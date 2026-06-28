import logo from "../../../assets/images/logo.png";

import InfoCard from "../components/InfoCard";
import RoleButton from "../components/RoleButton";

import {
  FaTruck,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";



export default function SelectRole({ onClientClick }: { onClientClick: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-10">

      <img
        src={logo}
        alt="HaWay"
        className="w-52 mb-10"
      />

      <div className="space-y-4">

        <InfoCard
          title="Entrega rápida"
          description="Recibe agua en minutos con tracking en tiempo real."
          icon={<FaTruck />}
          iconColor="bg-blue-600"
        />

        <InfoCard
          title="Selecciona tu ubicación"
          description="Elige exactamente dónde quiere tu entrega."
          icon={<FaMapMarkerAlt />}
          iconColor="bg-cyan-500"
        />

        <InfoCard
          title="Servicio confiable"
          description="Proveedores verificados y agua de calidad garantizada."
          icon={<FaCheckCircle />}
          iconColor="bg-blue-600"
        />

      </div>

      <h2 className="mt-14 mb-6 text-2xl font-bold">

        Soy un:

      </h2>

      <div className="w-full flex flex-row justify-center items-center gap-4">

        <RoleButton
          text="Cliente"
          icon={<FaUser />}
          color="bg-[var(--primary)]"
          onClick={onClientClick}
        />

        <RoleButton
          text="Conductor"
          icon={<FaTruck />}
          color="bg-[var(--secondary)]"
        />

      </div>

    </div>
  );
}