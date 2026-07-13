import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineUser,
} from "react-icons/hi2";

interface BottomNavigationProps {
  active: "notifications" | "home" | "history" | "profile";

  onNotificationsClick: () => void;
  onHomeClick: () => void;
  onHistoryClick: () => void;
  onProfileClick: () => void;
}

export default function BottomNavigation({
  active,
  onNotificationsClick,
  onHomeClick,
  onHistoryClick,
  onProfileClick,
}: BottomNavigationProps) {
  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        h-20
        bg-[var(--primary)]
        flex
        justify-around
        items-center
        rounded-t-2xl
        shadow-lg
        z-50
      "
    >
      <NavItem
        label="Notificaciones"
        icon={<HiOutlineBell size={28} />}
        active={active === "notifications"}
        onClick={onNotificationsClick}
      />

      <NavItem
        label="Inicio"
        icon={<HiOutlineHome size={28} />}
        active={active === "home"}
        onClick={onHomeClick}
      />

      <NavItem
        label="Historial"
        icon={<HiOutlineTruck size={28} />}
        active={active === "history"}
        onClick={onHistoryClick}
      />

      <NavItem
        label="Perfil"
        icon={<HiOutlineUser size={28} />}
        active={active === "profile"}
        onClick={onProfileClick}
      />
    </nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        flex-col
        items-center
        justify-center
        h-full
        flex-1
        transition-all
      "
    >
      <div
        className={`
          flex
          flex-col
          items-center
          justify-center
          w-full
          h-full
          transition-all
          ${
            active
              ? "bg-[var(--secondary)] rounded-t-xl"
              : ""
          }
        `}
      >
        <div className="text-white">{icon}</div>

        <span className="text-white text-xs mt-1">
          {label}
        </span>
      </div>
    </button>
  );
}