import { useState } from "react";
import { FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { postJson } from "../../../services/api";

export interface SavedCard {
  id_tarjeta: number;
  marca: string;
  titular: string;
  ultimos4: string;
  principal: boolean;
}

interface AddCardFormProps {
  /** Se llama con la tarjeta ya guardada (respuesta del backend) cuando el guardado es exitoso. */
  onSuccess: (card: SavedCard) => void;
  /** Se llama al cancelar/cerrar el formulario sin guardar. */
  onCancel: () => void;
  submitLabel?: string;
}

// Longitud estándar del número de tarjeta y del CVV para Visa/Mastercard.
const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;

function validateNumeroTarjeta(value: string): string | undefined {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "El número de tarjeta es obligatorio.";
  if (!/^\d+$/.test(digits)) return "El número de tarjeta solo debe contener dígitos.";
  if (digits.length !== CARD_NUMBER_LENGTH) {
    return `El número de tarjeta debe tener ${CARD_NUMBER_LENGTH} dígitos (Visa/Mastercard).`;
  }
  return undefined;
}

function validateTitular(value: string): string | undefined {
  if (!value.trim()) return "El nombre del titular es obligatorio.";
  return undefined;
}

function validateFechaVencimiento(value: string): string | undefined {
  if (!value.trim()) return "La fecha de vencimiento es obligatoria.";

  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return "Formato inválido. Usa MM/YY.";

  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);

  if (month < 1 || month > 12) return "El mes debe estar entre 01 y 12.";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // La tarjeta es válida hasta el último día del mes indicado.
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "La tarjeta está vencida.";
  }

  // Evita fechas absurdamente lejanas (posible error de tipeo).
  if (year > currentYear + 20) {
    return "El año de vencimiento no es válido.";
  }

  return undefined;
}

function validateCvv(value: string): string | undefined {
  if (!value) return "El CVV es obligatorio.";
  if (!/^\d+$/.test(value)) return "El CVV solo debe contener dígitos.";
  if (value.length !== CVV_LENGTH) {
    return `El CVV debe tener ${CVV_LENGTH} dígitos (Visa/Mastercard).`;
  }
  return undefined;
}

/**
 * Formulario de "Añadir tarjeta", pensado para usarse igual en cualquier
 * pantalla (perfil, checkout, etc.). El contenedor (modal, página completa...)
 * lo decide quien lo use; este componente solo maneja los campos, la
 * validación y el guardado.
 */
export default function AddCardForm({ onSuccess, onCancel, submitLabel = "Guardar Tarjeta" }: AddCardFormProps) {
  const [newCard, setNewCard] = useState({
    numero_tarjeta: "",
    titular: "",
    fecha_vencimiento: "",
    cvv: "",
    marca: "Visa",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    numero_tarjeta?: string;
    titular?: string;
    fecha_vencimiento?: string;
    cvv?: string;
  }>({});

  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const errors = {
      numero_tarjeta: validateNumeroTarjeta(newCard.numero_tarjeta),
      titular: validateTitular(newCard.titular),
      fecha_vencimiento: validateFechaVencimiento(newCard.fecha_vencimiento),
      cvv: validateCvv(newCard.cvv),
    };

    setFieldErrors(errors);
    setFormError(null);

    const hasErrors = Object.values(errors).some((msg) => msg !== undefined);
    if (hasErrors) return;

    try {
      setIsSaving(true);
      const saved = await postJson("/cliente/tarjetas", newCard);
      onSuccess(saved);
    } catch (err: any) {
      setFormError(err.message || "Hubo un error al guardar la tarjeta.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
    }`;

  return (
    <div className="space-y-4">
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium p-3 rounded-xl">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Número de Tarjeta</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={16}
            value={newCard.numero_tarjeta}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setNewCard({ ...newCard, numero_tarjeta: digits });
              setFieldErrors((prev) => ({ ...prev, numero_tarjeta: undefined }));
            }}
            className={inputClass(fieldErrors.numero_tarjeta)}
            placeholder="0000000000000000"
          />
          <FaCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
        </div>
        {fieldErrors.numero_tarjeta && (
          <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.numero_tarjeta}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Titular</label>
        <input
          type="text"
          value={newCard.titular}
          onChange={(e) => {
            setNewCard({ ...newCard, titular: e.target.value });
            setFieldErrors((prev) => ({ ...prev, titular: undefined }));
          }}
          className={inputClass(fieldErrors.titular)}
          placeholder="Ej. Juan Pérez"
        />
        {fieldErrors.titular && (
          <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.titular}</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">Vencimiento</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={newCard.fecha_vencimiento}
            onChange={(e) => {
              let value = e.target.value.replace(/[^\d/]/g, "");
              // Auto-inserta la "/" después de escribir el mes (MM -> MM/)
              if (value.length === 2 && !value.includes("/") && !newCard.fecha_vencimiento.includes("/")) {
                value = `${value}/`;
              }
              setNewCard({ ...newCard, fecha_vencimiento: value });
              setFieldErrors((prev) => ({ ...prev, fecha_vencimiento: undefined }));
            }}
            className={inputClass(fieldErrors.fecha_vencimiento)}
            placeholder="MM/YY"
          />
          {fieldErrors.fecha_vencimiento && (
            <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.fecha_vencimiento}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={3}
            value={newCard.cvv}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              setNewCard({ ...newCard, cvv: digits });
              setFieldErrors((prev) => ({ ...prev, cvv: undefined }));
            }}
            className={inputClass(fieldErrors.cvv)}
            placeholder="123"
          />
          {fieldErrors.cvv && (
            <p className="mt-1 text-sm text-red-500 font-medium">{fieldErrors.cvv}</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-bold mt-6 hover:opacity-90 transition shadow-lg shadow-blue-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <FaCheckCircle size={18} />
        {isSaving ? "Guardando..." : submitLabel}
      </button>

      <button
        onClick={onCancel}
        disabled={isSaving}
        className="w-full bg-transparent text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-100 transition"
      >
        Cancelar
      </button>
    </div>
  );
}
