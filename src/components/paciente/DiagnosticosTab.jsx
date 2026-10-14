import EmptyState from "../EmptyState.jsx";
import { formatDate } from "../../utils/format.js";

// Solo el rol "profesional" puede eliminar diagnósticos.
export default function DiagnosticosTab({ paciente, puedeEliminar, onGuardar }) {
  const eliminar = (indice) => {
    if (!window.confirm("¿Eliminar este diagnóstico?")) return;
    onGuardar({ diagnosticos: paciente.diagnosticos.filter((_, i) => i !== indice) }, "Diagnóstico eliminado.");
  };

  if (!paciente.diagnosticos.length) {
    return <EmptyState>Aún no se han registrado diagnósticos para este paciente.</EmptyState>;
  }

  return (
    <div className="d-flex flex-column gap-2">
      {paciente.diagnosticos.map((d, i) => (
        <div className="card" key={`${d.fecha}-${i}`}>
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between gap-1">
              <div className="record-title">{d.descripcion}</div>
              <div className="record-date">{formatDate(d.fecha)}</div>
            </div>
            <div className="record-body">
              Registrado por {d.profesional}.
              {puedeEliminar && (
                <button type="button" className="btn btn-danger-soft btn-sm ms-2" onClick={() => eliminar(i)}>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
