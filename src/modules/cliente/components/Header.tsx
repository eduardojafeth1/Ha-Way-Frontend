import { FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  userName: string;
  onLogout: () => void;
}

export default function Header({
  userName,
  onLogout,
}: HeaderProps) {
  return (
    <header className="relative w-full bg-[var(--primary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">

      {/* Botón salir */}
      <button
        onClick={onLogout}
        className="absolute top-8 right-6 text-3xl hover:scale-110 transition-transform"
      >
        <FaSignOutAlt />
      </button>

      {/* Saludo */}
      <div>

        <p className="text-lg font-light">
          Hola,
        </p>

        <h1 className="text-3xl font-semibold leading-none">
          {userName}
        </h1>

      </div>

    </header>
  );
}