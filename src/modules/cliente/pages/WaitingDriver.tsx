import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {PATHS} from "../../../routes/path";
import PageHeader from "../components/PageHeader";

import { FaTint } from "react-icons/fa";

export default function WaitingDriver() {

    const navigate = useNavigate();

    useEffect(() => {

        /*
        ===================================================

        BACKEND

        Aquí se consultará el estado del pedido.

        Ejemplo:

        const interval = setInterval(async () => {

            const response =
                await orderService.checkOffers(orderId);

            if(response.totalOffers >= 3){

                clearInterval(interval);

                navigate(PATHS.CLIENT.NEARBY_PROVIDERS, {

                    state: {

                        providers: response.providers,

                    },

                });

            }

        },5000);

        return () => clearInterval(interval);

        ===================================================
        */

        // Simulación temporal

        const timer = setTimeout(() => {

            navigate(PATHS.CLIENT.NEARBY_PROVIDERS);

        },8000);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col">

            <PageHeader
                title="Pedido"
                onBack={() => navigate(-1)}
                onClose={() => navigate("/cliente/home")}
            />

            {/* Contenedor principal que centra vertical y horizontalmente */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">

                {/* Círculo base: ahora es responsivo, más grande y mantiene proporción 1:1 */}
                <div
                    className="
                        relative
                        w-11/12
                        max-w-sm
                        aspect-square
                        rounded-full
                        bg-blue-50
                        flex
                        flex-col
                        items-center
                        justify-center
                        p-6
                    "
                >
                    {/* Ícono de la gota en el centro superior */}
                    <div
                        className="
                            w-24
                            h-24
                            rounded-full
                            bg-(--primary)
                            flex
                            items-center
                            justify-center
                            animate-pulse
                            mb-6
                        "
                    >
                        <FaTint
                            className="text-white"
                            size={38}
                        />
                    </div>

                    {/* Título configurado en una sola línea */}
                    <h2 className="text-2xl md:text-3xl font-bold text-(--primary) text-center whitespace-nowrap">
                        Buscando cisternas...
                    </h2>

                    {/* Subtexto descriptivo */}
                    <p
                        className="
                            mt-3
                            text-center
                            text-gray-600
                            text-base
                            max-w-xs
                            leading-relaxed
                        "
                    >
                        Conectando con proveedores cerca de tu ubicación
                    </p>
                </div>

            </div>

        </div>
    );

}