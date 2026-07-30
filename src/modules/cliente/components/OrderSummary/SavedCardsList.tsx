import { HiOutlineCreditCard } from "react-icons/hi2";

export interface SavedCard {
  id: number;
  brand: "Visa" | "Mastercard";
  last4: string;
}

interface SavedCardsListProps {
  cards: SavedCard[];
  selectedCardId: number | null;
  onSelect: (id: number) => void;
}

export default function SavedCardsList({
  cards,
  selectedCardId,
  onSelect,
}: SavedCardsListProps) {

  if (cards.length === 0) {

    return (

      <div
        className="
          mt-4
          rounded-2xl
          border
          border-dashed
          border-gray-300
          p-5
          text-center
        "
      >

        <HiOutlineCreditCard
          size={34}
          className="mx-auto text-gray-400 mb-2"
        />

        <p className="text-gray-500 font-medium">
          No tienes tarjetas guardadas.
        </p>

      </div>

    );

  }

  return (

    <div className="space-y-3 mt-4">

      {cards.map((card) => {

        const selected = selectedCardId === card.id;

        return (

          <button
            key={card.id}
            type="button"
            onClick={() => onSelect(card.id)}
            className={`
              w-full
              rounded-2xl
              border-2
              p-4
              flex
              items-center
              justify-between
              transition-all

              ${
                selected
                  ? "border-[var(--primary)] bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >

            <div className="flex items-center gap-3">

              <HiOutlineCreditCard
                size={26}
                className={
                  selected
                    ? "text-[var(--primary)]"
                    : "text-gray-500"
                }
              />

              <div className="text-left">

                <p className="font-semibold text-gray-900">

                  {card.brand}

                </p>

                <p className="text-sm text-gray-500">

                  **** **** **** {card.last4}

                </p>

              </div>

            </div>

            <div
              className={`
                w-6
                h-6
                rounded-full
                border-2
                flex
                items-center
                justify-center

                ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]"
                    : "border-gray-300"
                }
              `}
            >

              {selected && (

                <div className="w-2.5 h-2.5 rounded-full bg-white" />

              )}

            </div>

          </button>

        );

      })}

    </div>

  );

}