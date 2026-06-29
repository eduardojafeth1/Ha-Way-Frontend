import { Routes, Route } from "react-router-dom";
import { PATHS } from "./path";
import SelectRole from "../modules/auth/pages/common/SelectRole";
import ClientLogin from "../modules/auth/pages/client/Login";
import ClientRegister from "../modules/auth/pages/client/Register";
import DriverLogin from "../modules/auth/pages/driver/loginDriver";

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

    </Routes>

  );

}