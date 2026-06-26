import type { ReactNode } from "react";

interface RoleButtonProps {
  text: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

export default function RoleButton({
  text,
  icon,
  color,
  onClick,
}: RoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full max-w-sm h-16 rounded-full text-white font-semibold text-lg flex items-center justify-center gap-3 transition hover:scale-105 ${color}`}
    >
      {icon}
      {text}
    </button>
  );
}