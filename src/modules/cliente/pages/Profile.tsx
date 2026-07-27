import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";

import ProfileHeader from "../../conductor/components/profile/ProfileHeader";
import ProfileAvatar from "../../conductor/components/profile/ProfileAvatar";
import EditProfileButton from "../../conductor/components/profile/EditProfileButton";
import ClientProfileForm from "../components/profile/ClientProfileForm";
import SavedAddressSelect from "../../conductor/components/profile/SavedAddressSelect";
import SavedCardsSection from "../../conductor/components/profile/SavedCardsSection";
import SystemSettingsList from "../../conductor/components/profile/SystemSettingsList";
import LogoutButton from "../../conductor/components/profile/LogoutButton";
import BottomNavigation from "../components/Home/BottomNavigation";
import { getJson, putJson } from "../../../services/api";

export default function Profile() {
  const navigate = useNavigate();

  // Estados de perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Estados específicos del cliente
  const [address, setAddress] = useState("");

  // Estados de control
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Cargar perfil al montar
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getJson("/users/perfil");
        setName(`${data.nombre || ""} ${data.apellido || ""}`.trim());
        setEmail(data.correo || "");
        setPhone(data.telefono || "");
        setPhotoUrl(data.foto || null);
        setAddress(data.direccion_predeterminada || "");
      } catch (err: any) {
        setError("Error al cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Guardar cambios
  const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    const nameParts = name.trim().split(" ");
    const nombre = nameParts[0] || "";
    const apellido = nameParts.slice(1).join(" ") || "";

    try {
      await putJson("/users/perfil", {
        nombre,
        apellido,
        telefono: phone,
        direccion_predeterminada: address,
      });
      setSuccess("Perfil actualizado exitosamente.");
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">

      <ProfileHeader
        title="Configuración de perfil"
        onBack={() => navigate(PATHS.CLIENT.HOME)}
      />

      <main className="px-5 mt-2 space-y-6">

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 text-sm font-medium p-3 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-gray-500 text-sm">Cargando perfil...</p>
          </div>
        ) : (
          <>
            <ProfileAvatar
              userName={name || "Cliente"}
              photoUrl={photoUrl}
              onEditPhoto={() => console.log("Editar foto de perfil")}
            />

            <ClientProfileForm
              name={name}
              email={email}
              phone={phone}
              address={address}
              onChangeName={setName}
              onChangePhone={setPhone}
              onChangeAddress={setAddress}
            />

            <EditProfileButton
              onClick={handleSave}
            />

            {saving && (
              <div className="text-center text-sm text-gray-500 animate-pulse">
                Guardando cambios...
              </div>
            )}
          </>
        )}

        <SavedAddressSelect
          addresses={addresses}
          selectedId={selectedAddressId}
          onChange={setSelectedAddressId}
        />

        <SavedCardsSection
          cards={cards}
          selectedCardId={selectedCardId}
          onSelectCard={setSelectedCardId}
          onEditCard={(id: number) => console.log("Editar tarjeta", id)}
          onAddCard={() => console.log("Añadir nueva tarjeta")}
        />

        <SystemSettingsList
          onSecurityClick={() => console.log("Seguridad y permisos")}
          onHelpClick={() => console.log("Ayuda y soporte")}
        />

        <LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            navigate(PATHS.HOME);
          }}
        />

      </main>

      <BottomNavigation
        active="profile"
        onHomeClick={() => navigate(PATHS.CLIENT.HOME)}
        onHistoryClick={() => console.log("Ir a historial")}
        onNotificationsClick={() => console.log("Ir a notificaciones")}
        onProfileClick={() => {}}
      />

    </div>
  );
}