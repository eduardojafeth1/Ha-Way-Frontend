interface ClientProfileFormProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeAddress: (value: string) => void;
  isEditing?: boolean;
}

export default function ClientProfileForm({
  name,
  email,
  phone,
  address,
  onChangeName,
  onChangePhone,
  onChangeAddress,
  isEditing = false,
}: ClientProfileFormProps) {
  return (
    <div className="space-y-4">

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Nombre completo
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Ej. Juan Pérez"
          readOnly={!isEditing}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            text-gray-800
            outline-none
            transition-colors
            ${
              isEditing
                ? "bg-gray-100 focus:ring-2 focus:ring-[var(--primary)] placeholder-gray-400"
                : "bg-gray-50 border border-gray-200 cursor-not-allowed opacity-70"
            }
          `}
        />
      </div>

      {/* Correo (Solo lectura) */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Correo electrónico (No modificable)
        </label>
        <input
          type="email"
          value={email}
          readOnly
          className="
            w-full
            bg-gray-200
            text-gray-500
            cursor-not-allowed
            rounded-xl
            px-4
            py-3
            outline-none
          "
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Teléfono
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="+504 9999-0000"
          readOnly={!isEditing}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            text-gray-800
            outline-none
            transition-colors
            ${
              isEditing
                ? "bg-gray-100 focus:ring-2 focus:ring-[var(--primary)] placeholder-gray-400"
                : "bg-gray-50 border border-gray-200 cursor-not-allowed opacity-70"
            }
          `}
        />
      </div>

      {/* Dirección predeterminada */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Dirección predeterminada
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => onChangeAddress(e.target.value)}
          placeholder="Ej. Colonia Las Minitas, casa 4"
          readOnly={!isEditing}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            text-gray-800
            outline-none
            transition-colors
            ${
              isEditing
                ? "bg-gray-100 focus:ring-2 focus:ring-[var(--primary)] placeholder-gray-400"
                : "bg-gray-50 border border-gray-200 cursor-not-allowed opacity-70"
            }
          `}
        />
      </div>

    </div>
  );
}
