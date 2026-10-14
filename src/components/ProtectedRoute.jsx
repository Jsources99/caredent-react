import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Protege rutas: sin sesión va al login; con un rol no permitido vuelve al inicio.
//   roles (opcional): lista de roles que pueden entrar
export default function ProtectedRoute({ roles }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.rol)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
