interface ProvidersHeaderProps {
  totalProviders: number;
}

export default function ProvidersHeader({
  totalProviders,
}: ProvidersHeaderProps) {
  return (
    <div className="flex items-center justify-between">

      <h2 className="text-2xl font-bold text-gray-900">
        Cercanos a ti
      </h2>

      <div
        className="
          px-4
          py-2
          rounded-full
          bg-blue-100
          text-(--primary)
          font-semibold
          text-sm
        "
      >
        {totalProviders} {totalProviders === 1 ? "cisterna" : "cisternas"}
      </div>

    </div>
  );
}