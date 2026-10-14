import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Brand from "./Brand.jsx";
import Icon from "./Icon.jsx";
import SidebarNav from "./SidebarNav.jsx";
import Topbar from "./Topbar.jsx";

// Estructura común de las páginas internas:
//  - Escritorio (lg y más): barra lateral fija a la izquierda.
//  - Móvil / tablet: barra superior con botón "Menú" que despliega los enlaces.
export default function AppLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();

  // Al navegar, el menú móvil se cierra.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  return (
    <div className="app-shell d-flex flex-column flex-lg-row">
      <aside className="sidebar d-none d-lg-flex flex-column">
        <Brand className="px-2 pb-4" />
        <SidebarNav />
      </aside>

      <header className="mobile-bar d-lg-none">
        <div className="d-flex align-items-center justify-content-between px-3 py-2">
          <Brand />
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <Icon name="menu" size={18} />
            Menú
          </button>
        </div>
        <div id="menu-movil" className={`collapse${menuAbierto ? " show" : ""}`}>
          <div className="px-3 pb-3">
            <SidebarNav />
          </div>
        </div>
      </header>

      <div className="app-main flex-grow-1">
        <Topbar />
        <main className="content p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
