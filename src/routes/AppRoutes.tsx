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
import DriverProfile from "../modules/conductor/pages/Profile";
import DriverNotifications from "../modules/conductor/pages/Notifications";
import DriverOrderTracking from "../modules/conductor/pages/OrderTracking";
import CreateOrder from "../modules/cliente/pages/CreateOrder";


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

      <Route
          path={PATHS.CLIENT.CREATEORDER}
          element={<CreateOrder />}
        />

      <Route 
        path={PATHS.DRIVER.HOME}
        element={<DriverHome />} 
      />

      <Route 
        path={PATHS.DRIVER.HISTORY}
        element={<DriverHistory />} 
      />

      <Route 
        path={PATHS.DRIVER.SEARCH}
        element={<SearchOrders />} 
      />

      <Route 
        path={PATHS.DRIVER.PROFILE}
        element={<DriverProfile />} 
      />
      
      <Route 
        path={PATHS.DRIVER.NOTIFICATIONS}
        element={<DriverNotifications />} 
      />

      <Route
          path={PATHS.DRIVER.TRACKING_CONFIG}
          element={<DriverOrderTracking />}
        />
      </Routes>

  );

}