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
  truckPhotoUrl?: string | null;
  onChangeTruckPhoto?: (file: File | null) => void;
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
  truckPhotoUrl,
  onChangeTruckPhoto,
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

      {/* Foto del Camión */}
      <div>
        <label className="text-sm text-gray-600 mb-2 block">
          Foto del Camión
        </label>
        
        {truckPhotoUrl && (
          <div className="mb-3 w-full h-48 bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
            <img src={truckPhotoUrl} alt="Foto del camión" className="w-full h-full object-cover" />
          </div>
        )}
        
        {isEditing && onChangeTruckPhoto && (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  onChangeTruckPhoto(e.target.files[0]);
                }
              }}
              className="
                w-full
                text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[var(--secondary)] file:text-white
                hover:file:opacity-90 cursor-pointer
              "
            />
            <p className="text-xs text-gray-400 mt-1">Sube una nueva foto para actualizar la imagen de tu camión.</p>
          </div>
        )}
      </div>

    </div>
  );
}
