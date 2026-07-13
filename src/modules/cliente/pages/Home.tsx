import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {PATHS} from "../../../routes/path";

import Header from "../components/Home/Header";
import RequestWaterCard from "../components/Home/RequestWaterCard";
import CurrentOrderCard from "../components/Home/CurrentOrderCard";
import PreviousOrdersCard from "../components/Home/PreviousOrdersCard";
import BottomNavigation from "../components/Home/BottomNavigation";

// Imagen temporal para pruebas
//import waterImage from "../../../assets/images/water-example.jpg";

export default function Home() {
  const navigate = useNavigate();
  /*
  ==================================================
  BACKEND
  ==================================================

  Cuando exista el backend, aquí obtendremos la
  información del usuario y sus pedidos.

  const user = await authService.getProfile();

  const currentOrder = await orderService.getCurrentOrder();

  const previousOrders = await orderService.getPreviousOrders();

  ==================================================
  */

  // Usuario temporal
  const userName = "Juan Pérez";

  /*
  ==================================================
  PEDIDO ACTUAL

  null = no tiene pedido

  Cuando exista backend reemplazar por:

  const currentOrder = await orderService.getCurrentOrder();

  ==================================================
  */

  const [currentOrder] = useState<any>(null);

  /*
  Para probar el diseño descomenta esto

  const [currentOrder] = useState({
      id:1,
      supplierName:"Agua Pura Exp.",
      barrels:20,
      date:"17/06/2026",
      status:"En camino",
      estimatedTime:"45 minutos",
      total:400,
      image:waterImage
  });
  */

  /*
  ==================================================
  PEDIDOS ANTERIORES

  Cuando exista backend:

  const previousOrders = await orderService.getPreviousOrders();

  ==================================================
  */

  const [previousOrders] = useState<any[]>([]);

  /*
  Para probar:

  const [previousOrders] = useState([
      {
          id:1,
          supplierName:"Agua Pura Exp.",
          barrels:20,
          date:"17/06/2026",
          total:400,
          image:waterImage
      }
  ]);
  */

  return (
    <div className="min-h-screen bg-gray-100 pb-28">

      <Header
        userName={userName}
        onLogout={() => {
          /*
          BACKEND

          await authService.logout();

          localStorage.removeItem("token");

          navigate(PATHS.AUTH.LOGIN);
          */

          console.log("Cerrar sesión");
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
          order={currentOrder}
          onViewDetail={(id) => {

            /*
            BACKEND

            navigate(PATHS.CLIENT.ORDER_DETAIL(id));

            */

            console.log(id);

          }}
        />

        <PreviousOrdersCard
          orders={previousOrders}
          onViewDetail={(id) => {

            /*
            BACKEND

            navigate(PATHS.CLIENT.ORDER_HISTORY(id));

            */

            console.log(id);

          }}
        />

      </main>

      <BottomNavigation
        active="home"
        onHomeClick={() => {

          /*
          navigate(PATHS.CLIENT.HOME);
          */

        }}
        onHistoryClick={() => {

          /*
          navigate(PATHS.CLIENT.HISTORY);
          */

        }}
        onNotificationsClick={() => {

          /*
          navigate(PATHS.CLIENT.NOTIFICATIONS);
          */

        }}
        onProfileClick={() => {

          /*
          navigate(PATHS.CLIENT.PROFILE);
          */

        }}
      />

    </div>
  );
}