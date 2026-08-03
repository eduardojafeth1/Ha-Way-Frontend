import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import PageHeader from "../components/PageHeader";
import { getJson, putJson } from "../../../services/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import TrackingTimeline from "../components/TrackingTimeline";
import RatingForm from "../components/RatingForm";

export default function OrderDetail() {
    const { id: pedidoId } = useParams();
    const navigate = useNavigate();

    const [pedido, setPedido] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                setLoading(true);
                const data = await getJson(`/cliente/pedidos/${pedidoId}`);
                setPedido(data.pedido || data); // Manejar estructura anterior o nueva
            } catch (err: any) {
                setError(err.message || "Error al cargar la información del pedido");
            } finally {
                setLoading(false);
            }
        };

        fetchPedido();
    }, [pedidoId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pedido) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <PageHeader title="SEGUIMIENTO" onBack={() => navigate(-1)} />
                <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500">
                    {error || "No se pudo cargar la información del pedido."}
                </div>
            </div>
        );
    }

    const orderNumber = String(pedido.id_pedido || pedido.id_solicitud).padStart(5, '0');
    
    // Progress calculation for the progress bar
    let progress = 0;
    if (pedido.estado === 'PENDIENTE') progress = 10;
    else if (pedido.estado === 'PREPARANDO') progress = 40;
    else if (pedido.estado === 'EN_CAMINO' || pedido.estado === 'LLEGO') progress = 80;
    else if (pedido.estado === 'ENTREGADO') progress = 100;

    const handleRatingSubmit = async (puntuacion: number, comentario: string) => {
        await putJson(`/cliente/pedidos/${pedidoId}/calificar`, { puntuacion, comentario });
        setPedido({ ...pedido, calificado: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pb-10">
            <div className="bg-white sticky top-0 z-20 shadow-sm">
                <PageHeader title="SEGUIMIENTO" onBack={() => navigate(-1)} onClose={() => navigate(PATHS.CLIENT.HOME)} />
            </div>
            
            <div className="p-4 flex-1 max-w-md w-full mx-auto">
                
                {/* Progress Bar Card */}
                {pedido.estado !== 'CANCELADO' && (
                    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-4">
                        <div className="flex justify-between items-end mb-3">
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="text-[var(--primary)] text-sm">⏱</span>
                                <span className="font-semibold text-sm">Tiempo estimado de entrega</span>
                            </div>
                        </div>
                        
                        <div className="bg-[var(--primary)] text-white rounded-lg p-3 relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-center text-sm font-bold">
                                <span>{pedido.estado === 'ENTREGADO' ? 'Pedido entregado' : `${pedido.tiempo_estimado || 0} minutos`}</span>
                            </div>
                            <div className="mt-2 h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-white transition-all duration-1000 ease-in-out" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mock Map Card */}
                {pedido.estado !== 'CANCELADO' && (
                    <div className="bg-gray-200 rounded-xl shadow-sm border border-gray-100 h-40 mb-4 relative overflow-hidden flex items-center justify-center">
                        {/* Simulación del mapa base */}
                        <div className="absolute inset-0 opacity-40 bg-[url('https://maps.wikimedia.org/osm-intl/14/4195/7279.png')] bg-cover bg-center"></div>
                        <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <FaMapMarkerAlt className="text-[var(--primary)]" size={24} />
                        </div>
                    </div>
                )}

                {/* Timeline Card */}
                <TrackingTimeline estado={pedido.estado} />

                {/* Detalles del Pedido */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-6">
                    <h3 className="font-bold text-gray-800 text-sm mb-4">Detalles del Pedido (N°{orderNumber})</h3>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Proveedor</span>
                            <span className="font-medium text-gray-800 text-right">{pedido.conductor_nombre} {pedido.conductor_apellido}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Cantidad</span>
                            <span className="font-medium text-gray-800 text-right">{pedido.cantidad} barriles</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-gray-500">Total</span>
                            <span className="font-medium text-gray-800 text-right">L {Number(pedido.precio).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                            <span className="text-gray-500">Pago</span>
                            <span className="font-medium text-gray-800 text-right capitalize">{String(pedido.pago_metodo || 'efectivo').toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Rating Form - Only if delivered and not yet rated */}
                {pedido.estado === 'ENTREGADO' && !pedido.calificado && (
                    <RatingForm pedidoId={pedido.id_pedido} onRatingSubmit={handleRatingSubmit} />
                )}

                {/* Cancel Button */}
                {pedido.estado !== 'ENTREGADO' && pedido.estado !== 'CANCELADO' && (
                    <div className="mt-6 mb-4">
                        <button 
                            onClick={async () => {
                                if (window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) {
                                    try {
                                        setLoading(true);
                                        await putJson(`/cliente/pedidos/${pedidoId}/cancelar`, {});
                                        alert("Pedido cancelado exitosamente");
                                        navigate(PATHS.CLIENT.HISTORY);
                                    } catch (err: any) {
                                        alert(err.message || "Error al cancelar el pedido");
                                        setLoading(false);
                                    }
                                }
                            }}
                            className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-100 transition shadow-sm"
                        >
                            Cancelar Pedido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
