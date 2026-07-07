import waterTruckIcon from "../../../assets/images/water-truck-icon.svg";

interface RequestWaterCardProps {
  onClick: () => void;
}

export default function RequestWaterCard({
  onClick,
}: RequestWaterCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        max-w-[320px]
        h-[170px]
        rounded-[28px]
        bg-gradient-to-b
        from-[var(--secondary)]
        to-[var(--primary)]
        flex
        flex-col
        items-center
        justify-center
        shadow-md
        hover:scale-[1.02]
        active:scale-95
        transition-all
      "
    >
      <img
        src={waterTruckIcon}
        alt="Solicitar Agua"
        className="w-28 mb-4"
      />

      <span className="text-white text-3xl font-semibold">
        SOLICITAR AGUA
      </span>
    </button>
  );
}