import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import gota from "../../../assets/icons/gota_pedidoactual.svg";
import BottomNavigation from "../components/Home/BottomNavigation";
import { getJson, putJson } from "../../../services/api";

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
        <div className={`bg-white rounded-xl shadow-md p-5 transition-all mb-1 ${!notification.leida ? 'border-[1px] border-gray-100' : 'opacity-80'}`}>

            {/* Título */}
            <div className="flex items-center gap-2 mb-3">
                <img src={gota} alt="" className="w-4 h-4" />
                <h2 className="font-bold text-gray-900 flex-1 text-[15px]">
                    {notification.titulo}
                </h2>
                {!notification.leida && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                )}
            </div>

            {/* Proveedor y estado */}
            <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-cyan-500 text-[15px]">
                    Ha'Way
                </span>
                <span className="border border-red-300 text-red-500 bg-red-50 px-3 py-1 rounded-md text-xs font-semibold">
                    {notification.tipo}
                </span>
            </div>

            {/* Mensaje */}
            <p className="text-gray-800 text-sm mb-5 leading-snug font-medium">
                {notification.mensaje}
            </p>

            {/* Botón central */}
            <div className="flex justify-center mt-1">
                <button
                    onClick={() => {
                        onMarkAsRead(notification.id_notificacion);
                        if (notification.id_referencia) {
                            if (notification.tipo === 'NUEVA_OFERTA') {
                                navigate(PATHS.CLIENT.HISTORY);
                            } else {
                                navigate(PATHS.CLIENT.ORDER_DETAIL(notification.id_referencia));
                            }
                        }
                    }}
                    className="bg-[var(--primary)] text-white w-48 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Ver detalle
                </button>
            </div>
            
        </div>
    );
}

export default function ClientNotifications() {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const clientName = localStorage.getItem("userName") || "Cliente";

    const fetchNotifications = async () => {
        try {
            const data = await getJson("/cliente/notificaciones");
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
            await putJson(`/cliente/notificaciones/${id}/leida`, {});
            // Actualizar localmente
            setNotifications(prev => prev.map(n => n.id_notificacion === id ? { ...n, leida: true } : n));
        } catch (err) {
            console.error("Error al marcar como leída", err);
        }
    };

    const unreadCount = notifications.filter(n => !n.leida).length;

    return (
        <div className="min-h-screen bg-gray-100 pb-28">

            {/* ── HEADER ── */}
            <header className="relative w-full bg-[var(--primary)] rounded-b-[40px] px-6 pt-8 pb-10 text-white">
                <button
                    onClick={() => navigate(PATHS.CLIENT.HOME)}
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
                    <h1 className="text-3xl font-semibold leading-none">{clientName}</h1>
                </div>
                {unreadCount > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                        <p className="text-sm font-medium">{unreadCount} no leídas</p>
                    </div>
                )}
            </header>

            <main className="px-5 mt-6 space-y-4">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2">
                        <span className="w-9 h-9 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
                        <p className="text-gray-500 text-sm">Cargando notificaciones...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-semibold">
                        {error}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-gray-400 text-lg font-semibold">
                            No tienes notificaciones
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id_notificacion}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))
                )}

            </main>

            <BottomNavigation
                active="notifications"
                onNotificationsClick={() => { }}
                onHomeClick={() => navigate(PATHS.CLIENT.HOME)}
                onHistoryClick={() => navigate(PATHS.CLIENT.HISTORY)}
                onProfileClick={() => navigate(PATHS.CLIENT.PROFILE)}
            />

        </div>
    );
}
