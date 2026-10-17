import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROL_LABEL, initials } from "../utils";
import { IconCalendar, IconHome, IconLogout, IconPerson, IconUsers } from "./Icons";

const NAV = {
  profesional: [
    { to: "/", label: "Inicio", icon: <IconHome />, end: true },
    { to: "/pacientes", label: "Pacientes", icon: <IconPerson /> },
    { to: "/controles", label: "Controles", icon: <IconCalendar /> },
  ],
  recepcionista: [{ to: "/agenda", label: "Agenda de horas", icon: <IconCalendar /> }],
  administrador: [{ to: "/usuarios", label: "Usuarios", icon: <IconUsers /> }],
};

const linkClass = ({ isActive }) => `nav-link${isActive ? " is-active" : ""}`;

export default function Layout({ eyebrow, title, children }) {
  const { session, logout } = useAuth();

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">
          <img alt="" className="brand__mark" src={`${import.meta.env.BASE_URL}logo.svg`} style={{ color: "#F4FAF8" }} />
          <span className="brand__word">Care<em>dent</em></span>
        </div>
        <div className="nav-group">
          <div className="nav-label">General</div>
          {NAV[session.rol].map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar-foot">
          <div className="nav-group" style={{ marginBottom: 0 }}>
            <NavLink to="/perfil" className={linkClass}>
              <IconPerson />
              Mi perfil
            </NavLink>
            <a className="nav-link" href="#salir" onClick={(e) => { e.preventDefault(); logout(); }}>
              <IconLogout />
              Cerrar sesión
            </a>
          </div>
        </div>
      </nav>
      <div>
        <header className="topbar">
          <div className="topbar__title">
            <span className="eyebrow">{eyebrow}</span>
            {title}
          </div>
          <div className="topbar__right">
            <div className="user-pill">
              <div className="avatar">{initials(session.nombre)}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{session.nombre}</div>
                <div className="text-muted" style={{ fontSize: "11.5px" }}>{ROL_LABEL[session.rol]}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
