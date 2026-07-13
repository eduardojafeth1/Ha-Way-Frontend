import { useNavigate } from "react-router-dom";
import {  HiOutlineXMark } from "react-icons/hi2";
import back from "../../../assets/icons/atras.svg";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  onClose?: () => void;
}

export default function PageHeader({
  title,
  showBack = true,
  showClose = true,
  onBack,
  onClose,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/cliente/home");
  };

  return (
    <header className="bg-white border-b border-gray-300">

      <div className="flex items-center justify-between px-6 pt-8 pb-6">

        {/* Botón atrás */}

        <div className="w-10 flex justify-start">
          {showBack && (
            <button
              onClick={handleBack}
              className="text-[var(--primary)] text-4xl hover:opacity-80 transition"
            >
              <img
                src={back}
                alt=""
                className="w-15 h-15"
              />
            </button>
          )}
        </div>

        {/* Título */}

        <h1 className="flex-1 text-center text-2xl font-bold uppercase tracking-wide text-gray-900">
          {title}
        </h1>

        {/* Botón cerrar */}

        <div className="w-10 flex justify-end">
          {showClose && (
            <button
              onClick={handleClose}
              className="text-[var(--primary)] text-4xl hover:opacity-80 transition"
            >
              <HiOutlineXMark />
            </button>
          )}
        </div>

      </div>

    </header>
  );
}