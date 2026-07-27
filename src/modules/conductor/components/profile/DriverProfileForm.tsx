interface DriverProfileFormProps {
  name: string;
  email: string;
  phone: string;
  identity: string;
  license: string;
  expiryDate: string;
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
          placeholder="Ej. Luis Rodriguez"
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
          "
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
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
          "
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
          placeholder="0801-1990-12345"
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
          "
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
          placeholder="HN-12345"
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            placeholder-gray-400
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
          "
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
          className="
            w-full
            bg-gray-100
            rounded-xl
            px-4
            py-3
            text-gray-800
            outline-none
            focus:ring-2
            focus:ring-[var(--primary)]
          "
        />
      </div>

    </div>
  );
}
