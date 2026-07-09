import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import waterTruckIcon from "../../../assets/images/water-truck-icon.svg";
import {
    HiOutlineBell,
    HiOutlineHome,
    HiOutlineTruck,
    HiOutlineUser,
} from "react-icons/hi2";

interface PreviousOrder {
    id: number;
    cliente: string;
    direccion: string;
    fecha: string;
    hora: string;
    total: number;
    status: "Completado" | "Cancelado" | "En camino";
}

const PEDIDOS_MOCK: PreviousOrder[] = [
    {
        id: 1048,
        cliente: "Carlos Perez",
        direccion: "Res. Las Hadas, 1.5 km",
        fecha: "20/05/2026",
        hora: "8:15 a.m.",
        total: 750.0,
        status: "Completado",
    },
    {
        id: 1049,
        cliente: "Carlos Perez",
        direccion: "Res. Las Hadas, 1.5 km",
        fecha: "20/05/2026",
        hora: "8:15 a.m.",
        total: 750.0,
        status: "Completado",
    },
];

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

export default function DriverHome() {
    const navigate = useNavigate();

    const driverName = "Juan Pérez";
    const [pedidos] = useState<PreviousOrder[]>(PEDIDOS_MOCK);

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* ── HEADER ── */}
            <header className="relative w-full bg-[var(--secondary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">
                <button
                    onClick={() => navigate(PATHS.HOME)}
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

                {/* ── BOTÓN BUSCAR PEDIDOS ── */}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/conductor/buscar-pedidos")}
                        className="
                            w-full
                            max-w-[320px]
                            h-[170px]
                            rounded-[28px]
                            bg-gradient-to-b
                            from-[var(--secondary)]
                            to-[var(--primary)]
                            flex
                            flex-col
                            items-center
                            justify-center
                            shadow-md
                            hover:scale-[1.02]
                            active:scale-95
                            transition-all
                        "
                    >
                        <img
                            src={waterTruckIcon}
                            alt="Buscar pedidos"
                            className="w-28 mb-4"
                        />
                        <span className="text-white text-3xl font-semibold">
                            BUSCAR PEDIDOS
                        </span>
                    </button>
                </div>

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
                            onClick={() => navigate(PATHS.DRIVER.HISTORY)}
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
                    onClick={() => { }}
                />
                <NavItem
                    label="Inicio"
                    icon={<HiOutlineHome size={28} />}
                    active={true}
                    onClick={() => navigate(PATHS.DRIVER.HOME)}
                />
                <NavItem
                    label="Historial"
                    icon={<HiOutlineTruck size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.HISTORY)}
                />
                <NavItem
                    label="Perfil"
                    icon={<HiOutlineUser size={28} />}
                    active={false}
                    onClick={() => { }}
                />
            </nav>

        </div>
    );
}

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