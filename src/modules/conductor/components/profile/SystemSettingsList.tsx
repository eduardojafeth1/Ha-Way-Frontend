import {
  HiOutlineShieldCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronRight,
} from "react-icons/hi2";

interface SystemSettingsListProps {
  onSecurityClick: () => void;
  onHelpClick: () => void;
}

export default function SystemSettingsList({
  onSecurityClick,
  onHelpClick,
}: SystemSettingsListProps) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">
        Configuración del sistema
      </p>

      <div className="space-y-3">

        <button
          onClick={onSecurityClick}
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <HiOutlineShieldCheck
              size={22}
              className="text-[var(--primary)]"
            />

            <span className="text-gray-800">
              Seguridad y permisos
            </span>
          </div>

          <HiOutlineChevronRight className="text-gray-400" />
        </button>

        <button
          onClick={onHelpClick}
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <HiOutlineQuestionMarkCircle
              size={22}
              className="text-[var(--primary)]"
            />

            <span className="text-gray-800">
              Ayuda y soporte
            </span>
          </div>

          <HiOutlineChevronRight className="text-gray-400" />
        </button>

      </div>
    </div>
  );
}