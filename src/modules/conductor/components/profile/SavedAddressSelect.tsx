interface Address {
  id: number;
  label: string;
}

interface SavedAddressSelectProps {
  addresses: Address[];
  selectedId: number;
  onChange: (id: number) => void;
}

export default function SavedAddressSelect({
  addresses,
  selectedId,
  onChange,
}: SavedAddressSelectProps) {
  return (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">
        Direcciones guardadas
      </label>

      <select
        value={selectedId}
        onChange={(e) => onChange(Number(e.target.value))}
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
          appearance-none
        "
      >
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.label}
          </option>
        ))}
      </select>
    </div>
  );
}