import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import DriverBottomNav from "../components/DriverBottomNav";

import {ProfileHeaderConductor as ProfileHeader} from "../components/profile/ProfileHeader";
import {ProfileAvatarConductor as ProfileAvatar } from "../components/profile/ProfileAvatar";
import { EditProfileButtonConductor as EditProfileButton} from "../components/profile/EditProfileButton";
import DriverProfileForm from "../components/profile/DriverProfileForm";
import SavedAddressSelect from "../components/profile/SavedAddressSelect";
import SavedCardsSection from "../components/profile/SavedCardsSection";
import {SystemSettingsListConductor as SystemSettingsList} from "../components/profile/SystemSettingsList";
import LogoutButton from "../components/profile/LogoutButton";
import { getJson, putJson, putFormData } from "../../../services/api";

export default function Profile() {
    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados de perfil
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    // Estados específicos del conductor
    const [identity, setIdentity] = useState("");
    const [license, setLicense] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [truckPhotoUrl, setTruckPhotoUrl] = useState<string | null>(null);
    const [truckPhotoFile, setTruckPhotoFile] = useState<File | null>(null);

    // Estados de control
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Estado para restaurar datos en caso de cancelar
    const [originalData, setOriginalData] = useState<any>({});

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
                
                // Cargar campos específicos del conductor
                setIdentity(data.identidad || "");
                setLicense(data.numero_licencia || "");
                setExpiryDate(data.fecha_vencimiento ? data.fecha_vencimiento.split("T")[0] : "");
                setTruckPhotoUrl(data.foto_camion || null);

                // Guardar copia original para restaurar al cancelar
                setOriginalData({
                    name: `${data.nombre || ""} ${data.apellido || ""}`.trim(),
                    email: data.correo || "",
                    phone: data.telefono || "",
                    photoUrl: data.foto || null,
                    identity: data.identidad || "",
                    license: data.numero_licencia || "",
                    expiryDate: data.fecha_vencimiento ? data.fecha_vencimiento.split("T")[0] : "",
                    truckPhotoUrl: data.foto_camion || null,
                });
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
                identidad: identity,
                numero_licencia: license,
                fecha_vencimiento: expiryDate,
            });

            // Subir foto del camión si se seleccionó una nueva
            let newTruckPhotoUrl = truckPhotoUrl;
            if (truckPhotoFile) {
                const formData = new FormData();
                formData.append("foto_camion", truckPhotoFile);
                const result = await putFormData("/users/perfil/foto_camion", formData);
                newTruckPhotoUrl = result.foto_camion;
                setTruckPhotoUrl(newTruckPhotoUrl);
                setTruckPhotoFile(null);
            }

            setSuccess("Perfil actualizado exitosamente.");
            setIsEditing(false);
            
            // Actualizar originalData con lo guardado
            setOriginalData({
                name,
                email,
                phone,
                photoUrl,
                identity,
                license,
                expiryDate,
                truckPhotoUrl: newTruckPhotoUrl
            });
        } catch (err: any) {
            setError(err.message || "Error al actualizar el perfil.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError("");
        setSuccess("");
        // Restaurar datos originales
        setName(originalData.name);
        setEmail(originalData.email);
        setPhone(originalData.phone);
        setIdentity(originalData.identity);
        setLicense(originalData.license);
        setExpiryDate(originalData.expiryDate);
        setTruckPhotoUrl(originalData.truckPhotoUrl);
        setTruckPhotoFile(null);
    };

    const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("foto_perfil", file);

            try {
                // Actualizar inmediatamente en el servidor
                const result = await putFormData("/users/perfil/foto_perfil", formData);
                setPhotoUrl(result.foto_perfil);
                setOriginalData((prev: any) => ({ ...prev, photoUrl: result.foto_perfil }));
                setSuccess("Foto de perfil actualizada exitosamente.");
            } catch (err: any) {
                setError(err.message || "Error al actualizar la foto de perfil.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-28">

            <ProfileHeader
                title="Configuración de perfil"
                onBack={() => navigate(PATHS.DRIVER.HOME)}
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
                            userName={name || "Conductor"}
                            photoUrl={photoUrl}
                            onEditPhoto={() => fileInputRef.current?.click()}
                        />
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleProfilePhotoChange}
                        />

                        <DriverProfileForm
                            name={name}
                            email={email}
                            phone={phone}
                            identity={identity}
                            license={license}
                            expiryDate={expiryDate}
                            truckPhotoUrl={truckPhotoFile ? URL.createObjectURL(truckPhotoFile) : truckPhotoUrl}
                            isEditing={isEditing}
                            onChangeName={setName}
                            onChangePhone={setPhone}
                            onChangeIdentity={setIdentity}
                            onChangeLicense={setLicense}
                            onChangeExpiryDate={setExpiryDate}
                            onChangeTruckPhoto={setTruckPhotoFile}
                        />

                        <EditProfileButton
                            isEditing={isEditing}
                            onEdit={() => setIsEditing(true)}
                            onCancel={handleCancel}
                            onSave={handleSave}
                            saving={saving}
                        />
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
                    onEditCard={(id) => console.log("Editar tarjeta", id)}
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

            {/* ── BOTTOM NAVIGATION ── */}
            <DriverBottomNav active="profile" />
        </div>
    );
}