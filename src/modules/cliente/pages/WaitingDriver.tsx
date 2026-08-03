import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJson, putJson } from "../../../services/api";
import { PATHS } from "../../../routes/path";

import PageHeader from "../components/PageHeader";
import OfferSelectionView, { type Offer } from "../components/Waiting/OfferSelectionView";

import { FaTint } from "react-icons/fa";

export default function WaitingDriver() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        // Polling para buscar ofertas cada 5 segundos
        const fetchOffers = async () => {
            try {
                const data = await getJson(`/cliente/solicitudes/${id}/ofertas`);
                setOffers(data);
            } catch (err) {
                console.error("Error al obtener ofertas:", err);
            }
        };

        // Hacer la primera llamada inmediatamente
        fetchOffers();

        const interval = setInterval(fetchOffers, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const handleConfirmOffer = async (offerId: number) => {
        // Redirigir al Checkout en lugar de aceptar inmediatamente
        navigate(PATHS.CLIENT.CHECKOUT(offerId));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            <PageHeader
                title="PEDIDO"
                onBack={() => navigate(-1)}
                onClose={() => navigate(PATHS.CLIENT.HOME)}
            />

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {offers.length === 0 ? (
                /* Contenedor principal que centra vertical y horizontalmente */
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                    {/* Círculo base: ahora es responsivo, más grande y mantiene proporción 1:1 */}
                    <div
                        className="
                            relative
                            w-11/12
                            max-w-sm
                            aspect-square
                            rounded-full
                            bg-blue-50
                            flex
                            flex-col
                            items-center
                            justify-center
                            p-6
                        "
                    >
                        {/* Ícono de la gota en el centro superior */}
                        <div
                            className="
                                w-24
                                h-24
                                rounded-full
                                bg-[var(--primary)]
                                flex
                                items-center
                                justify-center
                                animate-pulse
                                mb-6
                            "
                        >
                            <FaTint
                                className="text-white"
                                size={38}
                            />
                        </div>

                        {/* Título configurado en una sola línea */}
                        <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary)] text-center whitespace-nowrap">
                            Buscando cisternas...
                        </h2>

                        {/* Subtexto descriptivo */}
                        <p
                            className="
                                mt-3
                                text-center
                                text-gray-600
                                text-base
                                max-w-xs
                                leading-relaxed
                            "
                        >
                            Conectando con proveedores cerca de tu ubicación
                        </p>
                    </div>

                    <div className="w-11/12 max-w-sm mt-8">
                        <button 
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) {
                                    try {
                                        setIsConfirming(true);
                                        await putJson(`/cliente/solicitudes/${id}/cancelar`, {});
                                        alert("Solicitud cancelada exitosamente");
                                        navigate(PATHS.CLIENT.HISTORY);
                                    } catch (err: any) {
                                        alert(err.message || "Error al cancelar la solicitud");
                                        setIsConfirming(false);
                                    }
                                }
                            }}
                            disabled={isConfirming}
                            className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-100 transition shadow-sm disabled:opacity-50"
                        >
                            {isConfirming ? "Cancelando..." : "Cancelar Solicitud"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <OfferSelectionView 
                        offers={offers}
                        onConfirm={handleConfirmOffer}
                        isConfirming={isConfirming}
                    />
                    
                    {/* Add cancel button under offers as well */}
                    <div className="p-4 bg-white border-t border-gray-100 mt-auto pb-10">
                        <button 
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) {
                                    try {
                                        setIsConfirming(true);
                                        await putJson(`/cliente/solicitudes/${id}/cancelar`, {});
                                        alert("Solicitud cancelada exitosamente");
                                        navigate(PATHS.CLIENT.HISTORY);
                                    } catch (err: any) {
                                        alert(err.message || "Error al cancelar la solicitud");
                                        setIsConfirming(false);
                                    }
                                }
                            }}
                            disabled={isConfirming}
                            className="w-full max-w-md mx-auto block bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold hover:bg-red-100 transition shadow-sm disabled:opacity-50"
                        >
                            {isConfirming ? "Cancelando..." : "Cancelar Solicitud"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

