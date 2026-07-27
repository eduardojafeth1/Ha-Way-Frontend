import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/path";
import {
    HiOutlineBell,
    HiOutlineHome,
    HiOutlineTruck,
    HiOutlineUser,
} from "react-icons/hi2";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileAvatar from "../components/profile/ProfileAvatar";
import EditProfileButton from "../components/profile/EditProfileButton";
import DriverProfileForm from "../components/profile/DriverProfileForm";
import SavedAddressSelect from "../components/profile/SavedAddressSelect";
import SavedCardsSection from "../components/profile/SavedCardsSection";
import SystemSettingsList from "../components/profile/SystemSettingsList";
import LogoutButton from "../components/profile/LogoutButton";
import { getJson, putJson } from "../../../services/api";

export default function Profile() {
    const navigate = useNavigate();

    // Estados de perfil
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    // Estados específicos del conductor
    const [identity, setIdentity] = useState("");
    const [license, setLicense] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

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
                
                // Cargar campos específicos del conductor
                setIdentity(data.identidad || "");
                setLicense(data.numero_licencia || "");
                setExpiryDate(data.fecha_vencimiento ? data.fecha_vencimiento.split("T")[0] : "");
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
                            onEditPhoto={() => console.log("Editar foto de perfil")}
                        />

                        <DriverProfileForm
                            name={name}
                            email={email}
                            phone={phone}
                            identity={identity}
                            license={license}
                            expiryDate={expiryDate}
                            onChangeName={setName}
                            onChangePhone={setPhone}
                            onChangeIdentity={setIdentity}
                            onChangeLicense={setLicense}
                            onChangeExpiryDate={setExpiryDate}
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

            {/* Barra inferior (mismo patrón que Home.tsx / History.tsx) */}
            <nav className="
                fixed bottom-0 left-0 right-0
                h-20 bg-[var(--primary)]
                flex justify-around items-center
                rounded-t-2xl shadow-lg z-50
            ">
                <NavItem
                    label="Notificaciones"
                    icon={<HiOutlineBell size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.NOTIFICATIONS)}
                />
                <NavItem
                    label="Inicio"
                    icon={<HiOutlineHome size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.HOME)}
                />
                <NavItem
                    label="Historial"
                    icon={<HiOutlineTruck size={28} />}
                    active={false}
                    onClick={() => navigate(PATHS.DRIVER.HISTORY)}
                />
                <NavItem
                    label="Perfil"
                    icon={<HiOutlineUser size={28} />}
                    active={true}
                    onClick={() => navigate(PATHS.DRIVER.PROFILE)}
                />
            </nav>

        </div>
    );
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center h-full flex-1 transition-all"
        >
            <div
                className={`
                    flex flex-col items-center justify-center w-full h-full transition-all
                    ${active ? "bg-[var(--secondary)] rounded-t-xl" : ""}
                `}
            >
                <div className="text-white">{icon}</div>
                <span className="text-white text-xs mt-1">{label}</span>
            </div>
        </button>
    );
}