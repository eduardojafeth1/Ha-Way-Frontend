import { useState } from "react";

import SelectRole from "./modules/auth/pages/SelectRole";

import ClientLogin from "./modules/auth/pages/Login";
import ClientRegister from "./modules/auth/pages/Register";

import LoginDriver from "./modules/auth/pages/conductor/loginDriver";

type Screen =
  | "selectRole"
  | "clientLogin"
  | "clientRegister"
  | "loginDriver";

function App() {
  const [screen, setScreen] = useState<Screen>("selectRole");

  if (screen === "clientLogin") {
    return (
      <ClientLogin
        onBack={() => setScreen("selectRole")}
        onRegister={() => setScreen("clientRegister")}
      />
    );
  }

  if (screen === "clientRegister") {
    return (
      <ClientRegister
        onBack={() => setScreen("clientLogin")}
      />
    );
  }

  if (screen === "loginDriver") {
    return (
      <LoginDriver
        onBack={() => setScreen("selectRole")}
      />
    );
  }

  return (
    <SelectRole
      onClientClick={() => setScreen("clientLogin")}
      onDriverClick={() => setScreen("loginDriver")}
    />
  );
}

export default App;