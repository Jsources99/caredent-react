import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { ROL_LABEL, initials } from "../utils";

function Info({ label, children }) {
  return (
    <div className="info-item">
      <div className="info-item__label">{label}</div>
      <div className="info-item__value">{children}</div>
    </div>
  );
}

export default function Perfil() {
  const { session, logout } = useAuth();
  return (
    <Layout eyebrow="Cuenta" title="Mi perfil">
      <div className="profile-card">
        <div className="profile-card__avatar">{initials(session.nombre)}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{session.nombre}</div>
          <div className="text-muted" style={{ marginTop: 2 }}>{ROL_LABEL[session.rol]}</div>
        </div>
      </div>
      <div className="profile-list">
        <div className="info-grid">
          <Info label="Usuario">{session.usuario}</Info>
          <Info label="Rol asignado">{ROL_LABEL[session.rol]}</Info>
          <Info label="Clínica">Caredent — Proyecto académico</Info>
          <Info label="Sesión iniciada">{new Date(session.inicio).toLocaleString("es-CL")}</Info>
        </div>
      </div>
      <div className="mt-24">
        <button className="btn btn--danger" onClick={logout}>Cerrar sesión</button>
      </div>
    </Layout>
  );
}
