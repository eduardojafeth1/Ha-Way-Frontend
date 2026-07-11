import { useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlinePlus,
  HiCheckCircle,
} from "react-icons/hi2";

interface Card {
  id: number;
  brand: string;
  last4: string;
}

interface SavedCardsSectionProps {
  cards: Card[];
  selectedCardId: number;
  onSelectCard: (id: number) => void;
  onEditCard: (id: number) => void;
  onAddCard: () => void;
}

export default function SavedCardsSection({
  cards,
  selectedCardId,
  onSelectCard,
  onEditCard,
  onAddCard,
}: SavedCardsSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">
        Tarjetas guardadas
      </label>

      <div className="border-2 border-[var(--primary)] rounded-2xl overflow-hidden">

        {/* Encabezado */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3"
        >
          <div className="flex items-center gap-3">

            <HiOutlineCreditCard size={24} className="text-gray-700" />

            <div className="text-left">
              <p className="font-semibold text-gray-900">
                Tarjeta
              </p>

              <p className="text-xs text-gray-500">
                Débito o Crédito
              </p>
            </div>

          </div>

          {expanded ? (
            <HiOutlineChevronUp className="text-gray-500" />
          ) : (
            <HiOutlineChevronDown className="text-gray-500" />
          )}
        </button>

        {expanded && (
          <div className="px-3 pb-3 space-y-2">

            {/* Lista de tarjetas */}
            {cards.map((card) => {
              const isSelected = card.id === selectedCardId;

              return (
                <div
                  key={card.id}
                  className={`
                    flex items-center justify-between
                    rounded-xl px-3 py-3
                    ${
                      isSelected
                        ? "border-2 border-[var(--primary)] bg-white"
                        : "border border-gray-200"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">

                    <button onClick={() => onSelectCard(card.id)}>
                      {isSelected ? (
                        <HiCheckCircle
                          size={22}
                          className="text-[var(--primary)]"
                        />
                      ) : (
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-300" />
                      )}
                    </button>

                    <HiOutlineCreditCard
                      size={20}
                      className="text-gray-700"
                    />

                    <span className="text-gray-800">
                      {card.brand} .... {card.last4}
                    </span>

                  </div>

                  {isSelected && (
                    <button
                      onClick={() => onEditCard(card.id)}
                      className="text-sm text-[var(--primary)] font-medium"
                    >
                      (Editar)
                    </button>
                  )}

                </div>
              );
            })}

            {/* Añadir nueva tarjeta */}
            <button
              onClick={onAddCard}
              className="
                w-full
                border
                border-dashed
                border-[var(--primary)]
                text-[var(--primary)]
                rounded-xl
                py-3
                flex
                items-center
                justify-center
                gap-2
                font-medium
              "
            >
              <HiOutlinePlus size={18} />
              Añadir Nueva Tarjeta
            </button>

          </div>
        )}

      </div>
    </div>
  );
}