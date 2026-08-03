import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJson } from "../../../services/api";
import { PATHS } from "../../../routes/path";
import {
  HiOutlineBell,
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineUser,
} from "react-icons/hi2";

interface DriverBottomNavProps {
  active: "notifications" | "home" | "history" | "profile";
}

export default function DriverBottomNav({ active }: DriverBottomNavProps) {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getJson("/conductor/notificaciones/unread");
        setUnreadCount(res.unread || 0);
      } catch (err) {}
    };

    fetchUnread();
    const intervalId = setInterval(fetchUnread, 10000); // 10 segundos
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="
        fixed bottom-0 left-0 right-0
        h-20 bg-[var(--secondary)]
        flex justify-around items-center
        rounded-t-2xl shadow-lg z-50
    ">
        <NavItem
            label="Notificaciones"
            icon={<HiOutlineBell size={28} />}
            active={active === "notifications"}
            onClick={() => navigate(PATHS.DRIVER.NOTIFICATIONS)}
            badge={unreadCount}
        />
        <NavItem
            label="Inicio"
            icon={<HiOutlineHome size={28} />}
            active={active === "home"}
            onClick={() => navigate(PATHS.DRIVER.HOME)}
        />
        <NavItem
            label="Historial"
            icon={<HiOutlineTruck size={28} />}
            active={active === "history"}
            onClick={() => navigate(PATHS.DRIVER.HISTORY)}
        />
        <NavItem
            label="Perfil"
            icon={<HiOutlineUser size={28} />}
            active={active === "profile"}
            onClick={() => navigate(PATHS.DRIVER.PROFILE)}
        />
    </nav>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

function NavItem({ icon, label, active, onClick, badge = 0 }: NavItemProps) {
  return (
      <button
          onClick={onClick}
          className="flex flex-col items-center justify-center h-full flex-1 transition-all"
      >
          <div
              className={`
                  relative flex flex-col items-center justify-center w-full h-full transition-all
                  ${active ? "bg-[var(--primary)] rounded-t-xl" : ""}
              `}
          >
              <div className="text-white relative">
                  {icon}
                  {badge > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[var(--secondary)]">
                          {badge > 9 ? '9+' : badge}
                      </span>
                  )}
              </div>
              <span className="text-white text-xs mt-1">{label}</span>
          </div>
      </button>
  );
}
