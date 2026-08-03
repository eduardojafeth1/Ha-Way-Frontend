import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import type { LocationData } from "./location.types";

interface AddAddressDetailsModalProps {
  isOpen: boolean;
  location: LocationData | null;
  onSave: (data: { nombre: string; referencia: string; lat: number; lng: number; direccion: string }) => Promise<void>;
  onClose: () => void;
}

export default function AddAddressDetailsModal({
  isOpen,
  location,
  onSave,
  onClose,
}: AddAddressDetailsModalProps) {
  const [nombre, setNombre] = useState("");
  const [referencia, setReferencia] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !location) return null;

  const handleSave = async () => {
    if (!nombre.trim()) {
      setError("Por favor, ponle un nombre a tu dirección (ej. Casa).");
      return;
    }
    
    setIsSaving(true);
    setError(null);

    try {
      await onSave({
        nombre: nombre.trim(),
        referencia: referencia.trim(),
        lat: location.lat!,
        lng: location.lng!,
        direccion: location.address
      });
      // Limpiar formulario al guardar con éxito
      setNombre("");
      setReferencia("");
    } catch (err: any) {
      setError(err.message || "Error al guardar la dirección.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 animate-[slideUp_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-gray-900">
            Detalles de ubicación
          </h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
            <HiOutlineXMark />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Nombre de la dirección
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Casa, Trabajo, Casa de mi mamá"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Dirección
            </label>
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {location.address}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              Referencia (opcional)
            </label>
            <textarea
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej. Frente a la farmacia, casa azul con portón negro..."
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 font-medium">
              {error}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[var(--primary)] text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Guardando...
              </>
            ) : (
              "Guardar dirección"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
