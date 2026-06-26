import type { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor: string;
}

export default function InfoCard({
  icon,
  title,
  description,
  iconColor,
}: InfoCardProps) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-4">

      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${iconColor}`}
      >
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>

        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>

    </div>
  );
}