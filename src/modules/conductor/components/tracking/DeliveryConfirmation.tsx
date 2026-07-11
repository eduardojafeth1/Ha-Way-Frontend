import { useState } from "react";
import { HiStar } from "react-icons/hi2";

interface DeliveryConfirmationProps {
  onConfirm: (rating: number, comment: string) => void;
}

export default function DeliveryConfirmation({ onConfirm }: DeliveryConfirmationProps) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
      <div>
        <p className="text-sm text-gray-700 mb-1">Califica la calidad del servicio:</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} aria-label={`${star} estrellas`}>
              <HiStar className={`w-6 h-6 ${star <= rating ? "text-[var(--primary)]" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-700 block mb-1">Comentario:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:border-[var(--primary)]"
        />
      </div>

      <button
        onClick={() => onConfirm(rating, comment)}
        className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Confirmar entrega →
      </button>
    </div>
  );
}