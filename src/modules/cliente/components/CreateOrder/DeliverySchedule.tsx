import { useState, useEffect } from "react";

type DeliveryOption = "now" | "today" | "tomorrow";

interface DeliveryScheduleProps {
  onScheduleChange?: (value: DeliveryOption) => void;
}

export default function DeliverySchedule({
  onScheduleChange,
}: DeliveryScheduleProps) {
  const [selected, setSelected] = useState<DeliveryOption>("today");

  useEffect(() => {
    onScheduleChange?.(selected);
  }, [selected, onScheduleChange]);

  const options = [
    {
      label: "Ahora",
      value: "now",
    },
    {
      label: "Hoy",
      value: "today",
    },
    {
      label: "Mañana",
      value: "tomorrow",
    },
  ];

  return (
    <div className="flex justify-between gap-4">

      {options.map((option) => (

        <button
          key={option.value}
          onClick={() => setSelected(option.value as DeliveryOption)}
          className={`
            flex-1
            py-3
            rounded-2xl
            border
            font-semibold
            transition-all
            ${
              selected === option.value
                ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                : "bg-white border-gray-300 text-gray-700 hover:border-[var(--primary)]"
            }
          `}
        >
          {option.label}
        </button>

      ))}

    </div>
  );
}