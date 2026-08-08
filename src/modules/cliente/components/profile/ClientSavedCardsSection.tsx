import { useState, useEffect } from "react";
import { getJson, postJson, deleteJson, putJson } from "../../../../services/api";
import { FaCreditCard, FaPlus, FaTrash, FaCheckCircle, FaStar } from "react-icons/fa";

export default function ClientSavedCardsSection() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingCard, setIsAddingCard] = useState(false);
    
    // New Card Form
    const [newCard, setNewCard] = useState({
        numero_tarjeta: "",
        titular: "",
        fecha_vencimiento: "",
        cvv: "",
        marca: "Visa"
    });

    // Errores de validación por campo (se muestran en rojo debajo de cada input)
    const [fieldErrors, setFieldErrors] = useState<{
        numero_tarjeta?: string;
        titular?: string;
        fecha_vencimiento?: string;
        cvv?: string;
    }>({});

    // Error general del formulario (ej. falla de red al guardar)
    const [formError, setFormError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

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

    // Longitud estándar del número de tarjeta y del CVV para Visa/Mastercard.
    const CARD_NUMBER_LENGTH = 16;
    const CVV_LENGTH = 3;

    const validateNumeroTarjeta = (value: string): string | undefined => {
        const digits = value.replace(/\s/g, "");
        if (!digits) return "El número de tarjeta es obligatorio.";
        if (!/^\d+$/.test(digits)) return "El número de tarjeta solo debe contener dígitos.";
        if (digits.length !== CARD_NUMBER_LENGTH) {
            return `El número de tarjeta debe tener ${CARD_NUMBER_LENGTH} dígitos (Visa/Mastercard).`;
        }
        return undefined;
    };

    const validateTitular = (value: string): string | undefined => {
        if (!value.trim()) return "El nombre del titular es obligatorio.";
        return undefined;
    };

    const validateFechaVencimiento = (value: string): string | undefined => {
        if (!value.trim()) return "La fecha de vencimiento es obligatoria.";

        const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
        if (!match) return "Formato inválido. Usa MM/YY.";

        const month = parseInt(match[1], 10);
        const year = 2000 + parseInt(match[2], 10);

        if (month < 1 || month > 12) return "El mes debe estar entre 01 y 12.";

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        // La tarjeta es válida hasta el último día del mes indicado.
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return "La tarjeta está vencida.";
        }

        // Evita fechas absurdamente lejanas (posible error de tipeo).
        if (year > currentYear + 20) {
            return "El año de vencimiento no es válido.";
        }

        return undefined;
    };

    const validateCvv = (value: string): string | undefined => {
        if (!value) return "El CVV es obligatorio.";
        if (!/^\d+$/.test(value)) return "El CVV solo debe contener dígitos.";
        if (value.length !== CVV_LENGTH) {
            return `El CVV debe tener ${CVV_LENGTH} dígitos (Visa/Mastercard).`;
        }
        return undefined;
    };


    const handleAddCard = async () => {
        const errors = {
            numero_tarjeta: validateNumeroTarjeta(newCard.numero_tarjeta),
            titular: validateTitular(newCard.titular),
            fecha_vencimiento: validateFechaVencimiento(newCard.fecha_vencimiento),
            cvv: validateCvv(newCard.cvv),
        };

        setFieldErrors(errors);
        setFormError(null);

        const hasErrors = Object.values(errors).some((msg) => msg !== undefined);
        if (hasErrors) return;

        try {
            setIsSaving(true);
            await postJson("/cliente/tarjetas", newCard);
            setIsAddingCard(false);
            setNewCard({ numero_tarjeta: "", titular: "", fecha_vencimiento: "", cvv: "", marca: "Visa" });
            setFieldErrors({});
            fetchCards();
        } catch (err: any) {
            setFormError(err.message || "Hubo un error al guardar la tarjeta.");
        } finally {
            setIsSaving(false);
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

            {/* Modal para añadir tarjeta */}
            {isAddingCard && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4 pb-12">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-gray-800">Nueva Tarjeta</h3>
                            <button
                                onClick={() => {
                                    setIsAddingCard(false);
                                    setFieldErrors({});
                                    setFormError(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
                            >✕</button>
                        </div>

                        {formError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-xl">
                                {formError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Número de Tarjeta</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={16}
                                    value={newCard.numero_tarjeta}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, "");
                                        setNewCard({ ...newCard, numero_tarjeta: digits });
                                        setFieldErrors((prev) => ({ ...prev, numero_tarjeta: undefined }));
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.numero_tarjeta
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                    placeholder="0000000000000000"
                                />
                                {fieldErrors.numero_tarjeta && (
                                    <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.numero_tarjeta}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Titular</label>
                                <input
                                    type="text"
                                    value={newCard.titular}
                                    onChange={(e) => {
                                        setNewCard({ ...newCard, titular: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, titular: undefined }));
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                                        fieldErrors.titular
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                    placeholder="Ej. Juan Pérez"
                                />
                                {fieldErrors.titular && (
                                    <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.titular}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Vencimiento</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={5}
                                        value={newCard.fecha_vencimiento}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^\d/]/g, "");
                                            // Auto-inserta la "/" después de escribir el mes (MM -> MM/)
                                            if (value.length === 2 && !value.includes("/") && !newCard.fecha_vencimiento.includes("/")) {
                                                value = `${value}/`;
                                            }
                                            setNewCard({ ...newCard, fecha_vencimiento: value });
                                            setFieldErrors((prev) => ({ ...prev, fecha_vencimiento: undefined }));
                                        }}
                                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                                            fieldErrors.fecha_vencimiento
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                        placeholder="MM/YY"
                                    />
                                    {fieldErrors.fecha_vencimiento && (
                                        <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.fecha_vencimiento}</p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={3}
                                        value={newCard.cvv}
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/\D/g, "");
                                            setNewCard({ ...newCard, cvv: digits });
                                            setFieldErrors((prev) => ({ ...prev, cvv: undefined }));
                                        }}
                                        className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
                                            fieldErrors.cvv
                                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                        placeholder="123"
                                    />
                                    {fieldErrors.cvv && (
                                        <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleAddCard}
                                disabled={isSaving}
                                className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold mt-6 hover:bg-cyan-600 transition shadow-lg shadow-blue-500/30 disabled:opacity-60"
                            >
                                {isSaving ? "Guardando..." : "Guardar Tarjeta"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
