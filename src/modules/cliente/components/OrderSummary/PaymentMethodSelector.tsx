import { useState } from "react";
import {
  HiOutlineCreditCard,
  HiOutlineBanknotes,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";

import SavedCardsList, { type SavedCard } from "./SavedCardsList";
import AddCardButton from "./AddCardButton";

export type PaymentMethod = "card" | "cash";

interface PaymentMethodSelectorProps {
  cards: SavedCard[];
  onAddCard: () => void;
  onMethodChange: (method: PaymentMethod) => void;
  onCardSelected: (cardId: number | null) => void;
}

export default function PaymentMethodSelector({
  cards,
  onAddCard,
  onMethodChange,
  onCardSelected,
}: PaymentMethodSelectorProps) {

  const [method, setMethod] = useState<PaymentMethod>("cash");

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const handleMethod = (value: PaymentMethod) => {

    setMethod(value);

    onMethodChange(value);

    if (value === "cash") {

      setSelectedCardId(null);

      onCardSelected(null);

    }

  };

  const handleCardSelect = (id: number) => {

    setSelectedCardId(id);

    onCardSelected(id);

  };

  return (

    <div className="space-y-5">

      {/* TARJETA */}

      <div
        className={`
          rounded-2xl
          border-2
          overflow-hidden
          transition-all
          ${
            method === "card"
              ? "border-[var(--primary)]"
              : "border-gray-200"
          }
        `}
      >

        <button
          type="button"
          onClick={() => handleMethod("card")}
          className="w-full flex items-center justify-between px-5 py-5"
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">

              <HiOutlineCreditCard
                size={24}
                className={
                  method === "card"
                    ? "text-[var(--primary)]"
                    : "text-gray-500"
                }
              />

            </div>

            <div className="text-left">

              <h3 className="font-semibold text-lg">
                Tarjeta
              </h3>

              <p className="text-gray-500 text-sm">
                Débito o Crédito
              </p>

            </div>

          </div>

          {method === "card"
            ? <HiChevronUp size={22} />
            : <HiChevronDown size={22} />
          }

        </button>

        {method === "card" && (

          <div className="px-5 pb-5 border-t border-gray-200">

            <SavedCardsList
              cards={cards}
              selectedCardId={selectedCardId}
              onSelect={handleCardSelect}
            />

            <AddCardButton
              onClick={onAddCard}
            />

          </div>

        )}

      </div>

      {/* EFECTIVO */}

      <button
        type="button"
        onClick={() => handleMethod("cash")}
        className={`
          w-full
          rounded-2xl
          border-2
          px-5
          py-5
          flex
          items-center
          gap-4
          transition-all
          ${
            method === "cash"
              ? "border-[var(--primary)]"
              : "border-gray-200"
          }
        `}
      >

        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">

          <HiOutlineBanknotes
            size={24}
            className={
              method === "cash"
                ? "text-[var(--primary)]"
                : "text-gray-500"
            }
          />

        </div>

        <div className="text-left">

          <h3 className="font-semibold text-lg">
            Efectivo
          </h3>

          <p className="text-gray-500 text-sm">
            Paga al recibir tu pedido
          </p>

        </div>

      </button>

    </div>

  );

}