import { useState } from "react";
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
import ProfileForm from "../components/profile/ProfileForm";
import SavedAddressSelect from "../components/profile/SavedAddressSelect";
import SavedCardsSection from "../components/profile/SavedCardsSection";
import SystemSettingsList from "../components/profile/SystemSettingsList";
import LogoutButton from "../components/profile/LogoutButton";


export default function Profile() {
    const navigate = useNavigate();

    // Usuario temporal
    const [name, setName] = useState("Luis Rodriguez");
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
                onBack={() => navigate(PATHS.DRIVER.HOME)}
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
                    onClick={() => { }}
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