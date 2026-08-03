import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { HiOutlineBell } from "react-icons/hi2";
import { getJson, putJson } from "../../../services/api";
import DriverBottomNav from "../components/DriverBottomNav";

interface Notification {
    id_notificacion: number;
    titulo: string;
    mensaje: string;
    tipo: string;
    leida: boolean;
    fecha: string;
    id_referencia?: number;
}

function NotificationItem({
    notification,
    onMarkAsRead,
}: {
    notification: Notification;
    onMarkAsRead: (id: number) => void;
}) {
    const navigate = useNavigate();

    return (
        <div className={`bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all mb-3 ${!notification.leida ? 'border-l-4 border-l-[var(--primary)] bg-blue-50/20' : 'opacity-80'}`}>

            {/* Título e Ícono */}
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 text-[var(--primary)] rounded-full">
                    <HiOutlineBell size={18} />
                </div>
                <h2 className="font-bold text-gray-900 flex-1 text-sm">
                    {notification.titulo}
                </h2>
                {!notification.leida && (
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
            </div>

            {/* Mensaje */}
            <p className="text-gray-700 text-sm mb-3 pl-11">
                {notification.mensaje}
            </p>

            {/* Pie de la tarjeta */}
            <div className="flex items-center justify-between pl-11">
                <span className="text-xs text-gray-500 font-medium">
                    {new Date(notification.fecha).toLocaleString()}
                </span>
                
                <button
                    onClick={() => {
                        onMarkAsRead(notification.id_notificacion);
                        if (notification.id_referencia) {
                            navigate(PATHS.DRIVER.TRACKING(notification.id_referencia));
                        }
                    }}
                    className="text-[var(--primary)] font-bold text-sm hover:underline"
                >
                    Ver detalle
                </button>
            </div>
            
        </div>
    );
}

export default function DriverNotifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const driverName = localStorage.getItem("userName") || "Conductor";

    const fetchNotifications = async () => {
        try {
            const data = await getJson("/conductor/notificaciones");
            setNotifications(data);
        } catch (err: any) {
            setError("Error al cargar notificaciones.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 10000); // 10 segundos

        return () => clearInterval(intervalId);
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            await putJson(`/conductor/notificaciones/${id}/leida`, {});
            // Actualizar localmente
            setNotifications(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n));
        } catch (err) {
            console.error("Error al marcar como leída", err);
        }
    };

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

            {/* Contenido Principal */}
            <main className="px-6 pt-6 pb-6">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <HiOutlineBell size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">No tienes notificaciones</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {notifications.map((notif) => (
                            <NotificationItem
                                key={notif.id_notificacion}
                                notification={notif}
                                onMarkAsRead={handleMarkAsRead}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── BOTTOM NAVIGATION ── */}
            <DriverBottomNav active="notifications" />

        </div>
    );
}