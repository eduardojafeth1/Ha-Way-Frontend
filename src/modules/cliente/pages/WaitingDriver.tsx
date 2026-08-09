import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PATHS } from "../../../routes/path";
import { getJson, putJson } from "../../../services/api";

import PageHeader from "../components/PageHeader";
import OfferSelectionView from "../components/Waiting/OfferSelectionView";

interface Offer {
  id_oferta: number;
  precio: number;
  tiempo_estimado: number;
  distancia: number | null;
  conductor_nombre: string;
  conductor_apellido: string;
  calificacion: number | null;
  camion_foto: string | null;
  conductor_foto: string | null;
}

export default function WaitingDriver() {
  const navigate = useNavigate();

  const { id } = useParams();

  const solicitudId = Number(id);

  const [offers, setOffers] = useState<Offer[]>([]);

  // Evita mostrar "Buscando cisternas" mientras
  // se realiza la primera consulta al backend.
  const [isLoadingOffers, setIsLoadingOffers] =
    useState(true);

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [isCancelling, setIsCancelling] =
    useState(false);

  const [error, setError] = useState("");

  /*
  ==========================================================
  OBTENER OFERTAS
  ==========================================================
  */

  const fetchOffers = async () => {
    if (!solicitudId) return;

    try {
      const data = await getJson(
        `/cliente/solicitudes/${solicitudId}/ofertas`
      );

      setOffers(
        Array.isArray(data)
          ? data
          : []
      );

      setError("");
    } catch (err) {
      console.error(
        "Error al obtener ofertas:",
        err
      );
    } finally {
      setIsLoadingOffers(false);
    }
  };

  /*
  ==========================================================
  CONSULTA INICIAL + POLLING
  ==========================================================

  Al entrar:

  - Si ya existen ofertas, se muestra directamente
    OfferSelectionView.

  - Si todavía no hay ofertas, se muestra
    "Buscando cisternas".

  Luego se consulta nuevamente cada 5 segundos.
  ==========================================================
  */

  useEffect(() => {
    if (!solicitudId) return;

    fetchOffers();

    const interval = setInterval(() => {
      fetchOffers();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [solicitudId]);

  /*
  ==========================================================
  CONFIRMAR OFERTA
  ==========================================================
  */

  const handleConfirmOffer = (
      offerId: number
    ) => {
      navigate(
        PATHS.CLIENT.CHECKOUT(offerId)
      );
    };

  /*
  ==========================================================
  CANCELAR SOLICITUD
  ==========================================================
  */

  const handleCancelRequest = async () => {
    if (isCancelling || isConfirming) return;

    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar esta solicitud?"
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      setError("");

      await putJson(
        `/cliente/solicitudes/${solicitudId}/cancelar`,
        {}
      );

      alert(
        "Solicitud cancelada exitosamente."
      );

      /*
      Puedes cambiar HISTORY por HOME si prefieres
      regresar directamente al inicio después de cancelar.
      */

      navigate(PATHS.CLIENT.HISTORY);

    } catch (err: any) {
      console.error(
        "Error al cancelar solicitud:",
        err
      );

      setError(
        err.message ||
          "No se pudo cancelar la solicitud."
      );

    } finally {
      setIsCancelling(false);
    }
  };

  /*
  ==========================================================
  VALIDAR ID
  ==========================================================
  */

  if (
    !solicitudId ||
    Number.isNaN(solicitudId)
  ) {
    return (
      <div className="min-h-screen bg-gray-100">

        <PageHeader
          title="Pedido"
          onClose={() =>
            navigate(PATHS.CLIENT.HOME)
          }
        />

        <div className="px-5 py-10 text-center">

          <p className="font-medium text-red-500">
            No se encontró la solicitud.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <PageHeader
        title="Pedido"
        onClose={() =>
          navigate(PATHS.CLIENT.HOME)
        }
      />

      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div className="px-5 pt-5">

          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-4
              text-sm
              font-medium
              text-red-600
            "
          >
            {error}
          </div>

        </div>
      )}

      {/* ==============================
          CARGA INICIAL
      ============================== */}

      {isLoadingOffers ? (

        <div
          className="
            min-h-[70vh]
            flex
            flex-col
            items-center
            justify-center
            px-6
          "
        >

          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-[var(--primary)]
              border-t-transparent
            "
          />

          <p className="mt-4 font-medium text-gray-500">
            Consultando ofertas...
          </p>

        </div>

      ) : offers.length === 0 ? (

        /* ==============================
            SIN OFERTAS
        ============================== */

        <div
          className="
            min-h-[75vh]
            flex
            flex-col
            items-center
            justify-center
            px-6
            text-center
          "
        >

          <div
            className="
              relative
              flex
              h-64
              w-64
              items-center
              justify-center
              rounded-full
              bg-blue-50
            "
          >

            <div
              className="
                flex
                h-28
                w-28
                animate-pulse
                items-center
                justify-center
                rounded-full
                bg-[var(--primary)]
              "
            >

              <span className="text-5xl text-white">
                💧
              </span>

            </div>

          </div>

          <h2
            className="
              mt-8
              text-3xl
              font-bold
              text-[var(--primary)]
            "
          >
            Buscando cisternas...
          </h2>

          <p
            className="
              mt-3
              max-w-sm
              leading-relaxed
              text-gray-500
            "
          >
            Estamos enviando tu solicitud a
            proveedores disponibles cerca de tu
            ubicación.
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Las ofertas aparecerán automáticamente.
          </p>

          {/* Cancelar mientras busca proveedores */}

          <div className="mt-8 w-full max-w-sm">

            <button
              type="button"
              onClick={handleCancelRequest}
              disabled={
                isCancelling ||
                isConfirming
              }
              className="
                w-full
                rounded-xl
                border
                border-red-200
                bg-red-50
                py-3
                font-bold
                text-red-600
                shadow-sm
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isCancelling
                ? "Cancelando..."
                : "Cancelar Solicitud"}
            </button>

          </div>

        </div>

      ) : (

        /* ==============================
            EXISTEN OFERTAS
        ============================== */

        <div className="flex min-h-[calc(100vh-80px)] flex-col">

          <div className="flex-1">

            <OfferSelectionView
              offers={offers}
              onConfirm={handleConfirmOffer}
              isConfirming={isConfirming}
            />

          </div>

          {/* Cancelar incluso si ya llegaron ofertas */}

          <div
            className="
              border-t
              border-gray-100
              bg-white
              px-5
              pb-10
              pt-4
            "
          >

            <button
              type="button"
              onClick={handleCancelRequest}
              disabled={
                isCancelling ||
                isConfirming
              }
              className="
                mx-auto
                block
                w-full
                max-w-md
                rounded-xl
                border
                border-red-200
                bg-red-50
                py-3
                font-bold
                text-red-600
                shadow-sm
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isCancelling
                ? "Cancelando..."
                : "Cancelar Solicitud"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}