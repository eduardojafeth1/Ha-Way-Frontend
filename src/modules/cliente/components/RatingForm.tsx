import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface RatingFormProps {
    pedidoId: number | string;
    onRatingSubmit: (puntuacion: number, comentario: string) => Promise<void>;
}

export default function RatingForm({ pedidoId, onRatingSubmit }: RatingFormProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comentario, setComentario] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Por favor selecciona una calificación");
            return;
        }

        try {
            setIsSubmitting(true);
            await onRatingSubmit(rating, comentario);
            setIsSubmitted(true);
        } catch (err: any) {
            alert(err.message || "Error al enviar la calificación");
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <FaStar size={24} />
                </div>
                <h3 className="font-bold text-green-800 text-lg">¡Gracias por tu calificación!</h3>
                <p className="text-green-600 text-sm mt-1">Tu opinión nos ayuda a mejorar el servicio.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Califica la calidad del servicio:</h3>
            
            <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                    >
                        <FaStar
                            size={28}
                            className={`${
                                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-200'
                            } transition-colors`}
                        />
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentario:</label>
                <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-none"
                    rows={3}
                    placeholder="¿Cómo fue tu experiencia?"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-sm
                    ${rating === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-[var(--primary)] text-white hover:bg-blue-600'
                    }`}
            >
                {isSubmitting ? "Enviando..." : "Confirmar entrega →"}
            </button>
        </div>
    );
}
