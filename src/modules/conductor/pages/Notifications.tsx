import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import gota from "../../../assets/icons/gota_pedidoactual.svg";
import {
    HiOutlineBell,
    HiOutlineHome,
    HiOutlineTruck,
    HiOutlineUser,
} from "react-icons/hi2";

interface Notification {
    id: number;
    orderNumber: string;
    supplierName: string;
    status: string;
    message: string;
}

const NOTIFICACIONES_MOCK: Notification[] = [
    {
        id: 1,
        orderNumber: "00001",
        supplierName: "Agua Pura Exp.",
        status: "Entregando",
        message:
            "El camión ha llegado a su destino y está listo para hacer la entrega.",
    },
];

function NotificationItem({
    notification,
    onViewDetail,
}: {
    notification: Notification;
    onViewDetail: (id: number) => void;
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">

            {/* Título */}
            <div className="flex items-center gap-2 mb-3">

                <img src={gota} alt="" className="w-6 h-6" />

                <h2 className="font-bold text-gray-900">
                    Notificación: Pedido N°{notification.orderNumber}
                </h2>

            </div>

            {/* Proveedor y estado */}
            <div className="flex items-center justify-between mb-3">

                <span className="font-semibold text-cyan-500">
                    {notification.supplierName}
                </span>

                <span className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm">
                    {notification.status}
                </span>

            </div>

            {/* Mensaje */}
            <p className="text-gray-700 text-sm mb-4">
                {notification.message}
            </p>

            {/* Botón */}
            <div className="flex justify-center">

                <button
                    onClick={() => onViewDetail(notification.id)}
                    className="
                        bg-[var(--primary)]
                        text-white
                        px-8
                        py-2
                        rounded-lg
                        font-medium
                        hover:opacity-90
                        transition
                    "
                >
                    Ver detalle
                </button>

            </div>

        </div>
    );
}

export default function DriverNotifications() {
    const navigate = useNavigate();

    const driverName = "Luis Rodriguez";
    const [notifications] = useState<Notification[]>(NOTIFICACIONES_MOCK);

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* ── HEADER ── */}
            <header className="relative w-full bg-[var(--primary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">
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

            <main className="px-5 mt-6 space-y-4">

                {notifications.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-gray-400 text-lg font-semibold">
                            No tienes notificaciones
                        </p>
                    </div>

                ) : (

                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onViewDetail={(id) => console.log("Ver detalle", id)}
                        />
                    ))

                )}

            </main>

            {/* ── BARRA INFERIOR ── */}
            <nav className="
                fixed bottom-0 left-0 right-0
                h-20 bg-[var(--primary)]
                flex justify-around items-center
                rounded-t-2xl shadow-lg z-50
            ">
                <NavItem
                    label="Notificaciones"
                    icon={<HiOutlineBell size={28} />}
                    active={true}
                    badge={notifications.length}
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
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.HISTORY)}
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

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    badge?: number;
}

function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
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
                <div className="relative text-white">
                    {icon}

                    {!!badge && badge > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {badge}
                        </span>
                    )}
                </div>

                <span className="text-white text-xs mt-1">{label}</span>
            </div>
        </button>
    );
}