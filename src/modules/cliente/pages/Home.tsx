import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { getJson } from "../../../services/api";

import Header from "../components/Home/Header";
import RequestWaterCard from "../components/Home/RequestWaterCard";
import CurrentOrderCard from "../components/Home/CurrentOrderCard";
import PreviousOrdersCard from "../components/Home/PreviousOrdersCard";
import BottomNavigation from "../components/Home/BottomNavigation";
import waterImage from "../../../assets/images/logo.png";

function isScheduledRequest(solicitud: any) {
  if (!solicitud.fecha_programada || !solicitud.hora_programada) {
    return false;
  }

  const fecha = solicitud.fecha_programada.split("T")[0];
  const hora = solicitud.hora_programada.substring(0, 8);

  const scheduledDate = new Date(`${fecha}T${hora}`);

  const publicationDate = new Date(solicitud.fecha_publicacion);

  /*
   * Los pedidos "Ahora" guardan prácticamente la misma
   * hora en que fueron publicados.
   *
   * Si hay más de 15 minutos de diferencia,
   * lo consideramos un pedido programado.
   */
  const differenceMinutes =
    (scheduledDate.getTime() - publicationDate.getTime()) /
    (1000 * 60);

  return differenceMinutes > 15;
}

export default function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Cargando...");
  const [currentOrders, setCurrentOrders] = useState<any[]>([]);
  const [previousOrders, setPreviousOrders] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar perfil
        const profile = await getJson("/users/perfil");
        setUserName(profile.nombre || "Cliente");

        // Cargar pedidos y solicitudes
        const [pedidos, solicitudes] = await Promise.all([
          getJson("/cliente/pedidos"),
          getJson("/cliente/solicitudes")
        ]);

        const activeOrdersList: any[] = [];
        const pastOrders: any[] = [];

        // 1. Revisar pedidos activos (en proceso)
        const activePedidos = pedidos.filter((p: any) => 
          ["PENDIENTE", "PREPARANDO", "EN_CAMINO", "LLEGO"].includes(p.estado)
        );

        activePedidos.forEach((activePedido: any) => {
          activeOrdersList.push({
            id: activePedido.id_pedido,
            type: "pedido",
            supplierName: `${activePedido.conductor_nombre} ${activePedido.conductor_apellido}`,
            barrels: activePedido.cantidad,
            date: new Date(activePedido.fecha_inicio).toLocaleDateString(),
            status: activePedido.estado,
            estimatedTime: `${activePedido.tiempo_estimado || 0} mins`,
            total: Number(activePedido.precio) || 0,
            image: activePedido.conductor_foto || waterImage
          });
        });

        // 2. Revisar solicitudes activas
        const activeSolicitudes = solicitudes.filter((s: any) => 
          ["PUBLICADA", "RECIBIENDO_OFERTAS"].includes(s.estado)
        );

        activeSolicitudes.forEach((activeSolicitud: any) => {
          const scheduled = isScheduledRequest(activeSolicitud);

          activeOrdersList.push({
            id: activeSolicitud.id_solicitud,

            type: scheduled
              ? "solicitud_programada"
              : "solicitud",

            supplierName: scheduled
              ? "Pedido programado"
              : "Buscando proveedores...",

            barrels: activeSolicitud.cantidad,

            date: scheduled
              ? new Date(
                  `${activeSolicitud.fecha_programada.split("T")[0]}T00:00:00`
                ).toLocaleDateString("es-HN")
              : new Date(
                  activeSolicitud.fecha_publicacion
                ).toLocaleDateString("es-HN"),

            status: scheduled
              ? "Programado"
              : activeSolicitud.estado === "PUBLICADA"
                ? "Buscando..."
                : "Ofertas recibidas",

            estimatedTime: scheduled
              ? activeSolicitud.hora_programada?.substring(0, 5) ?? "Pendiente"
              : "Pendiente",

            total: 0,

            image: waterImage,
          });
        });

        // 3. Obtener historial (pedidos entregados o cancelados)
        pedidos.forEach((p: any) => {
          if (["ENTREGADO", "CANCELADO"].includes(p.estado)) {
            pastOrders.push({
              id: p.id_pedido,
              supplierName: `${p.conductor_nombre} ${p.conductor_apellido}`,
              barrels: p.cantidad,
              date: new Date(p.fecha_inicio).toLocaleDateString(),
              total: Number(p.precio) || 0,
              image: p.conductor_foto || waterImage
            });
          }
        });

        setCurrentOrders(activeOrdersList);
        setPreviousOrders(pastOrders);

      } catch (err) {
        console.error("Error al cargar datos del Home:", err);
      }
    };

    fetchData();
  }, []);

  const handleViewCurrentOrder = async (
      id: number,
      type: string
    ) => {
      // Si ya es un pedido creado, ir al detalle normal
      if (type === "pedido") {
        navigate(PATHS.CLIENT.ORDER_DETAIL(id));
        return;
      }

      try {
        // Consultar si la solicitud ya tiene ofertas
        const offers = await getJson(
          `/cliente/solicitudes/${id}/ofertas`
        );

        // Si ya existen ofertas, mostrar directamente
        // la pantalla de selección de proveedores
        if (Array.isArray(offers) && offers.length > 0) {
          navigate(PATHS.CLIENT.WAITING(id));
          return;
        }

        // Si es una solicitud programada y aún no tiene ofertas
        if (type === "solicitud_programada") {
          navigate(PATHS.CLIENT.SCHEDULED(id));
          return;
        }

        // Solicitud inmediata sin ofertas
        navigate(PATHS.CLIENT.WAITING(id));

      } catch (error) {
        console.error(
          "Error al consultar las ofertas:",
          error
        );

        // En caso de error, mantener el flujo según el tipo
        if (type === "solicitud_programada") {
          navigate(PATHS.CLIENT.SCHEDULED(id));
        } else {
          navigate(PATHS.CLIENT.WAITING(id));
        }
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 pb-28">

      <Header
        userName={userName}
        onLogout={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          navigate(PATHS.HOME);
        }}
      />

      <main className="px-5 mt-6 space-y-6">

        <div className="flex justify-center">

          <RequestWaterCard
            onClick={() => {

              /*
              const hasActiveOrder = await orderService.hasActiveOrder();

              if (hasActiveOrder) {
                  toast.error("Ya tienes un pedido en curso.");
                  return;
              }
              */

              navigate(PATHS.CLIENT.CREATEORDER);


              

            }}
          />

        </div>

        <CurrentOrderCard
          order={currentOrders.length > 0 ? currentOrders[0] : null}
          hasMore={currentOrders.length > 1}
          onViewAll={() => navigate(PATHS.CLIENT.HISTORY)}
          onViewDetail={handleViewCurrentOrder}
          
        />

        <PreviousOrdersCard
          order={previousOrders.length > 0 ? previousOrders[0] : null}
          hasMore={previousOrders.length > 1}
          onViewAll={() => navigate(PATHS.CLIENT.HISTORY)}
          onViewDetail={(id) => {
            navigate(PATHS.CLIENT.ORDER_DETAIL(id));
          }}
        />

      </main>

      <BottomNavigation
        active="home"
        onHomeClick={() => {
          navigate(PATHS.CLIENT.HOME);
        }}
        onHistoryClick={() => {
          navigate(PATHS.CLIENT.HISTORY);
        }}
        onNotificationsClick={() => {
          navigate(PATHS.CLIENT.NOTIFICATIONS);
        }}
        onProfileClick={() => {
          navigate(PATHS.CLIENT.PROFILE);
        }}
      />

    </div>
  );
}