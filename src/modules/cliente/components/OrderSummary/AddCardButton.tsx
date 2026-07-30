import { HiOutlinePlus } from "react-icons/hi2";

interface AddCardButtonProps {
  onClick: () => void;
}

export default function AddCardButton({
  onClick,
}: AddCardButtonProps) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        mt-4
        border-2
        border-dashed
        border-gray-300
        rounded-2xl
        py-4
        flex
        items-center
        justify-center
        gap-2
        text-[var(--primary)]
        font-semibold
        hover:border-[var(--primary)]
        hover:bg-blue-50
        transition-all
      "
    >

      <HiOutlinePlus size={22} />

      Añadir nueva tarjeta

    </button>

  );

}