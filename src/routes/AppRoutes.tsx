import { Routes, Route } from "react-router-dom";
import { PATHS } from "./path";
import SelectRole from "../modules/auth/pages/common/SelectRole";
import ClientLogin from "../modules/auth/pages/client/Login";
import ClientRegister from "../modules/auth/pages/client/Register";
import DriverLogin from "../modules/auth/pages/driver/loginDriver";
import DriverRegister from "../modules/auth/pages/driver/registerDriver";
import CLientHome from "../modules/cliente/pages/Home";
import DriverHome from "../modules/conductor/pages/Home";
import DriverHistory from "../modules/conductor/pages/History";
import SearchOrders from "../modules/conductor/pages/SearchOrders";


export default function AppRoutes() {

  return (

    <Routes>

      <Route
        path={PATHS.HOME}
        element={<SelectRole />}
      />

      <Route
        path={PATHS.CLIENT.LOGIN}
        element={<ClientLogin />}
      />

      <Route
        path={PATHS.CLIENT.REGISTER}
        element={<ClientRegister />}
      />

      <Route
        path={PATHS.DRIVER.LOGIN}
        element={<DriverLogin />}
      />

      <Route
        path={PATHS.DRIVER.REGISTER}
        element={<DriverRegister />}
      />

      <Route
        path={PATHS.CLIENT.HOME}
        element={<CLientHome />}
      />

      <Route path={PATHS.DRIVER.HOME}
        element={<DriverHome />} />

      <Route path={PATHS.DRIVER.HISTORY}
        element={<DriverHistory />} />

      <Route path="/conductor/buscar-pedidos"
        element={<SearchOrders />} />

    </Routes>

  );

}