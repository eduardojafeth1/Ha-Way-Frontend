import {
  HiStar,
  HiClock,
  HiMapPin,
  HiCheckCircle,
} from "react-icons/hi2";

interface ProviderCardProps {
  image: string | null;
  name: string;
  estimatedTime: string;
  distance: number;
  rating: number;
  price: number;
  badge?: "closest" | "best-price";
  selected: boolean;
  onSelect: () => void;
}
export default function ProviderCard({
  image,
  name,
  estimatedTime,
  distance,
  rating,
  price,
  badge,
  selected,
  onSelect,
}: ProviderCardProps) {

  return (

    <button
      type="button"
      onClick={onSelect}
      className={`
        relative
        w-full
        bg-white
        rounded-2xl
        p-4
        border-2
        transition-all
        duration-200
        text-left
        ${
          selected
            ? "border-[var(--primary)] shadow-lg shadow-blue-100"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
    >

      {/* Check de seleccionado */}

      {selected && (

        <div className="absolute top-3 right-15 text-[var(--primary)]">

          <HiCheckCircle size={30} />

        </div>

      )}

      <div className="flex gap-4">

        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">

        {image ? (
            <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            />
        ) : (
            <span className="text-xs text-gray-500 text-center px-2">
            Sin imagen
            </span>
        )}

        </div>

        <div className="flex-1">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="font-semibold text-xl text-gray-900">

                {name}

              </h3>

              {badge === "closest" && (

                <span
                  className="
                    inline-block
                    mt-2
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-[var(--primary)]
                    text-white
                  "
                >
                  MÁS CERCA
                </span>

              )}

              {badge === "best-price" && (

                <span
                  className="
                    inline-block
                    mt-2
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-[var(--secondary)]
                    text-white
                  "
                >
                  MEJOR PRECIO
                </span>

              )}

            </div>

            <div className="flex items-center gap-1 text-[var(--primary)]">

              <HiStar />

              <span className="font-semibold">

                {rating.toFixed(1)}

              </span>

            </div>

          </div>

          <div className="flex items-center gap-2 mt-3 text-gray-500">

            <HiClock />

            <span>{estimatedTime}</span>

          </div>

          <div className="flex items-center justify-between mt-4">

            <div
              className="
                flex
                items-center
                gap-1
                bg-cyan-100
                text-[var(--secondary)]
                rounded-full
                px-3
                py-1
                text-sm
                font-medium
              "
            >

              <HiMapPin />

              {distance} km

            </div>

            <span className="text-3xl font-bold">

              L {price.toLocaleString("es-HN", {
                minimumFractionDigits: 2,
              })}

            </span>

          </div>

        </div>

      </div>

    </button>

  );

}