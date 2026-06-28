import { Routes, Route } from "react-router-dom";

import SelectRole from "../modules/auth/pages/common/SelectRole";

import ClientLogin from "../modules/auth/pages/client/Login";
import ClientRegister from "../modules/auth/pages/client/Register";

import DriverLogin from "../modules/auth/pages/driver/loginDriver";

export default function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<SelectRole />}
      />

      <Route
        path="/cliente/login"
        element={<ClientLogin />}
      />

      <Route
        path="/cliente/register"
        element={<ClientRegister />}
      />

      <Route
        path="/conductor/login"
        element={<DriverLogin />}
      />

    </Routes>

  );

}