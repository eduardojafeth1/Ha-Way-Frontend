import { useState, useEffect } from "react";
import { getJson, deleteJson, putJson } from "../../../../services/api";
import { FaCreditCard, FaPlus, FaTrash, FaStar } from "react-icons/fa";
import AddCardForm from "../AddCardForm";

export default function ClientSavedCardsSection() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingCard, setIsAddingCard] = useState(false);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const data = await getJson("/cliente/tarjetas");
            setCards(data);
        } catch (err) {
            console.error("Error fetching cards:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta tarjeta?")) return;

        try {
            await deleteJson(`/cliente/tarjetas/${id}`);
            fetchCards();
        } catch (err) {
            console.error("Error deleting card:", err);
            alert("Hubo un error al eliminar la tarjeta");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await putJson(`/cliente/tarjetas/${id}/principal`, {});
            fetchCards();
        } catch (err) {
            console.error("Error setting default card:", err);
            alert("Hubo un error al establecer la tarjeta principal");
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                <FaCreditCard className="text-[var(--primary)]" />
                Mis Tarjetas
            </h3>

            {loading ? (
                <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-3">
                    {cards.length === 0 ? (
                        <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500 text-sm border-2 border-dashed border-gray-200">
                            No tienes tarjetas guardadas.
                        </div>
                    ) : (
                        cards.map((card) => (
                            <div key={card.id_tarjeta} className={`bg-white border rounded-xl p-4 flex items-center gap-3 shadow-sm transition ${card.principal ? 'border-[var(--primary)]' : 'border-gray-200'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.principal ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'}`}>
                                    <FaCreditCard size={18} />
                                </div>

                                <div className="flex-1">
                                    <p className="font-bold text-gray-800 flex items-center gap-2">
                                        {card.marca} **** {card.ultimos4}
                                        {card.principal && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Principal</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">{card.titular}</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {!card.principal && (
                                        <button onClick={() => handleSetDefault(card.id_tarjeta)} className="text-gray-400 hover:text-blue-500 transition" title="Hacer principal">
                                            <FaStar />
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteCard(card.id_tarjeta)} className="text-gray-300 hover:text-red-500 transition" title="Eliminar tarjeta">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => setIsAddingCard(true)}
                        className="w-full bg-white border-2 border-dashed border-[var(--primary)] text-[var(--primary)] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                    >
                        <FaPlus /> Añadir Tarjeta
                    </button>
                </div>
            )}

            {/* Modal para añadir tarjeta: usa el mismo formulario que el checkout */}
            {isAddingCard && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-12">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-gray-800">Nueva Tarjeta</h3>
                            <button
                                onClick={() => setIsAddingCard(false)}
                                className="text-gray-400 hover:text-gray-600 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                            >✕</button>
                        </div>

                        <AddCardForm
                            onSuccess={() => {
                                setIsAddingCard(false);
                                fetchCards();
                            }}
                            onCancel={() => setIsAddingCard(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
