import { HiOutlinePencil } from "react-icons/hi2";

interface ProfileAvatarProps {
  userName: string;
  photoUrl?: string | null;
  onEditPhoto: () => void;
}

export default function ProfileAvatar({
  userName,
  photoUrl,
  onEditPhoto,
}: ProfileAvatarProps) {
  return (
    <div className="flex flex-col items-center mt-6">

      {/* Foto de perfil */}
      <div className="relative">

        <div className="w-28 h-28 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">

          {photoUrl && (
            <img
              src={photoUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          )}

        </div>

        {/* Botón editar foto */}
        <button
          onClick={onEditPhoto}
          className="
            absolute
            bottom-1
            right-1
            w-8
            h-8
            bg-[var(--primary)]
            rounded-full
            flex
            items-center
            justify-center
            text-white
            shadow-md
            hover:opacity-90
            transition
          "
        >
          <HiOutlinePencil size={16} />
        </button>

      </div>

      {/* Nombre */}
      <h2 className="mt-3 text-xl font-bold text-gray-900">
        {userName}
      </h2>

    </div>
  );
}