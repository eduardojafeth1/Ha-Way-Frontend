import { HiOutlineClock } from "react-icons/hi2";

interface EstimatedTimeCardProps {
  estimatedTime: string;
}

export default function EstimatedTimeCard({
  estimatedTime,
}: EstimatedTimeCardProps) {

  return (

    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        p-5
      "
    >

      <div className="flex items-start gap-4">

        <div className="mt-1 text-[var(--secondary)]">

          <HiOutlineClock size={24} />

        </div>

        <div className="flex-1">

          <h3 className="text-xl font-semibold text-gray-900">
            Tiempo estimado
          </h3>

          <p className="text-gray-500 mt-2 text-lg">
            {estimatedTime}
          </p>

        </div>

      </div>

    </div>

  );

}