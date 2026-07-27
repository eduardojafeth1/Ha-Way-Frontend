import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./path";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Si no hay token, redirigir a la selección de rol
  if (!token) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Si hay token pero el rol no es el permitido, redirigir a la selección de rol
  if (allowedRoles && !allowedRoles.includes(userRole || "")) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  // Permitir el acceso renderizando las sub-rutas
  return <Outlet />;
}
