import InfoItem from "../InfoItem.jsx";
import { formatDate } from "../../utils/format.js";

function Registro({ titulo, children }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="record-title">{titulo}</div>
        <div className="record-body">{children}</div>
      </div>
    </div>
  );
}

export default function FichaTab({ paciente: p }) {
  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <InfoItem label="Grupo sanguíneo">{p.fichaClinica.grupoSanguineo}</InfoItem>
            <InfoItem label="Ficha creada el">{formatDate(p.fichaClinica.fechaCreacion)}</InfoItem>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column gap-2">
        <Registro titulo="Observaciones generales">{p.fichaClinica.observaciones}</Registro>
        <Registro titulo="Antecedentes médicos">{p.antecedentes.medicos}</Registro>
        <Registro titulo="Antecedentes odontológicos">{p.antecedentes.odontologicos}</Registro>
        <Registro titulo="Alergias">{p.antecedentes.alergias}</Registro>
      </div>
    </>
  );
}
