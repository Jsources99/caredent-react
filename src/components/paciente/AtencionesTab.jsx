import EmptyState from "../EmptyState.jsx";
import { formatDate } from "../../utils/format.js";

export default function AtencionesTab({ paciente }) {
  if (!paciente.atenciones.length) {
    return <EmptyState>Aún no se han registrado atenciones para este paciente.</EmptyState>;
  }
  return (
    <div className="d-flex flex-column gap-2">
      {paciente.atenciones.map((a, i) => (
        <div className="card" key={`${a.fecha}-${i}`}>
          <div className="card-body">
            <div className="d-flex flex-wrap justify-content-between gap-1">
              <div className="record-title">{a.motivo}</div>
              <div className="record-date">{formatDate(a.fecha)}</div>
            </div>
            <div className="record-body">
              {a.notas}
              <br />
              <span className="cell-sub">Atendido por {a.profesional}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
