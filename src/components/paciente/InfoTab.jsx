import EstadoBadge from "../EstadoBadge.jsx";
import InfoItem from "../InfoItem.jsx";
import { formatDate } from "../../utils/format.js";

export default function InfoTab({ paciente: p }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3">
          <InfoItem label="Nombre completo">
            {p.nombre} {p.apellidos}
          </InfoItem>
          <InfoItem label="RUT">{p.rut}</InfoItem>
          <InfoItem label="Fecha de nacimiento">{formatDate(p.fechaNacimiento)}</InfoItem>
          <InfoItem label="Teléfono">{p.telefono}</InfoItem>
          <InfoItem label="Correo electrónico">{p.correo}</InfoItem>
          <InfoItem label="Dirección">{p.direccion || "—"}</InfoItem>
          <InfoItem label="Última atención">{formatDate(p.ultimaAtencion)}</InfoItem>
          <InfoItem label="Estado del paciente">
            <EstadoBadge estado={p.estado} />
          </InfoItem>
        </div>
      </div>
    </div>
  );
}
