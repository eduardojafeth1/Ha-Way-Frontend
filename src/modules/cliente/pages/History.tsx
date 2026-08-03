import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import { getJson } from "../../../services/api";
import PageHeader from "../components/PageHeader";
import BottomNavigation from "../components/Home/BottomNavigation";
import waterImage from "../../../assets/images/logo.png";
import gota from "../../../assets/icons/gota_pedidoactual.svg";
import relojIcon from "../../../assets/icons/reloj_pedidosanteriores.svg";

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"activos" | "pasados">("activos");
  
  const [currentOrders, setCurrentOrders] = useState<any[]>([]);
  const [previousOrders, setPreviousOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
          activeOrdersList.push({
            id: activeSolicitud.id_solicitud,
            type: "solicitud",
            supplierName: "Buscando proveedores...",
            barrels: activeSolicitud.cantidad,
            date: new Date(activeSolicitud.fecha_publicacion).toLocaleDateString(),
            status: activeSolicitud.estado === "PUBLICADA" ? "Buscando..." : "Ofertas recibidas",
            estimatedTime: "Pendiente",
            total: 0,
            image: waterImage
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
              status: p.estado,
              total: Number(p.precio) || 0,
              image: p.conductor_foto || waterImage
            });
          }
        });

        setCurrentOrders(activeOrdersList);
        setPreviousOrders(pastOrders);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderActiveOrders = () => {
    if (currentOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 text-lg font-semibold">No tienes pedidos activos</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {currentOrders.map((order) => (
          <div key={`${order.type}-${order.id}`} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <img src={gota} alt="" className="w-6 h-6" />
              <h2 className="font-bold text-gray-800">Pedido N°{String(order.id).padStart(5, '0')}</h2>
              <span className="ml-auto text-xs font-semibold bg-blue-50 text-blue-500 px-2 py-1 rounded">
                {order.status}
              </span>
            </div>
            
            <div className="flex gap-4">
              <img src={order.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-600">{order.supplierName}</h3>
                <p className="text-gray-700 text-sm">{order.barrels} barriles</p>
                <p className="text-gray-500 text-xs">{order.date}</p>
              </div>
              <div className="text-right flex flex-col justify-between">
                <span className="font-bold text-lg">L. {order.total.toFixed(2)}</span>
                <button
                  onClick={() => {
                    if (order.type === "solicitud") {
                      navigate(PATHS.CLIENT.WAITING(order.id));
                    } else {
                      navigate(PATHS.CLIENT.ORDER_DETAIL(order.id));
                    }
                  }}
                  className="text-sm text-[var(--primary)] font-semibold hover:underline"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPastOrders = () => {
    if (previousOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-400 text-lg font-semibold">No tienes pedidos pasados</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {previousOrders.map((order) => (
          <div key={`past-${order.id}`} className="bg-white rounded-xl shadow-sm p-4 opacity-80 hover:opacity-100 transition">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <img src={relojIcon} alt="" className="w-6 h-6" />
              <h2 className="font-bold text-gray-800">Pedido N°{String(order.id).padStart(5, '0')}</h2>
              <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded ${order.status === 'ENTREGADO' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex gap-4">
              <img src={order.image} alt="" className="w-16 h-16 rounded-lg object-cover grayscale" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700">{order.supplierName}</h3>
                <p className="text-gray-600 text-sm">{order.barrels} barriles</p>
                <p className="text-gray-400 text-xs">{order.date}</p>
              </div>
              <div className="text-right flex flex-col justify-between">
                <span className="font-bold text-lg text-gray-700">L. {order.total.toFixed(2)}</span>
                <button
                  onClick={() => navigate(PATHS.CLIENT.ORDER_DETAIL(order.id))}
                  className="text-sm text-gray-500 font-semibold hover:underline"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <PageHeader 
        title="HISTORIAL" 
        onBack={() => navigate(PATHS.CLIENT.HOME)} 
      />

      <div className="px-5 mt-6">
        {/* Tabs */}
        <div className="flex bg-gray-200 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("activos")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "activos" ? "bg-white text-[var(--primary)] shadow-sm" : "text-gray-500"
            }`}
          >
            Activos ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("pasados")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === "pasados" ? "bg-white text-[var(--primary)] shadow-sm" : "text-gray-500"
            }`}
          >
            Pasados ({previousOrders.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {activeTab === "activos" ? renderActiveOrders() : renderPastOrders()}
          </div>
        )}
      </div>

      <BottomNavigation
        active="history"
        onHomeClick={() => navigate(PATHS.CLIENT.HOME)}
        onHistoryClick={() => navigate(PATHS.CLIENT.HISTORY)}
        onNotificationsClick={() => navigate(PATHS.CLIENT.NOTIFICATIONS)}
        onProfileClick={() => navigate(PATHS.CLIENT.PROFILE)}
      />
    </div>
  );
}
