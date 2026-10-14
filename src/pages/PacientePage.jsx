import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState.jsx";
import AtencionesTab from "../components/paciente/AtencionesTab.jsx";
import DiagnosticosTab from "../components/paciente/DiagnosticosTab.jsx";
import FichaTab from "../components/paciente/FichaTab.jsx";
import InfoTab from "../components/paciente/InfoTab.jsx";
import PacienteHeader from "../components/paciente/PacienteHeader.jsx";
import SeguimientoTab from "../components/paciente/SeguimientoTab.jsx";
import TratamientosTab from "../components/paciente/TratamientosTab.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { deletePatient, getPatientById, updatePatient } from "../services/storage.js";

const TABS = [
  { id: "informacion", label: "Información" },
  { id: "ficha", label: "Ficha clínica" },
  { id: "diagnosticos", label: "Diagnósticos" },
  { id: "tratamientos", label: "Tratamientos" },
  { id: "atenciones", label: "Atenciones" },
  { id: "seguimiento", label: "Seguimiento" },
];

export default function PacientePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const showToast = useToast();
  const [paciente, setPaciente] = useState(() => getPatientById(id));
  const [tab, setTab] = useState("informacion");

  // Si se navega a otro paciente con la página ya abierta, se recarga.
  useEffect(() => {
    setPaciente(getPatientById(id));
    setTab("informacion");
  }, [id]);

  if (!paciente) {
    return (
      <EmptyState>
        Paciente no encontrado. <Link to="/pacientes">Volver al listado</Link>.
      </EmptyState>
    );
  }

  const esAdmin = session.rol === "administrador";
  const esProfesional = session.rol === "profesional";

  // Las pestañas llaman a esta función (por props) para guardar cambios.
  const guardar = (cambios, mensaje) => {
    const actualizado = updatePatient(paciente.id, cambios);
    if (actualizado) setPaciente(actualizado);
    if (mensaje) showToast(mensaje);
  };

  const eliminarPaciente = () => {
    if (!window.confirm("¿Eliminar definitivamente este paciente de la demostración frontend?")) return;
    deletePatient(paciente.id);
    showToast("Paciente eliminado correctamente.");
    navigate("/pacientes");
  };

  return (
    <>
      <PacienteHeader paciente={paciente} puedeEditar={!esAdmin} onEliminar={eliminarPaciente} />

      <ul className="nav nav-tabs flex-nowrap overflow-x-auto mb-4" role="tablist">
        {TABS.map((t) => (
          <li className="nav-item" role="presentation" key={t.id}>
            <button
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`nav-link text-nowrap${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {tab === "informacion" && <InfoTab paciente={paciente} />}
      {tab === "ficha" && <FichaTab paciente={paciente} />}
      {tab === "diagnosticos" && (
        <DiagnosticosTab paciente={paciente} puedeEliminar={esProfesional} onGuardar={guardar} />
      )}
      {tab === "tratamientos" && <TratamientosTab paciente={paciente} session={session} onGuardar={guardar} />}
      {tab === "atenciones" && <AtencionesTab paciente={paciente} />}
      {tab === "seguimiento" && <SeguimientoTab paciente={paciente} session={session} onGuardar={guardar} />}
    </>
  );
}
