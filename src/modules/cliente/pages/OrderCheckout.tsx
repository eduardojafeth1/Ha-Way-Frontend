import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import PageHeader from "../components/PageHeader";
import { getJson, putJson } from "../../../services/api";
import { FaTint, FaMapMarkerAlt, FaClock, FaCreditCard, FaMoneyBillWave, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import AddCardForm from "../components/AddCardForm";

export default function OrderCheckout() {
    const { id: offerId } = useParams();
    const navigate = useNavigate();

    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<"EFECTIVO" | "TARJETA">("EFECTIVO");
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    
    // Cards state
    const [cards, setCards] = useState<any[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [isAddingCard, setIsAddingCard] = useState(false);

    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        fetchData();
    }, [offerId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [offerData, cardsData] = await Promise.all([
                getJson(`/cliente/ofertas/${offerId}`),
                getJson('/cliente/tarjetas')
            ]);
            
            setOffer(offerData);
            setCards(cardsData);
            
            if (cardsData.length > 0) {
                const defaultCard = cardsData.find((c: any) => c.is_default) || cardsData[0];
                setSelectedCardId(defaultCard.id_tarjeta);
            }
        } catch (err: any) {
            setError(err.message || "Error al cargar la información del checkout");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (paymentMethod === "TARJETA" && !selectedCardId && cards.length > 0) {
            setError("Por favor selecciona una tarjeta para pagar.");
            return;
        }

        setIsConfirming(true);
        setError(null);
        try {
            // Aceptar la oferta con el método de pago elegido
            await putJson(`/cliente/ofertas/${offerId}/aceptar`, {
                metodo_pago: paymentMethod
            });
            // Redirigir al inicio (que mostrará el pedido activo)
            navigate(PATHS.CLIENT.HOME);
        } catch (err: any) {
            setError(err.message || "Error al procesar el pedido. Intenta de nuevo.");
            setIsConfirming(false);
        }
    };

    const handleCardAdded = (savedCard: any) => {
        setCards([...cards, savedCard]);
        setSelectedCardId(savedCard.id_tarjeta);
        setPaymentMethod("TARJETA");
        setIsCardExpanded(true);
        setIsAddingCard(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <PageHeader title="RESUMEN DEL PEDIDO" onBack={() => navigate(-1)} />
                <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500">
                    {error || "No se pudo cargar la información del pedido."}
                </div>
            </div>
        );
    }

    const orderNumber = String(offer.id_solicitud).padStart(5, '0');

    if (isAddingCard) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
                <PageHeader title="RESUMEN DEL PEDIDO" onBack={() => setIsAddingCard(false)} onClose={() => navigate(PATHS.CLIENT.HOME)} />

                <div className="p-6 max-w-md mx-auto w-full">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Añadir Nueva Tarjeta</h2>

                    <AddCardForm
                        onSuccess={handleCardAdded}
                        onCancel={() => setIsAddingCard(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
            <PageHeader title="RESUMEN DEL PEDIDO" onBack={() => navigate(-1)} onClose={() => navigate(PATHS.CLIENT.HOME)} />
            
            <div className="p-4 flex-1">
                <p className="text-gray-500 text-sm mb-4">Revisa los detalles antes de confirmar tu entrega.</p>
                <h3 className="font-bold text-gray-800 mb-4">Pedido: N°{orderNumber}</h3>

                {/* Proveedor Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                            <FaTint size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-500 tracking-wider">PROVEEDOR</p>
                            <p className="text-gray-800 font-medium">{offer.conductor_nombre} {offer.conductor_apellido}</p>
                        </div>
                    </div>
                    <div className="flex justify-between border-t border-gray-100 pt-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Cantidad</p>
                            <p className="font-semibold text-gray-800">{offer.solicitud_cantidad} barriles</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Precio</p>
                            <p className="font-bold text-blue-500">L {Number(offer.precio).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex gap-3 items-center">
                    <FaMapMarkerAlt className="text-blue-500 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Ubicación de Entrega</p>
                        <p className="text-xs text-gray-500">{offer.ubicacion_entrega || "Dirección no especificada"}</p>
                    </div>
                </div>

                {/* Tiempo Estimado */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-3 items-center">
                    <FaClock className="text-blue-500 flex-shrink-0" size={20} />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Tiempo Estimado</p>
                        <p className="text-xs text-gray-500">{offer.tiempo_estimado} Minutos</p>
                    </div>
                </div>

                {/* Método de Pago */}
                <h3 className="font-bold text-gray-800 text-sm tracking-widest mb-3">MÉTODO DE PAGO</h3>
                
                {error && !isAddingCard && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {/* Tarjeta Option */}
                    <div className={`bg-white rounded-xl border-2 transition-all ${paymentMethod === 'TARJETA' ? 'border-[var(--primary)]' : 'border-transparent shadow-sm'}`}>
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => {
                                setPaymentMethod("TARJETA");
                                setIsCardExpanded(!isCardExpanded);
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-600">
                                    <FaCreditCard size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Tarjeta</p>
                                    <p className="text-xs text-gray-500">Débito o Crédito</p>
                                </div>
                            </div>
                            {isCardExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>
                        
                        {/* Tarjetas List Expandable */}
                        {isCardExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-50 mt-2 pt-2">
                                {cards.map(card => (
                                    <label key={card.id_tarjeta} className="flex items-center gap-3 py-3 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="card" 
                                            className="w-5 h-5 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300"
                                            checked={selectedCardId === card.id_tarjeta}
                                            onChange={() => setSelectedCardId(card.id_tarjeta)}
                                        />
                                        <FaCreditCard className="text-gray-600" />
                                        <span className="text-gray-700 text-sm flex-1">{card.numero_tarjeta}</span>
                                    </label>
                                ))}
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsAddingCard(true);
                                    }}
                                    className="w-full mt-2 border-2 border-dashed border-blue-200 text-blue-500 rounded-xl py-3 flex items-center justify-center gap-2 font-medium hover:bg-blue-50 transition"
                                >
                                    <FaPlus /> Añadir Nueva Tarjeta
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Efectivo Option */}
                    <div 
                        className={`bg-white rounded-xl border-2 transition-all cursor-pointer p-4 flex items-center gap-3 ${paymentMethod === 'EFECTIVO' ? 'border-[var(--primary)]' : 'border-transparent shadow-sm'}`}
                        onClick={() => {
                            setPaymentMethod("EFECTIVO");
                            setIsCardExpanded(false);
                        }}
                    >
                        <div className="bg-gray-50 p-2 rounded-lg text-gray-600">
                            <FaMoneyBillWave size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Efectivo</p>
                            <p className="text-xs text-gray-500">Paga al recibir tu pedido</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4 max-w-md mx-auto px-2">
                    <p className="text-gray-500 text-sm font-medium">Total a Pagar</p>
                    <p className="text-2xl font-bold text-gray-900">L {Number(offer.precio).toFixed(2)}</p>
                </div>
                
                <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full max-w-md mx-auto block bg-[var(--primary)] text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isConfirming ? "Procesando..." : "Confirmar y Pagar →"}
                </button>
            </div>
        </div>
    );
}
