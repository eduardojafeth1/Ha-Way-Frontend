import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "../../../routes/path";

import PageHeader from "../components/PageHeader";

import ProviderSummaryCard from "../components/OrderSummary/ProviderSummaryCard";
import DeliveryInfoCard from "../components/OrderSummary/DeliveryInfoCard";
import EstimatedTimeCard from "../components/OrderSummary/EstimatedTimeCard";
import PaymentMethodSelector from "../components/OrderSummary/PaymentMethodSelector";
import PaymentSummary from "../components/OrderSummary/PaymentSummary";

import type { SavedCard } from "../components/OrderSummary/SavedCardsList";
import type { PaymentMethod } from "../components/OrderSummary/PaymentMethodSelector";

export default function OrderSummary() {

    const navigate = useNavigate();

    /*
    ===========================================================

    BACKEND

    Esta pantalla recibirá toda la información del pedido.

    Puede recibirse mediante React Router:

    const { state } = useLocation();

    o consultando directamente el pedido:

    const order =
        await orderService.getOrderSummary(orderId);

    La información incluirá:

    - proveedor seleccionado
    - precio
    - cantidad
    - dirección
    - tiempo estimado
    - tarjetas del usuario

    ===========================================================
    */

    const provider = {

        name: "Cisterna Premium",

        image: null,

        quantity: 20,

        price: 1200,

        estimatedTime: "45 - 60 minutos",

    };

    const address =
        "Colonia Palmira, Tegucigalpa, Francisco Morazán";

    /*
    ===========================================================

    BACKEND

    const cards =
        await paymentService.getSavedCards();

    ===========================================================
    */

    const [cards] = useState<SavedCard[]>([

        {

            id: 1,

            brand: "Visa",

            last4: "4521",

        },

        {

            id: 2,

            brand: "Mastercard",

            last4: "8842",

        },

    ]);

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("cash");

    const [selectedCardId, setSelectedCardId] =
        useState<number | null>(null);

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {

        setLoading(true);

        /*
        =======================================================

        BACKEND

        await orderService.confirmOrder({

            paymentMethod,

            cardId: selectedCardId,

        });

        navigate(PATHS.CLIENT.ORDER_TRACKING);

        =======================================================
        */

        setTimeout(() => {

            setLoading(false);

            console.log({

                paymentMethod,

                selectedCardId,

            });

            navigate(PATHS.CLIENT.ORDER_TRACKING);

        },1500);

    };

    return (

        <div className="min-h-screen bg-gray-100">

            <PageHeader
                title="Resumen del Pedido"
                onClose={() => navigate(-1)}
            />

            <div className="px-5 py-6 pb-48 space-y-6">

                <ProviderSummaryCard
                    providerName={provider.name}
                    providerImage={provider.image}
                    quantity={provider.quantity}
                    price={provider.price}
                />

                <DeliveryInfoCard
                    address={address}
                />

                <EstimatedTimeCard
                    estimatedTime={provider.estimatedTime}
                />

                <PaymentMethodSelector
                    cards={cards}
                    onMethodChange={setPaymentMethod}
                    onCardSelected={setSelectedCardId}
                    onAddCard={() =>
                        navigate(PATHS.CLIENT.ADD_CARD)
                    }
                />

            </div>

            <PaymentSummary
                total={provider.price}
                paymentMethod={paymentMethod}
                selectedCardId={selectedCardId}
                loading={loading}
                onConfirm={handleConfirm}
            />

        </div>

    );

}