import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { FaDollarSign, FaTruck, FaTint } from "react-icons/fa";
import {
    HiOutlineBell,
    HiOutlineHome,
    HiOutlineTruck,
    HiOutlineUser,
} from "react-icons/hi2";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface PreviousOrder {
    id: number;
    cliente: string;
    direccion: string;
    fecha: string;
    hora: string;
    total: number;
    litros: number;
    status: "Completado" | "Cancelado" | "En camino";
}

// ─── Datos temporales ─────────────────────────────────────────────────────────
// Reemplazar con llamada al backend cuando esté listo:
// const pedidos = await orderService.getDriverHistory();

const PEDIDOS_MOCK: PreviousOrder[] = [
    {
        id: 1048,
        cliente: "Carlos Perez",
        direccion: "Res. Las Hadas, 1.5 km",
        fecha: "20/05/2026",
        hora: "8:15 a.m.",
        total: 750.0,
        litros: 1000,
        status: "Completado",
    },
    {
        id: 1049,
        cliente: "Carlos Perez",
        direccion: "Res. Las Hadas, 1.5 km",
        fecha: "20/05/2026",
        hora: "8:15 a.m.",
        total: 750.0,
        litros: 1000,
        status: "Completado",
    },
];

// ─── Badge de estado ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PreviousOrder["status"] }) {
    const styles: Record<PreviousOrder["status"], string> = {
        Completado: "bg-green-500 text-white",
        Cancelado: "bg-red-500 text-white",
        "En camino": "bg-yellow-400 text-white",
    };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${styles[status]}`}>
            {status}
        </span>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DriverHistory() {
    const navigate = useNavigate();

    /*
    ==================================================
    BACKEND
    ==================================================
    Reemplazar con:
    const driver = await authService.getDriverProfile();
    const pedidos = await orderService.getDriverHistory();
    ==================================================
    */

    const driverName = "Luis Rodriguez";

    const [pedidos] = useState<PreviousOrder[]>(PEDIDOS_MOCK);

    // Métricas calculadas desde los pedidos
    // Cuando haya backend, traer directo del servidor
    const ingresosHoy = pedidos
        .filter((p) => p.status === "Completado")
        .reduce((acc, p) => acc + p.total, 0);

    const totalPedidos = pedidos.length;

    const totalLitros = pedidos
        .filter((p) => p.status === "Completado")
        .reduce((acc, p) => acc + p.litros, 0);

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* ── HEADER ── */}
            <header className="relative w-full bg-[var(--secondary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">
                <button
                    onClick={() => {
                        /*
                        BACKEND
                        await authService.logout();
                        localStorage.removeItem("token");
                        navigate(PATHS.HOME);
                        */
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

                {/* ── PEDIDOS ANTERIORES ── */}
                <div className="bg-white rounded-xl shadow-md p-4">

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={1.8} stroke="currentColor"
                                className="w-6 h-6 text-[var(--secondary)]">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 6v6h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-base font-semibold text-gray-800">
                                Pedidos Anteriores
                            </h2>
                        </div>
                        <button
                            onClick={() => console.log("Ver todos")}
                            className="text-sm text-[var(--secondary)] font-medium"
                        >
                            Ver todos
                        </button>
                    </div>

                    {pedidos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <p className="text-gray-400 text-lg font-semibold">
                                No tienes pedidos aún
                            </p>
                            <p className="text-gray-400">¡Acepta tu primer pedido!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pedidos.map((pedido) => (
                                <div
                                    key={pedido.id}
                                    className="border border-gray-100 rounded-xl p-3 shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-800 text-sm">
                                            Pedido N°{pedido.id}
                                        </span>
                                        <StatusBadge status={pedido.status} />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500">{pedido.cliente}</p>
                                            <p className="text-xs text-gray-500">{pedido.direccion}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">{pedido.fecha}</p>
                                            <p className="text-xs text-gray-400">{pedido.hora}</p>
                                            <p className="text-sm font-bold text-gray-800 mt-0.5">
                                                L {pedido.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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
                            ${ingresosHoy}
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

            </main>

            {/* ── BOTTOM NAVIGATION ── */}
            <nav className="
        fixed bottom-0 left-0 right-0
        h-20 bg-[var(--primary)]
        flex justify-around items-center
        rounded-t-2xl shadow-lg z-50
      ">
                <NavItem
                    label="Notificaciones"
                    icon={<HiOutlineBell size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.NOTIFICATIONS)}
                />
                <NavItem
                    label="Inicio"
                    icon={<HiOutlineHome size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.HOME)}
                />
                <NavItem
                    label="Historial"
                    icon={<HiOutlineTruck size={28} />}
                    active={true}
                    onClick={() => { }}
                />
                <NavItem
                    label="Perfil"
                    icon={<HiOutlineUser size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.PROFILE)}
                />
            </nav>

        </div>
    );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center h-full flex-1 transition-all"
        >
            <div
                className={`
          flex flex-col items-center justify-center w-full h-full transition-all
          ${active ? "bg-[var(--secondary)] rounded-t-xl" : ""}
        `}
            >
                <div className="text-white">{icon}</div>
                <span className="text-white text-xs mt-1">{label}</span>
            </div>
        </button>
    );
}