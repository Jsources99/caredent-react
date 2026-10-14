import { Link } from "react-router-dom";
import EstadoBadge from "../EstadoBadge.jsx";
import { calcularEdad, initials } from "../../utils/format.js";

// Cabecera de la ficha. puedeEditar = false oculta Modificar/Eliminar (rol administrador).
export default function PacienteHeader({ paciente, puedeEditar, onEliminar }) {
  const edad = calcularEdad(paciente.fechaNacimiento);
  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-wrap align-items-center gap-3">
        <div className="patient-avatar">{initials(`${paciente.nombre} ${paciente.apellidos}`)}</div>
        <div className="min-w-0">
          <h2 className="patient-name">
            {paciente.nombre} {paciente.apellidos}
          </h2>
          <div className="patient-meta">
            <span>{paciente.rut}</span>
            <span>{edad ? `${edad} años` : "Edad no disponible"}</span>
            <span>{paciente.telefono}</span>
          </div>
        </div>
        <div className="ms-md-auto d-flex flex-column align-items-start align-items-md-end gap-2">
          <EstadoBadge estado={paciente.estado} />
          {puedeEditar && (
            <div className="d-flex gap-2">
              <Link className="btn btn-ghost btn-sm" to={`/pacientes/${paciente.id}/editar`}>
                Modificar
              </Link>
              <button type="button" className="btn btn-danger-soft btn-sm" onClick={onEliminar}>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
