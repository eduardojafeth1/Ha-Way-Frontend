import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";

type OrderStatus = "Confirmado" | "Disponible" | "Precio";

interface AvailableOrder {
    id: number;
    proveedor: string;
    distancia: string;
    capacidad: string | null;
    direccion: string | null;
    status: OrderStatus;
}

const PEDIDOS_MOCK: AvailableOrder[] = [
    {
        id: 1,
        proveedor: "Eduardo",
        distancia: "2.5 km",
        capacidad: null,
        direccion: "Dirección",
        status: "Confirmado",
    },
    {
        id: 2,
        proveedor: "Erlin",
        distancia: "3 km",
        capacidad: "15,000L",
        direccion: null,
        status: "Disponible",
    },
    {
        id: 3,
        proveedor: "Angel",
        distancia: "2 km",
        capacidad: "1,000L",
        direccion: null,
        status: "Precio",
    },
];

const STATUS_COLOR: Record<OrderStatus, string> = {
    Confirmado: "text-gray-400",
    Disponible: "text-gray-400",
    Precio: "text-gray-400",
};

export default function SearchOrders() {
    const navigate = useNavigate();
    const [pedidos] = useState<AvailableOrder[]>(PEDIDOS_MOCK);

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* ── HEADER ── */}
            <div className="flex items-center px-5 pt-10 pb-2">
                <button
                    onClick={() => navigate(PATHS.DRIVER.HOME)}
                    className="w-9 h-9 rounded-full border-2 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] hover:scale-110 transition-transform"
                    aria-label="Volver"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold tracking-widest text-gray-900 uppercase">
                    Buscar Pedido
                </h1>
                <div className="w-9" />
            </div>

            {/* ── SUBTÍTULO ── */}
            <div className="flex items-center gap-1 px-6 pb-3">
                <span className="text-[var(--primary)] text-sm">💧</span>
                <span className="text-xs text-gray-400">{pedidos.length} proveedores disponibles</span>
            </div>

            {/* ── LISTA DE PROVEEDORES ── */}
            <div className="px-5 space-y-3 flex-1">
                {pedidos.map((pedido) => (
                    <div
                        key={pedido.id}
                        className="border border-gray-200 rounded-2xl px-4 py-3 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-800 text-sm">
                                {pedido.proveedor}
                            </span>
                            <span className={`text-xs ${STATUS_COLOR[pedido.status]}`}>
                                {pedido.status}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">

                                <div className="flex items-center gap-1">
                                    <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 text-xs">📍</span>
                                    <span className="text-xs text-gray-500">{pedido.distancia}</span>
                                </div>

                                {pedido.direccion && (
                                    <div className="flex items-center gap-1">
                                        <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 text-xs">💧</span>
                                        <span className="text-xs text-[var(--primary)] font-medium">
                                            {pedido.direccion}
                                        </span>
                                    </div>
                                )}

                                {pedido.capacidad && (
                                    <div className="flex items-center gap-1">
                                        <span className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 text-xs">💧</span>
                                        <span className="text-xs text-gray-500">{pedido.capacidad}</span>
                                    </div>
                                )}

                            </div>

                            <button
                                onClick={() => console.log("Pedido seleccionado:", pedido.id)}
                                className="text-[var(--primary)] font-bold text-lg leading-none"
                                aria-label="Seleccionar pedido"
                            >
                                ✓
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}