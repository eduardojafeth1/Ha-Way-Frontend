interface DriverProfileFormProps {
  name: string;
  email: string;
  phone: string;
  identity: string;
  license: string;
  expiryDate: string;
  isEditing?: boolean;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeIdentity: (value: string) => void;
  onChangeLicense: (value: string) => void;
  onChangeExpiryDate: (value: string) => void;
}

export default function DriverProfileForm({
  name,
  email,
  phone,
  identity,
  license,
  expiryDate,
  isEditing = false,
  onChangeName,
  onChangePhone,
  onChangeIdentity,
  onChangeLicense,
  onChangeExpiryDate,
}: DriverProfileFormProps) {
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
          readOnly={!isEditing}
          placeholder="Ej. Luis Rodriguez"
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            ${isEditing 
              ? "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)]" 
              : "bg-gray-50 text-gray-600 cursor-not-allowed"}
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
          readOnly={!isEditing}
          placeholder="+504 9999-0000"
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            ${isEditing 
              ? "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)]" 
              : "bg-gray-50 text-gray-600 cursor-not-allowed"}
          `}
        />
      </div>

      {/* Identidad (DNI) */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Identidad (DNI)
        </label>
        <input
          type="text"
          value={identity}
          onChange={(e) => onChangeIdentity(e.target.value)}
          readOnly={!isEditing}
          placeholder="0801-1990-12345"
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            ${isEditing 
              ? "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)]" 
              : "bg-gray-50 text-gray-600 cursor-not-allowed"}
          `}
        />
      </div>

      {/* Número de Licencia */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Número de licencia
        </label>
        <input
          type="text"
          value={license}
          onChange={(e) => onChangeLicense(e.target.value)}
          readOnly={!isEditing}
          placeholder="HN-12345"
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            ${isEditing 
              ? "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)]" 
              : "bg-gray-50 text-gray-600 cursor-not-allowed"}
          `}
        />
      </div>

      {/* Fecha de vencimiento de licencia */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Fecha de vencimiento de licencia
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => onChangeExpiryDate(e.target.value)}
          readOnly={!isEditing}
          className={`
            w-full
            rounded-xl
            px-4
            py-3
            outline-none
            ${isEditing 
              ? "bg-gray-100 text-gray-800 focus:ring-2 focus:ring-[var(--primary)]" 
              : "bg-gray-50 text-gray-600 cursor-not-allowed"}
          `}
        />
      </div>

    </div>
  );
}
