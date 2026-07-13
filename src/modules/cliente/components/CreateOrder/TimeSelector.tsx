import { useEffect, useMemo, useState } from "react";
import { PREPARATION_TIME, HOURS, OPENING_HOUR, CLOSING_HOUR } from "../../../../constants/schedule";

type DeliveryOption = "now" | "today" | "tomorrow";

interface TimeSelectorProps {
  schedule: DeliveryOption;
  onTimeChange?: (time: string | null) => void;
}

function formatLabel(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour.toString().padStart(2, "0")}:${displayMinute} ${period}`;
}

export default function TimeSelector({
  schedule,
  onTimeChange,
}: TimeSelectorProps) {

  // Rango de minutos (desde medianoche) permitido según el tipo de entrega

  const { minMinutes, maxMinutes, noAvailability } = useMemo(() => {

    const closing = CLOSING_HOUR * 60;
    const opening = OPENING_HOUR * 60;

    if (schedule === "tomorrow") {
      return { minMinutes: opening, maxMinutes: closing, noAvailability: false };
    }

    if (schedule === "now") {

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      // "now" no necesita rango de selección, pero sí debe
      // validar que quede tiempo de preparación antes del cierre

      const minimum = nowMinutes + PREPARATION_TIME;

      return {
        minMinutes: opening,
        maxMinutes: closing,
        noAvailability: nowMinutes < opening || minimum > closing,
      };

    }

    // schedule === "today"

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const minimum = Math.max(opening, nowMinutes + PREPARATION_TIME);

    return {
      minMinutes: minimum,
      maxMinutes: closing,
      noAvailability: minimum > closing,
    };

  }, [schedule]);

  const [inputValue, setInputValue] = useState(""); // "HH:mm" (24h)

  // Al cambiar de schedule, se resetea la hora seleccionada

  useEffect(() => {
    setInputValue("");
    onTimeChange?.(null);
  }, [schedule]); // eslint-disable-line react-hooks/exhaustive-deps

  const warning = useMemo(() => {

    if (!inputValue) return null;

    const [hourStr, minuteStr] = inputValue.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const totalMinutes = hour * 60 + minute;

    if (totalMinutes < OPENING_HOUR * 60 || totalMinutes >= CLOSING_HOUR * 60) {
      return `Fuera de horario. Atendemos de ${HOURS[0].label} a ${HOURS[HOURS.length - 1].label}.`;
    }

    if (totalMinutes < minMinutes) {
      return schedule === "today"
        ? `Se necesitan al menos ${PREPARATION_TIME} minutos de preparación. Elige una hora más adelante.`
        : `Elige una hora dentro del horario disponible.`;
    }

    return null;

  }, [inputValue, minMinutes, schedule]);

  const handleChange = (value: string) => {

    setInputValue(value);

    if (!value) {
      onTimeChange?.(null);
      return;
    }

    const [hourStr, minuteStr] = value.split(":");
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const totalMinutes = hour * 60 + minute;

    const isValid =
      totalMinutes >= minMinutes &&
      totalMinutes < CLOSING_HOUR * 60;

    if (isValid) {
      onTimeChange?.(formatLabel(hour, minute));
    } else {
      onTimeChange?.(null);
    }

  };

  if (schedule === "now" && !noAvailability) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
        <p className="text-gray-600 font-medium">
          Tu pedido será enviado al proveedor inmediatamente.
        </p>

        <p className="text-sm text-gray-400 mt-2">
          No es necesario seleccionar una hora.
        </p>
      </div>
    );
  }

  if (noAvailability) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
        <p className="text-red-500 font-semibold">
           {schedule === "now"
            ? "Ya no es posible enviar tu pedido de inmediato, estamos fuera de horario."
            : "Ya no hay horarios disponibles para hoy."}
        
        </p>

        <p className="text-gray-500 mt-2">
          Selecciona "Mañana" para ver más horarios.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      <input
        type="time"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`
          w-full
          py-3
          px-4
          rounded-xl
          border
          font-semibold
          text-gray-700
          transition-all
          outline-none
          ${
            warning
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-[var(--primary)]"
          }
        `}
      />

      <p className="text-sm text-gray-400">
        Horario disponible: {HOURS[0].label} - {HOURS[HOURS.length - 1].label}
        {schedule === "today" &&
          ` (mínimo ${PREPARATION_TIME} min de preparación)`}
      </p>

      {warning && (
        <p className="text-sm text-red-500 font-medium">
          {warning}
        </p>
      )}

    </div>
  );
}