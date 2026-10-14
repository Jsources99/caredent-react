import InfoItem from "../components/InfoItem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ROL_LABEL, initials } from "../utils/format.js";

export default function PerfilPage() {
  const { session, logout } = useAuth();
  const rol = ROL_LABEL[session.rol] || session.rol;

  return (
    <div className="profile-wrap">
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center gap-3 p-3 p-md-4">
          <div className="profile-avatar">{initials(session.nombre)}</div>
          <div>
            <div className="fs-5 fw-semibold">{session.nombre}</div>
            <div className="text-muted">{rol}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <InfoItem label="Usuario">{session.usuario}</InfoItem>
            <InfoItem label="Rol asignado">{rol}</InfoItem>
            <InfoItem label="Clínica">Caredent — Proyecto académico</InfoItem>
            <InfoItem label="Sesión iniciada">{new Date(session.inicio).toLocaleString("es-CL")}</InfoItem>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button type="button" className="btn btn-danger-soft" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
