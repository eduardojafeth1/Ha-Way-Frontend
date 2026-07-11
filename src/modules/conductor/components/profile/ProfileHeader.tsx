import { HiOutlineChevronLeft } from "react-icons/hi2";

interface ProfileHeaderProps {
  title: string;
  onBack: () => void;
}

export default function ProfileHeader({
  title,
  onBack,
}: ProfileHeaderProps) {
  return (
    <header className="relative w-full bg-white px-4 py-5 flex items-center justify-center shadow-sm">

      {/* Botón volver */}
      <button
        onClick={onBack}
        className="absolute left-4 text-[var(--primary)] text-2xl hover:scale-110 transition-transform"
      >
        <HiOutlineChevronLeft />
      </button>

      {/* Título */}
      <h1 className="text-lg font-semibold text-[var(--primary)]">
        {title}
      </h1>

    </header>
  );
}

