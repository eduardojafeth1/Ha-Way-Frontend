interface ProgressIndicatorProps {
  step: number;
}

export default function ProgressIndicator({
  step,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">

      {/* Paso 1 */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          step >= 1
            ? "bg-(--secondary)"
            : "bg-gray-300"
        }`}
      />

      {/* Línea */}
      <div
        className={`w-16 h-1 transition-all duration-300 ${
          step >= 2
            ? "bg-(--secondary)"
            : "bg-gray-300"
        }`}
      />

      {/* Paso 2 */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          step >= 2
            ? "bg-(--secondary)"
            : "bg-gray-300"
        }`}
      />

      {/* Línea */}
      <div
        className={`w-16 h-1 transition-all duration-300 ${
          step >= 3
            ? "bg-(--secondary)"
            : "bg-gray-300"
        }`}
      />

      {/* Paso 3 */}
      <div
        className={`w-4 h-4 rounded-full transition-all duration-300 ${
          step >= 3
            ? "bg-(--secondary)"
            : "bg-gray-300"
        }`}
      />

    </div>
  );
}