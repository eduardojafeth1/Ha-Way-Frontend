import { FaSignOutAlt } from "react-icons/fa";

interface LogoutButtonProps {
  onClick: () => void;
}

export default function LogoutButton({
  onClick,
}: LogoutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-white
        border
        border-gray-200
        text-red-500
        rounded-xl
        py-3
        flex
        items-center
        justify-center
        gap-2
        font-medium
        shadow-sm
        hover:bg-gray-50
        transition
      "
    >
      <FaSignOutAlt />
      Cerrar Sesión
    </button>
  );
}