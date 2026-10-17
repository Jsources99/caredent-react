import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HOME } from "../roles";

export default function Guard({ roles, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (!roles.includes(session.rol)) return <Navigate to={HOME[session.rol]} replace />;
  return children;
}
