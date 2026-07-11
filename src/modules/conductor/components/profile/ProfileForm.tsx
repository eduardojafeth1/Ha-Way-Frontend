interface ProfileFormProps {
  name: string;
  email: string;
  phone: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
}

export default function ProfileForm({
  name,
  email,
  phone,
  onChangeName,
  onChangeEmail,
  onChangePhone,
}: ProfileFormProps) {
  return (
    <div className="space-y-4">

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Nombre
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Ej. Juan"
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

      {/* Correo */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Correo
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="example@correo.com"
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

      {/* Teléfono */}
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          Teléfono
        </label>

        <input
          type="tel"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value)}
          placeholder="+504 1234 567"
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

    </div>
  );
}