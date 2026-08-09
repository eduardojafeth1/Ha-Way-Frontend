import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";

import ProfileHeader from "../../conductor/components/profile/ProfileHeader";
import ProfileAvatar from "../../conductor/components/profile/ProfileAvatar";
import EditProfileButton from "../../conductor/components/profile/EditProfileButton";
import ClientProfileForm from "../components/profile/ClientProfileForm";
import SavedAddressSelect from "../../conductor/components/profile/SavedAddressSelect";
import ClientSavedCardsSection from "../components/profile/ClientSavedCardsSection";
import SystemSettingsList from "../../conductor/components/profile/SystemSettingsList";
import LogoutButton from "../../conductor/components/profile/LogoutButton";
import BottomNavigation from "../components/Home/BottomNavigation";
import { getJson, putJson, putFormData } from "../../../services/api";

export default function Profile() {
  const navigate = useNavigate();

  // Estados de perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Estados específicos del cliente
  const [address, setAddress] = useState("");

  // Estado de edición
  const [isEditing, setIsEditing] = useState(false);

  // Estados de control
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Direcciones reales
  const [addresses, setAddresses] = useState<{ id: number; label: string; address: string; }[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Subida de foto de perfil
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);


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

        // Cargar lista de direcciones guardadas
        const dirs = await getJson("/cliente/direcciones");
        setAddresses(dirs);
        if (dirs.length > 0) {
          const principal = dirs.find((d: any) => d.principal) || dirs[0];
          setSelectedAddressId(principal.id);
        }
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
      setIsEditing(false); // Salir del modo de edición al guardar
    } catch (err: any) {
      setError(err.message || "Error al actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  // Subir nueva foto de perfil
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset del input para poder volver a seleccionar el mismo archivo si hace falta
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }

    setError("");
    setSuccess("");
    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("foto_perfil", file);

      const result = await putFormData("/users/perfil/foto_perfil", formData);
      setPhotoUrl(result.foto_perfil);
      setSuccess("Foto de perfil actualizada.");
    } catch (err: any) {
      setError(err.message || "Error al actualizar la foto de perfil.");
    } finally {
      setUploadingPhoto(false);
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
            {/* Input de archivo oculto, disparado por el botón de editar foto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <ProfileAvatar
              userName={name || "Cliente"}
              photoUrl={photoUrl}
              onEditPhoto={() => {
                if (!uploadingPhoto) fileInputRef.current?.click();
              }}
            />

            {uploadingPhoto && (
              <p className="text-center text-sm text-gray-500 -mt-4">Subiendo foto...</p>
            )}

            <ClientProfileForm
              name={name}
              email={email}
              phone={phone}
              address={address}
              onChangeName={setName}
              onChangePhone={setPhone}
              onChangeAddress={setAddress}
              isEditing={isEditing}
            />

            <EditProfileButton
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onCancel={() => setIsEditing(false)}
              onSave={handleSave}
              saving={saving}
            />
          </>
        )}

        <SavedAddressSelect
          addresses={addresses}
          selectedId={selectedAddressId || 0}
          onChange={setSelectedAddressId}
        />

        <ClientSavedCardsSection />

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
        onHistoryClick={() => navigate(PATHS.CLIENT.HISTORY)}
        onNotificationsClick={() => navigate(PATHS.CLIENT.NOTIFICATIONS)}
        onProfileClick={() => navigate(PATHS.CLIENT.PROFILE)}
      />
    </div>
  );
}