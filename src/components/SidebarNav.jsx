import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Icon from "./Icon.jsx";

const ENLACES = [
  { to: "/dashboard", label: "Inicio", icon: "home" },
  { to: "/pacientes", label: "Pacientes", icon: "user" },
  { to: "/controles", label: "Controles", icon: "calendar" },
  { to: "/usuarios", label: "Usuarios", icon: "users", roles: ["administrador"] },
];

// NavLink marca solo cuál enlace está activo según la URL actual.
const claseEnlace = ({ isActive }) => `sidebar-link${isActive ? " is-active" : ""}`;

export default function SidebarNav() {
  const { session, logout } = useAuth();
  const visibles = ENLACES.filter((e) => !e.roles || e.roles.includes(session.rol));

  return (
    <nav className="d-flex flex-column flex-grow-1" aria-label="Navegación principal">
      <div className="nav-label">General</div>
      {visibles.map((e) => (
        <NavLink key={e.to} to={e.to} className={claseEnlace}>
          <Icon name={e.icon} />
          {e.label}
        </NavLink>
      ))}

      <div className="mt-lg-auto pt-3">
        <NavLink to="/perfil" className={claseEnlace}>
          <Icon name="user" />
          Mi perfil
        </NavLink>
        <button type="button" className="sidebar-link w-100" onClick={logout}>
          <Icon name="logout" />
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
