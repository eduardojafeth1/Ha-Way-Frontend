import { FaCheck, FaTint, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

interface TrackingTimelineProps {
    estado: string;
}

export default function TrackingTimeline({ estado }: TrackingTimelineProps) {
    const statesMap = {
        'PENDIENTE': 0,
        'PREPARANDO': 1,
        'EN_CAMINO': 2,
        'LLEGO': 2,
        'ENTREGADO': 3,
        'CANCELADO': -1
    };

    const currentIndex = statesMap[estado as keyof typeof statesMap] ?? 0;

    const steps = [
        {
            title: "Pedido confirmado",
            icon: <FaCheck />,
            index: 0
        },
        {
            title: "Preparando envío",
            icon: <FaTint />,
            index: 1
        },
        {
            title: "En camino",
            icon: <FaTruck />,
            index: 2
        },
        {
            title: "Entregado",
            icon: <FaMapMarkerAlt />,
            index: 3
        }
    ];

    if (estado === 'CANCELADO') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
                <div className="flex items-center gap-3 text-red-500 mb-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <FaCheck />
                    </div>
                    <div>
                        <p className="font-bold">Pedido cancelado</p>
                        <p className="text-xs">El pedido fue cancelado exitosamente.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-4">
            <div className="flex items-center gap-2 mb-6">
                <FaTruck className="text-[var(--primary)]" />
                <h3 className="font-bold text-gray-800 text-sm tracking-wide">Estado del Pedido</h3>
            </div>

            <div className="relative pl-4">
                {/* Línea vertical de fondo (gris) */}
                <div className="absolute left-[2.22rem] top-4 bottom-8 w-[2px] bg-gray-200"></div>

                {steps.map((step, idx) => {
                    const isCompleted = currentIndex > step.index;
                    const isCurrent = currentIndex === step.index;
                    const isPending = currentIndex < step.index;

                    let iconBg = "bg-gray-100 text-gray-400";
                    let textColor = "text-gray-400 font-medium";
                    let subText = "En espera";
                    let lineColor = "bg-gray-200";

                    if (isCompleted) {
                        iconBg = "bg-green-500 text-white";
                        textColor = "text-gray-800 font-bold";
                        subText = "Completado";
                        lineColor = "bg-green-500";
                    } else if (isCurrent) {
                        iconBg = "bg-[var(--primary)] text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]";
                        textColor = "text-[var(--primary)] font-bold";
                        subText = "Actual";
                        lineColor = "bg-gray-200"; 
                    }

                    const showProgressLine = idx < steps.length - 1;

                    return (
                        <div key={idx} className="relative mb-8 last:mb-0">
                            {/* Línea vertical de progreso activa */}
                            {showProgressLine && isCompleted && (
                                <div className="absolute left-[1.22rem] top-[2.2rem] w-[2px] h-11 bg-green-500 z-0"></div>
                            )}

                            <div className="flex items-start gap-4 relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} transition-colors duration-300`}>
                                    {step.icon}
                                </div>
                                <div className="mt-1">
                                    <p className={`text-sm ${textColor}`}>{step.title}</p>
                                    <p className={`text-xs ${isCurrent ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                                        {subText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
