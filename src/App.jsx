import { Navigate, Route, Routes } from "react-router-dom";
import Guard from "./components/Guard";
import Agenda from "./pages/Agenda";
import Controles from "./pages/Controles";
import Dashboard from "./pages/Dashboard";
import EditarPaciente from "./pages/EditarPaciente";
import Login from "./pages/Login";
import Paciente from "./pages/Paciente";
import Pacientes from "./pages/Pacientes";
import Perfil from "./pages/Perfil";
import RegistrarPaciente from "./pages/RegistrarPaciente";
import Usuarios from "./pages/Usuarios";

const PROFESIONAL = ["profesional"];
const TODOS = ["administrador", "recepcionista", "profesional"];

const protegida = (roles, page) => <Guard roles={roles}>{page}</Guard>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={protegida(PROFESIONAL, <Dashboard />)} />
      <Route path="/pacientes" element={protegida(PROFESIONAL, <Pacientes />)} />
      <Route path="/pacientes/nuevo" element={protegida(PROFESIONAL, <RegistrarPaciente />)} />
      <Route path="/pacientes/:id" element={protegida(PROFESIONAL, <Paciente />)} />
      <Route path="/pacientes/:id/editar" element={protegida(PROFESIONAL, <EditarPaciente />)} />
      <Route path="/controles" element={protegida(PROFESIONAL, <Controles />)} />
      <Route path="/agenda" element={protegida(["recepcionista"], <Agenda />)} />
      <Route path="/usuarios" element={protegida(["administrador"], <Usuarios />)} />
      <Route path="/perfil" element={protegida(TODOS, <Perfil />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
