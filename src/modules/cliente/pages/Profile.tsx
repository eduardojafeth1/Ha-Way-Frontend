import { useState } from "react";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import EditProfileButton from "../components/profile/EditProfileButton";
import ProfileForm from "../components/profile/ProfileForm";
import SavedAddressSelect from "../components/profile/SavedAddressSelect";
import SavedCardsSection from "../components/profile/SavedCardsSection";
import SystemSettingsList from "../components/profile/SystemSettingsList";
import LogoutButton from "../components/profile/LogoutButton";
import BottomNavigation from "../components/BottomNavigation";

export default function Profile() {
  // Usuario temporal
  const [name, setName] = useState("Juan Pérez");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Direcciones temporales
  const [addresses] = useState([
    { id: 1, label: "Casa" },
    { id: 2, label: "Trabajo" },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState(1);

  // Tarjetas temporales
  const [cards] = useState([
    { id: 1, brand: "Visa", last4: "4242" },
    { id: 2, brand: "Mastercard", last4: "8888" },
  ]);

  const [selectedCardId, setSelectedCardId] = useState(2);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      <ProfileHeader
        title="Configuración de perfil"
        onBack={() => console.log("Volver")}
      />

      <main className="px-5 mt-2 space-y-6">

        <ProfileAvatar
          userName={name}
          photoUrl={null}
          onEditPhoto={() => console.log("Editar foto de perfil")}
        />

        <EditProfileButton
          onClick={() => console.log("Editar perfil")}
        />

        <ProfileForm
          name={name}
          email={email}
          phone={phone}
          onChangeName={setName}
          onChangeEmail={setEmail}
          onChangePhone={setPhone}
        />

        <SavedAddressSelect
          addresses={addresses}
          selectedId={selectedAddressId}
          onChange={setSelectedAddressId}
        />

        <SavedCardsSection
          cards={cards}
          selectedCardId={selectedCardId}
          onSelectCard={setSelectedCardId}
          onEditCard={(id) => console.log("Editar tarjeta", id)}
          onAddCard={() => console.log("Añadir nueva tarjeta")}
        />

        <SystemSettingsList
          onSecurityClick={() => console.log("Seguridad y permisos")}
          onHelpClick={() => console.log("Ayuda y soporte")}
        />

        <LogoutButton
          onClick={() => console.log("Cerrar sesión")}
        />

      </main>

      <BottomNavigation
        active="profile"
        onHomeClick={() => console.log("Ir a inicio")}
        onHistoryClick={() => console.log("Ir a historial")}
        onNotificationsClick={() => console.log("Ir a notificaciones")}
        onProfileClick={() => console.log("Ya estás en perfil")}
      />

    </div>
  );
}