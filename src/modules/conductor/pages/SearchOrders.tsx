import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { getJson, postJson } from "../../../services/api";

interface SolicitudDisponible {
    id_solicitud: number;
    id_cliente: number;
    id_direccion: number;
    cantidad: number;
    unidad_medida: string;
    fecha_programada: string | null;
    hora_programada: string | null;
    descripcion: string | null;
    estado: string;
    direccion: string;
    referencia: string | null;
    latitud: number;
    longitud: number;
    nombre_direccion: string;
    cliente_nombre: string;
    cliente_apellido: string;
}

export default function SearchOrders() {
    const navigate = useNavigate();

    // Estados
    const [solicitudes, setSolicitudes] = useState<SolicitudDisponible[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal de oferta
    const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudDisponible | null>(null);
    const [precio, setPrecio] = useState("");
    const [tiempoEstimado, setTiempoEstimado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [submittingOffer, setSubmittingOffer] = useState(false);
    const [offerSuccess, setOfferSuccess] = useState("");
    const [offerError, setOfferError] = useState("");

    // Cargar solicitudes disponibles
    const loadSolicitudes = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getJson("/conductor/solicitudes/disponibles");
            setSolicitudes(data);
        } catch (err: any) {
            setError(err.message || "Error al obtener solicitudes disponibles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSolicitudes();
    }, []);

    // Abrir modal de oferta
    const handleOpenOfferModal = (solicitud: SolicitudDisponible) => {
        setSelectedSolicitud(solicitud);
        setPrecio("");
        setTiempoEstimado("");
        setMensaje("");
        setOfferSuccess("");
        setOfferError("");
    };

    // Cerrar modal
    const handleCloseOfferModal = () => {
        setSelectedSolicitud(null);
    };

    // Enviar oferta al backend
    const handleSendOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSolicitud) return;

        if (!precio || !tiempoEstimatedIsValid()) {
            setOfferError("Por favor ingresa un precio y tiempo válidos.");
            return;
        }

        setOfferError("");
        setOfferSuccess("");
        setSubmittingOffer(true);

        const payload = {
            id_solicitud: selectedSolicitud.id_solicitud,
            precio: parseFloat(precio),
            tiempo_estimado: parseInt(tiempoEstimado, 10),
            mensaje: mensaje.trim() || null,
        };

        try {
            await postJson("/conductor/ofertas", payload);
            setOfferSuccess("¡Oferta enviada exitosamente!");
            
            // Eliminar la solicitud de la lista local
            setSolicitudes((prev) =>
                prev.filter((s) => s.id_solicitud !== selectedSolicitud.id_solicitud)
            );

            // Cerrar el modal después de 1.5 segundos
            setTimeout(() => {
                handleCloseOfferModal();
            }, 1500);
        } catch (err: any) {
            setOfferError(err.message || "Error al enviar la oferta.");
        } finally {
            setSubmittingOffer(false);
        }
    };

    const tiempoEstimatedIsValid = () => {
        const min = parseInt(tiempoEstimado, 10);
        return !isNaN(min) && min > 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-10">

            {/* Header */}
            <div className="flex items-center px-5 pt-10 pb-4 bg-white shadow-sm">
                <button
                    onClick={() => navigate(PATHS.DRIVER.HOME)}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:scale-105 active:scale-95 transition-all"
                    aria-label="Volver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold tracking-wider text-gray-800 uppercase">
                    Pedidos de Agua Disponibles
                </h1>
                <div className="w-9" />
            </div>

            {/* Subtítulo */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-[var(--primary)] text-lg">💧</span>
                    <span className="text-sm font-semibold text-gray-600">
                        {solicitudes.length} solicitudes de agua publicadas
                    </span>
                </div>
                <button 
                    onClick={loadSolicitudes}
                    className="text-xs text-[var(--primary)] font-bold hover:underline"
                >
                    Actualizar
                </button>
            </div>

            {/* Lista de Solicitudes */}
            <div className="px-5 space-y-4 flex-1">
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-2xl border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <span className="w-9 h-9 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
                        <p className="text-gray-500 text-sm">Buscando solicitudes en tu área...</p>
                    </div>
                ) : solicitudes.length === 0 ? (
                    <div className="bg-white border border-gray-150 rounded-3xl p-8 text-center text-gray-500 shadow-sm space-y-3">
                        <span className="text-4xl block">🚚</span>
                        <p className="font-semibold text-gray-700 text-base">No hay pedidos disponibles</p>
                        <p className="text-xs text-gray-400">Los clientes no han solicitado entregas en este momento. Intenta de nuevo más tarde.</p>
                    </div>
                ) : (
                    solicitudes.map((sol) => (
                        <div
                            key={sol.id_solicitud}
                            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-[var(--primary)] transition-all"
                        >
                            {/* Cliente y Estado */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-base">
                                        {sol.cliente_nombre} {sol.cliente_apellido}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        Solicitado: {new Date(sol.fecha_programada || "").toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                                    {sol.unidad_medida === "BARRILES" ? "Barriles" : sol.unidad_medida === "CISTERNA" ? "Cisterna" : "Galones"}
                                </span>
                            </div>

                            {/* Detalles de entrega */}
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <span className="text-base">📍</span>
                                    <div>
                                        <p className="font-medium text-gray-700">{sol.direccion}</p>
                                        {sol.referencia && (
                                            <p className="text-xs text-gray-400">Ref: {sol.referencia}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-base">📦</span>
                                    <p>
                                        Cantidad: <span className="font-bold text-gray-800">{sol.cantidad}</span>
                                    </p>
                                </div>

                                {sol.hora_programada && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">⏰</span>
                                        <p>
                                            Hora programada: <span className="font-semibold text-gray-800">{sol.hora_programada.substring(0, 5)}</span>
                                        </p>
                                    </div>
                                )}

                                {sol.descripcion && (
                                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl text-xs text-gray-500 italic mt-1">
                                        "{sol.descripcion}"
                                    </div>
                                )}
                            </div>

                            {/* Botón de acción */}
                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => handleOpenOfferModal(sol)}
                                    className="bg-[var(--primary)] text-white font-bold text-sm px-5 py-3 rounded-2xl hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                    <span>Ofertar entrega</span>
                                    <span>✓</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Oferta */}
            {selectedSolicitud && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl relative">
                        <button
                            onClick={handleCloseOfferModal}
                            disabled={submittingOffer}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            &times;
                        </button>

                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-800">Enviar Oferta de Entrega</h2>
                            <p className="text-xs text-gray-400 mt-1">
                                Para: {selectedSolicitud.cliente_nombre} • {selectedSolicitud.cantidad} {selectedSolicitud.unidad_medida}
                            </p>
                        </div>

                        {offerError && (
                            <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-200">
                                {offerError}
                            </div>
                        )}

                        {offerSuccess && (
                            <div className="bg-green-50 text-green-600 text-sm font-medium p-3 rounded-xl border border-green-200">
                                {offerSuccess}
                            </div>
                        )}

                        <form onSubmit={handleSendOffer} className="space-y-4">
                            {/* Precio */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                    Precio de la entrega (Lempiras)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Lps.</span>
                                    <input
                                        type="number"
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        placeholder="Ej. 1200"
                                        min="1"
                                        disabled={submittingOffer || !!offerSuccess}
                                        required
                                        className="w-full bg-gray-100 rounded-2xl py-3 pl-14 pr-4 text-gray-850 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] text-lg"
                                    />
                                </div>
                            </div>

                            {/* Tiempo Estimado */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                    Tiempo estimado de llegada (Minutos)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={tiempoEstimado}
                                        onChange={(e) => setTiempoEstimado(e.target.value)}
                                        placeholder="Ej. 45"
                                        min="1"
                                        disabled={submittingOffer || !!offerSuccess}
                                        required
                                        className="w-full bg-gray-100 rounded-2xl py-3 px-4 text-gray-850 font-bold outline-none focus:ring-2 focus:ring-[var(--primary)] text-lg"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">minutos</span>
                                </div>
                            </div>

                            {/* Mensaje */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                    Mensaje al cliente (Opcional)
                                </label>
                                <textarea
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    placeholder="Ej. Cisterna esterilizada y disponible de inmediato"
                                    maxLength={200}
                                    disabled={submittingOffer || !!offerSuccess}
                                    className="w-full bg-gray-100 rounded-2xl py-3 px-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--primary)] h-20 resize-none"
                                />
                            </div>

                            {/* Botón de Enviar */}
                            <button
                                type="submit"
                                disabled={submittingOffer || !!offerSuccess}
                                className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                                    submittingOffer || !!offerSuccess
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-[var(--primary)] text-white hover:opacity-90 active:scale-95 shadow-md"
                                }`}
                            >
                                {submittingOffer ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Enviando oferta...
                                    </>
                                ) : offerSuccess ? (
                                    "¡Oferta enviada!"
                                ) : (
                                    "Enviar Oferta"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}