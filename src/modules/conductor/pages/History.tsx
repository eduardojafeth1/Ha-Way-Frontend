import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { FaDollarSign, FaTruck, FaTint } from "react-icons/fa";
import { getJson } from "../../../services/api";
import DriverBottomNav from "../components/DriverBottomNav";

interface OrderData {
    id_pedido: number;
    cliente_nombre: string;
    cliente_apellido: string;
    direccion: string;
    fecha_inicio: string;
    pago_total: string | number;
    estado: string;
    cantidad: string | number;
}

function StatusBadge({ status }: { status: string }) {
    let style = "bg-gray-400 text-white";
    if (status === "ENTREGADO") style = "bg-green-500 text-white";
    if (status === "CANCELADO") style = "bg-red-500 text-white";
    if (status === "EN_CAMINO" || status === "PREPARANDO" || status === "LLEGO") style = "bg-yellow-400 text-white";
    if (status === "PENDIENTE") style = "bg-blue-400 text-white";

    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${style}`}>
            {status}
        </span>
    );
}

function OrderCard({ order, onClick }: { order: OrderData, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className="border border-gray-100 rounded-xl p-3 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-800 text-sm">
                    Pedido N°{order.id_pedido}
                </span>
                <StatusBadge status={order.estado} />
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-gray-500">{order.cliente_nombre} {order.cliente_apellido}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-[150px]">{order.direccion}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">{new Date(order.fecha_inicio).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.fecha_inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                        L {Number(order.pago_total || 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function DriverHistory() {
    const navigate = useNavigate();
    const driverName = localStorage.getItem("userName") || "Conductor";

    const [pedidos, setPedidos] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await getJson("/conductor/pedidos");
                setPedidos(data);
            } catch (err) {
                console.error("Error cargando pedidos", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    // Métricas calculadas desde los pedidos
    const hoyStr = new Date().toLocaleDateString();

    const ingresosHoy = pedidos
        .filter((p) => p.estado === "ENTREGADO" && new Date(p.fecha_inicio).toLocaleDateString() === hoyStr)
        .reduce((acc, p) => acc + Number(p.pago_total || 0), 0);

    const totalPedidos = pedidos.length;

    const totalLitros = pedidos
        .filter((p) => p.estado === "ENTREGADO")
        .reduce((acc, p) => acc + Number(p.cantidad || 0), 0);

    const activeOrders = pedidos.filter(p => p.estado !== "ENTREGADO" && p.estado !== "CANCELADO");
    const pastOrders = pedidos.filter(p => p.estado === "ENTREGADO" || p.estado === "CANCELADO");

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* ── HEADER ── */}
            <header className="relative w-full bg-[var(--secondary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userRole");
                        navigate(PATHS.HOME);
                    }}
                    className="absolute top-8 right-6 text-2xl hover:scale-110 transition-transform"
                    aria-label="Cerrar sesión"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </button>

                <div>
                    <p className="text-base font-light">Hola,</p>
                    <h1 className="text-3xl font-semibold leading-none">{driverName}</h1>
                </div>
            </header>

            <main className="px-5 mt-6 space-y-5">

                {/* ── TARJETAS DE MÉTRICAS ── */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Ingresos Hoy */}
                    <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center">
                            <FaDollarSign className="text-white text-xl" />
                        </div>
                        <p className="text-xs text-gray-400 text-center leading-tight">
                            Ingresos Hoy
                        </p>
                        <p className="text-sm font-bold text-[var(--secondary)]">
                            L{ingresosHoy.toFixed(2)}
                        </p>
                    </div>

                    {/* Pedidos */}
                    <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--secondary)] flex items-center justify-center">
                            <FaTruck className="text-white text-xl" />
                        </div>
                        <p className="text-xs text-gray-400 text-center leading-tight">
                            Pedidos
                        </p>
                        <p className="text-sm font-bold text-[var(--secondary)]">
                            {totalPedidos}
                        </p>
                    </div>

                    {/* Litros */}
                    <div className="bg-white rounded-2xl shadow-sm p-3 flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-orange-400 flex items-center justify-center">
                            <FaTint className="text-white text-xl" />
                        </div>
                        <p className="text-xs text-gray-400 text-center leading-tight">
                            Litros
                        </p>
                        <p className="text-sm font-bold text-[var(--secondary)]">
                            {totalLitros}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <span className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
                    </div>
                ) : (
                    <>
                        {/* ── PEDIDOS ACTIVOS ── */}
                        {activeOrders.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-4">
                                <div className="flex items-center gap-1 mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.8} stroke="currentColor"
                                        className="w-6 h-6 text-[var(--primary)]">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 6v6h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h2 className="text-base font-semibold text-gray-800">
                                        Pedidos Activos
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {activeOrders.map((pedido) => (
                                        <OrderCard 
                                            key={pedido.id_pedido} 
                                            order={pedido} 
                                            onClick={() => navigate(PATHS.DRIVER.TRACKING(pedido.id_pedido))}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── PEDIDOS ANTERIORES ── */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <div className="flex items-center gap-1 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    strokeWidth={1.8} stroke="currentColor"
                                    className="w-6 h-6 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h2 className="text-base font-semibold text-gray-800">
                                    Pedidos Anteriores
                                </h2>
                            </div>

                            {pastOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                    <p className="text-gray-400 text-sm font-semibold">
                                        Aún no tienes pedidos finalizados
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pastOrders.map((pedido) => (
                                        <OrderCard 
                                            key={pedido.id_pedido} 
                                            order={pedido} 
                                            onClick={() => navigate(PATHS.DRIVER.TRACKING(pedido.id_pedido))}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

            </main>

            {/* ── BOTTOM NAVIGATION ── */}
            <DriverBottomNav active="history" />

        </div>
    );
}