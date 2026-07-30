import { HiOutlineMapPin } from "react-icons/hi2";

interface DeliveryInfoCardProps {
  address: string;
}

export default function DeliveryInfoCard({
  address,
}: DeliveryInfoCardProps) {

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

        <div className="mt-1 text-[var(--primary)]">

          <HiOutlineMapPin size={24} />

        </div>

        <div className="flex-1">

          <h3 className="text-xl font-semibold text-gray-900">
            Ubicación de entrega
          </h3>

          <p className="text-gray-500 mt-2 leading-relaxed">
            {address}
          </p>

        </div>

      </div>

    </div>

  );

}