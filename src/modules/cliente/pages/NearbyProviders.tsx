import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATHS } from "../../../routes/path";

import PageHeader from "../components/PageHeader";

import ProvidersHeader from "../components/NearbyProviders/ProvidersHeader";
import ProviderCard from "../components/NearbyProviders/ProviderCard";
import ConfirmProviderButton from "../components/NearbyProviders/ConfirmProviderButton";

interface ProviderOffer {
  id: number;

  name: string;

  // URL de la fotografía del proveedor.
  // Mientras no exista backend será null.
  image: string | null;

  estimatedTime: string;

  distance: number;

  rating: number;

  price: number;

  badge?: "closest" | "best-price";
}

export default function NearbyProviders() {
  const navigate = useNavigate();

  /*
  =========================================================

  BACKEND

  Aquí obtendremos las ofertas enviadas por los conductores.

  Solo se mostrarán aquellos proveedores que:

  - Estén disponibles.
  - Se encuentren cerca de la ubicación del cliente.
  - Hayan aceptado atender el pedido.
  - Hayan enviado una oferta.

  Ejemplo:

  const response =
      await orderService.getAvailableProviders(orderId);

  setProviders(response);

  Cada proveedor vendrá con información como:

  {
      id: 1,
      name: "Cisterna Premium",
      image: "https://api.haway.com/uploads/providers/15.jpg",
      estimatedTime: "15 - 20 min",
      distance: 2.4,
      rating: 4.9,
      price: 1200
  }

  =========================================================
  */

  const [providers, setProviders] = useState<ProviderOffer[]>([
    {
      id: 1,
      name: "Cisterna Premium",
      image: null,
      estimatedTime: "15 - 20 min",
      distance: 2.1,
      rating: 4.9,
      price: 1200,
      badge: "closest",
    },
    {
      id: 2,
      name: "Aqua Express",
      image: null,
      estimatedTime: "20 - 25 min",
      distance: 3.8,
      rating: 4.8,
      price: 1100,
      badge: "best-price",
    },
    {
      id: 3,
      name: "Agua del Valle",
      image: null,
      estimatedTime: "25 - 30 min",
      distance: 4.5,
      rating: 4.7,
      price: 1150,
    },
  ]);

  /*
  =========================================================

  BACKEND

  Cuando exista conexión con el backend,
  este useEffect cargará las ofertas.

  useEffect(() => {

      const loadProviders = async () => {

          const response =
              await orderService.getAvailableProviders(orderId);

          setProviders(response);

      };

      loadProviders();

  }, []);

  =========================================================
  */

  useEffect(() => {}, []);

  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (selectedProvider === null) return;

    setLoading(true);

    /*
    =========================================================

    BACKEND

    Aquí el cliente aceptará la oferta del proveedor.

    try {

        await orderService.acceptProviderOffer(
            selectedProvider
        );

        navigate(PATHS.CLIENT.ORDER_TRACKING);

    } catch (error) {

        console.error(error);

    } finally {

        setLoading(false);

    }

    =========================================================
    */

    // Simulación temporal

    setTimeout(() => {
      setLoading(false);

      console.log("Proveedor seleccionado:", selectedProvider);

      // navigate(PATHS.CLIENT.ORDER_TRACKING);

    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <PageHeader
        title="Pedido"
        onClose={() => navigate(PATHS.CLIENT.HOME)}
      />

      <div className="px-5 py-6 pb-36">

        <ProvidersHeader
          totalProviders={providers.length}
        />

        <div className="mt-6 space-y-4">

          {providers.map((provider) => (

            <ProviderCard
              key={provider.id}
              image={provider.image}
              name={provider.name}
              estimatedTime={provider.estimatedTime}
              distance={provider.distance}
              rating={provider.rating}
              price={provider.price}
              badge={provider.badge}
              selected={selectedProvider === provider.id}
              onSelect={() => setSelectedProvider(provider.id)}
            />

          ))}

        </div>

      </div>

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          bg-white
          border-t
          border-gray-200
          px-5
          py-5
        "
      >

        <ConfirmProviderButton
          disabled={selectedProvider === null}
          loading={loading}
          onClick={handleConfirm}
        />

      </div>

    </div>
  );
}