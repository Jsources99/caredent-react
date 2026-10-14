import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ControlesPage from "./pages/ControlesPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EditarPacientePage from "./pages/EditarPacientePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PacientePage from "./pages/PacientePage.jsx";
import PacientesPage from "./pages/PacientesPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import RegistrarPacientePage from "./pages/RegistrarPacientePage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";

// Roles que pueden crear y modificar pacientes.
const OPERATIVOS = ["recepcionista", "profesional"];

// Mapa de navegación de la app (React Router).
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Todo lo que está aquí dentro exige sesión iniciada */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/:id" element={<PacientePage />} />
          <Route path="/controles" element={<ControlesPage />} />
          <Route path="/perfil" element={<PerfilPage />} />

          <Route element={<ProtectedRoute roles={OPERATIVOS} />}>
            <Route path="/pacientes/nuevo" element={<RegistrarPacientePage />} />
            <Route path="/pacientes/:id/editar" element={<EditarPacientePage />} />
          </Route>

          <Route element={<ProtectedRoute roles={["administrador"]} />}>
            <Route path="/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
