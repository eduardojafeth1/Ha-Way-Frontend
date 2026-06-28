import { useState } from "react";
import SelectRole from "./modules/auth/pages/SelectRole";
import Login from "./modules/auth/pages/Login";
import Register from "./modules/auth/pages/Register";

type Screen = "selectRole" | "login" | "register";

function App() {
  const [screen, setScreen] = useState<Screen>("selectRole");

  if (screen === "login") {
    return (
      <Login
        onBack={() => setScreen("selectRole")}
        onRegister={() => setScreen("register")}
      />
    );
  }

  if (screen === "register") {
    return <Register onBack={() => setScreen("login")} />;
  }

  return <SelectRole onClientClick={() => setScreen("login")} />;
}

export default App;