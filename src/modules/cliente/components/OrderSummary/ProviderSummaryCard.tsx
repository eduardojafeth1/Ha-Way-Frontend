import { HiOutlineBeaker } from "react-icons/hi2";

interface ProviderSummaryCardProps {
  providerName: string;
  providerImage: string | null;
  quantity: number;
  price: number;
}

export default function ProviderSummaryCard({
  providerName,
  providerImage,
  quantity,
  price,
}: ProviderSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">

      <div className="flex items-center gap-4">

        {/* Imagen */}

        <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-50 flex items-center justify-center">

          {providerImage ? (

            <img
              src={providerImage}
              alt={providerName}
              className="w-full h-full object-cover"
            />

          ) : (

            <HiOutlineBeaker
              size={34}
              className="text-[var(--primary)]"
            />

          )}

        </div>

        <div className="flex-1">

          <p className="text-xs font-bold tracking-widest text-[var(--primary)] uppercase">

            Proveedor

          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-1">

            {providerName}

          </h2>

        </div>

      </div>

      <div className="border-t border-gray-200 mt-5 pt-5">

        <div className="flex justify-between">

          <div>

            <p className="text-sm text-gray-500 font-medium">
              Cantidad
            </p>

            <p className="font-semibold text-lg mt-1">
              {quantity} barriles
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500 font-medium">
              Precio
            </p>

            <p className="font-bold text-2xl text-[var(--primary)] mt-1">

              L{" "}
              {price.toLocaleString("es-HN", {
                minimumFractionDigits: 2,
              })}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}