import { matchPath, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ROL_LABEL, initials } from "../utils/format.js";

// Título de cada ruta (las más específicas van primero).
const TITULOS = [
  { path: "/dashboard", eyebrow: "Panel principal", title: "Bienvenido/a de vuelta" },
  { path: "/pacientes/nuevo", eyebrow: "Gestión de pacientes", title: "Registrar paciente" },
  { path: "/pacientes/:id/editar", eyebrow: "Gestión de pacientes", title: "Modificar paciente" },
  { path: "/pacientes/:id", eyebrow: "Pacientes / Ficha", title: "Ficha de paciente" },
  { path: "/pacientes", eyebrow: "Gestión de pacientes", title: "Pacientes" },
  { path: "/controles", eyebrow: "Seguimiento de pacientes", title: "Controles" },
  { path: "/usuarios", eyebrow: "Administración", title: "Usuarios del sistema" },
  { path: "/perfil", eyebrow: "Cuenta", title: "Mi perfil" },
];

export default function Topbar() {
  const { session } = useAuth();
  const { pathname } = useLocation();
  const actual = TITULOS.find((t) => matchPath({ path: t.path, end: true }, pathname));
  const title = actual ? actual.title : "Caredent";

  useEffect(() => {
    document.title = `Caredent — ${title}`;
  }, [title]);

  return (
    <header className="topbar d-flex align-items-center justify-content-between gap-3 px-3 px-md-4">
      <div className="min-w-0">
        <span className="eyebrow d-block">{actual ? actual.eyebrow : ""}</span>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="user-pill d-flex align-items-center gap-2">
        <div className="avatar">{initials(session.nombre)}</div>
        <div className="d-none d-sm-block lh-sm">
          <div className="fw-semibold">{session.nombre}</div>
          <div className="text-muted small">{ROL_LABEL[session.rol] || session.rol}</div>
        </div>
      </div>
    </header>
  );
}
