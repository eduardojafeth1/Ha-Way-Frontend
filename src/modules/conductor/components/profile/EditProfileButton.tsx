import { HiOutlineDocumentText } from "react-icons/hi2";

interface EditProfileButtonProps {
  onClick: () => void;
}

export default function EditProfileButton({
  onClick,
}: EditProfileButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-[var(--primary)]
        text-white
        rounded-xl
        py-3
        flex
        items-center
        justify-center
        gap-2
        font-medium
        shadow-sm
        hover:opacity-90
        transition
      "
    >
      <HiOutlineDocumentText size={20} />
      Editar perfil
    </button>
  );
}